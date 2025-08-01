import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const LOCATION_TASK_NAME = 'background-location-task';
const BACKGROUND_LOCATION_INTERVAL = 5 * 1000; // 5 minutes in milliseconds

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.error('Background location error:', error);
    return;
  }
  if (data) {
    const { locations } = data as any;
    // You can save locations to state, send to server, etc.
    console.log('Received new locations in background:', locations);
  }
});

const useLocationBackground = () => {
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
      if (bgStatus !== 'granted') {
        setErrorMsg('Permission to access background location was denied');
        return;
      }
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: BACKGROUND_LOCATION_INTERVAL, // 5 minutes in ms
        distanceInterval: 0,
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: 'CrowdSurfer',
          notificationBody: 'Tracking your location in the background',
        },
      });
    })();

    return () => {
      Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME).then((started) => {
        if (started) Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      });
    };
  }, []);

  // Optionally, get the last known location for display
  useEffect(() => {
    (async () => {
      const last = await Location.getLastKnownPositionAsync();
      if (last) setLocation(last);
    })();
  }, []);

  return { location, errorMsg };
};

export default useLocationBackground;