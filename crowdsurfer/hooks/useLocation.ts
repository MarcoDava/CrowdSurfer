import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

const useLocation = () => {
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [longitude, setLongitude] = useState<number | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);

  const getUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        const msg = 'Permission to access location was denied';
        console.log(msg);
        setErrorMsg(msg);
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync();

      if (coords) {
        const { latitude, longitude } = coords;
        console.log('lat and long is', latitude, longitude);
        setLatitude(latitude);
        setLongitude(longitude);

        let response = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        console.log('USER LOCATION IS', response);
      }
    } catch (error) {
      console.error('Location error:', error);
      setErrorMsg('An error occurred while getting location');
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return { latitude, longitude, errorMsg };
};

export default useLocation;
