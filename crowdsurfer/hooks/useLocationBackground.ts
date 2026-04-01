import { API_BASE_URL } from '@/constants/api';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

const LOCATION_TASK_NAME = 'background-location-task';
const BACKGROUND_INTERVAL_MS = 300_000; // 5 minutes

// ── Stable user identifier ────────────────────────────────────────────────────
// Generated once per app session.  Sufficient for the 10-minute heatmap window.
// For persistence across restarts, store this in AsyncStorage or SecureStore.
const generateId = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });

const SESSION_USER_ID = generateId();

// ── Helper: POST current position to backend ──────────────────────────────────
const postLocation = async (latitude: number, longitude: number) => {
  try {
    await axios.post(`${API_BASE_URL}/save-user-location/`, {
      user_Id: SESSION_USER_ID,
      latitude,
      longitude,
    });
  } catch (err) {
    // Non-fatal — location will be retried on next interval
    console.warn('Failed to post location to API:', err);
  }
};

// ── Background task (native only) ────────────────────────────────────────────
// TaskManager.defineTask must be called at module load time, before any
// component mounts.  It is skipped on web because TaskManager has no web impl.
if (Platform.OS !== 'web') {
  TaskManager.defineTask(
    LOCATION_TASK_NAME,
    async ({ data, error }: { data: any; error: any }) => {
      if (error) {
        console.error('Background location error:', error);
        return;
      }
      const { locations } = data ?? {};
      if (locations?.length > 0) {
        const { latitude, longitude } = locations[0].coords;
        await postLocation(latitude, longitude);
      }
    },
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
const useLocationBackground = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      if (Platform.OS === 'web') {
        // Web: foreground watch via the browser Geolocation API
        watchRef.current = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Balanced, timeInterval: 60_000 },
          (loc) => {
            setLocation(loc);
            postLocation(loc.coords.latitude, loc.coords.longitude);
          },
        );
        return;
      }

      // Native: request background permission, then start the background task
      const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
      if (bgStatus !== 'granted') {
        setErrorMsg('Permission to access background location was denied');
        return;
      }

      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: BACKGROUND_INTERVAL_MS,
        distanceInterval: 0,
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: 'CrowdSurfer',
          notificationBody: 'Tracking your location in the background',
        },
      });
    })();

    return () => {
      watchRef.current?.remove();
      if (Platform.OS !== 'web') {
        Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME).then((started) => {
          if (started) Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        });
      }
    };
  }, []);

  // Seed the displayed position from the last known fix (native only)
  useEffect(() => {
    if (Platform.OS !== 'web') {
      Location.getLastKnownPositionAsync().then((last) => {
        if (last) setLocation(last);
      });
    }
  }, []);

  return {
    latitude: location?.coords.latitude ?? -1,
    longitude: location?.coords.longitude ?? -1,
    errorMsg,
  };
};

export default useLocationBackground;
