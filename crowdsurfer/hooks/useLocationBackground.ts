import getLocalTimeString from '@/hooks/getLocalTimeString';
import prependUserLocation from '@/hooks/prependUserLocation';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

const LOCATION_TASK_NAME = 'background-location-task';
const BACKGROUND_INTERVAL_MS = 300_000; // 5 minutes

// Background task registration must happen at module load time on native.
// TaskManager and background location are not available on web.
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
        await prependUserLocation({
          latitude,
          longitude,
          timestamp: getLocalTimeString(),
        });
      }
    },
  );
}

const useLocationBackground = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  // Start location tracking
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      if (Platform.OS === 'web') {
        // Web only supports foreground watching via the browser Geolocation API
        watchRef.current = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Balanced, timeInterval: 60_000 },
          (loc) => setLocation(loc),
        );
        return;
      }

      // Native: request background permission and start the background task
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
      // Clean up web watch subscription
      watchRef.current?.remove();

      // Stop native background task
      if (Platform.OS !== 'web') {
        Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME).then((started) => {
          if (started) Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        });
      }
    };
  }, []);

  // Seed the initial position from the last known fix (native only)
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
