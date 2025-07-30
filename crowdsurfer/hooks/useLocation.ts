// hooks/useLocationPolling.ts
import { useEffect, useState, useRef } from 'react';
import * as Location from 'expo-location';

const POLL_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

const useLocation = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(POLL_INTERVAL / 1000); // in seconds

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        const msg = 'Permission to access location was denied';
        setErrorMsg(msg);
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      setLatitude(coords.latitude);
      setLongitude(coords.longitude);
      console.log('Updated location:', coords.latitude, coords.longitude);

      // Reset countdown
      setCountdown(POLL_INTERVAL / 1000);
    } catch (err) {
      console.error('Error fetching location:', err);
      setErrorMsg('Error retrieving location.');
    }
  };

  useEffect(() => {
    getLocation();

    intervalRef.current = setInterval(getLocation, POLL_INTERVAL);

    // Countdown tick every second
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  return { latitude, longitude, errorMsg, countdown };
};

export default useLocation;
