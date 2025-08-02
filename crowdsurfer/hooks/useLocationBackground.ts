import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import getLocalTimeString from '@/hooks/getLocalTimeString';
import prependUserLocation from '@/hooks/prependUserLocation';



const LOCATION_TASK_NAME = 'background-location-task';
const BACKGROUND_LOCATION_INTERVAL = 300000; // 5 minutes in milliseconds

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  const localTime = getLocalTimeString();
  if (error) {
    console.error('Background location error:', error);
    return;
  }
  if (data) {
    const { locations } = data as any;
    if (locations && locations.length > 0) {
      const loc = locations[0];
      await prependUserLocation({//sends the data to a json file or creates a new one if it doesn't exist, this will eventually be replaced with a database
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        timestamp: getLocalTimeString(),//format may need a change in the future
      });
    }
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
  const latitude = location?.coords.latitude ?? null;
  const longitude = location?.coords.longitude ?? null;
  

  return { latitude, longitude, errorMsg };
  
  
};

export default useLocationBackground;