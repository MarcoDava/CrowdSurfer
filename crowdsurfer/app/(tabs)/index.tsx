import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import useLocationPolling from '@/hooks/useLocation';

const formatCountdown = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export default function HomeScreen() {
  const { latitude, longitude, errorMsg, countdown } = useLocationPolling();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Location (Updated Every 5 min)</Text>
      {errorMsg ? (
        <Text style={styles.error}>{errorMsg}</Text>
      ) : latitude && longitude ? (
        <Text>You are located at: {latitude}, {longitude}</Text>
      ) : (
        <Text>Fetching location...</Text>
      )}
      <Text style={styles.countdown}>
        Next update in: {formatCountdown(countdown)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  error: {
    color: 'red',
  },
  countdown: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});
