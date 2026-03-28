import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface HeatPoint {
  latitude: number;
  longitude: number;
}

export interface MapMarker {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
}

interface CampusMapProps {
  heatPoints: HeatPoint[];
  markers: MapMarker[];
  userLatitude: number;
  userLongitude: number;
}

// react-native-maps does not support web. This component shows a location list
// as a lightweight substitute until a web-compatible map library is integrated.
export default function CampusMap({ markers, userLatitude, userLongitude }: CampusMapProps) {
  const hasPosition = userLatitude > 0 && userLongitude > 0;

  return (
    <View style={styles.container}>
      <Ionicons name="map-outline" size={40} color="#2563EB" />
      <Text style={styles.title}>Campus Locations</Text>
      <Text style={styles.subtitle}>
        Interactive map available on iOS &amp; Android
      </Text>

      {hasPosition && (
        <View style={styles.coordRow}>
          <Ionicons name="navigate" size={14} color="#7C3AED" />
          <Text style={styles.coordText}>
            {userLatitude.toFixed(5)}, {userLongitude.toFixed(5)}
          </Text>
        </View>
      )}

      <View style={styles.divider} />

      {markers.map((m) => (
        <View key={m.id} style={styles.locationRow}>
          <Ionicons name="location" size={14} color="#7C3AED" />
          <Text style={styles.locationName}>{m.title}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  subtitle: {
    fontSize: 13,
    color: '#3B82F6',
    textAlign: 'center',
  },
  coordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  coordText: {
    fontSize: 12,
    color: '#6B7280',
  },
  divider: {
    width: '80%',
    height: 1,
    backgroundColor: '#BFDBFE',
    marginVertical: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  locationName: {
    fontSize: 14,
    color: '#374151',
  },
});
