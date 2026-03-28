import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import MapView, { Heatmap, Marker } from 'react-native-maps';

const INITIAL_REGION = {
  latitude: 43.2628,
  longitude: -79.9177,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

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

export default function CampusMap({
  heatPoints,
  markers,
  userLatitude,
  userLongitude,
}: CampusMapProps) {
  return (
    <MapView style={styles.map} initialRegion={INITIAL_REGION}>
      {/* Heatmap is Android-only in react-native-maps */}
      {Platform.OS === 'android' && heatPoints.length > 0 && (
        <Heatmap
          points={heatPoints}
          radius={40}
          gradient={{
            colors: ['green', 'orange', 'red'],
            startPoints: [0.2, 0.5, 0.8],
            colorMapSize: 100,
          }}
        />
      )}

      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
          title={marker.title}
        />
      ))}

      <Marker
        coordinate={{
          latitude: userLatitude > 0 ? userLatitude : INITIAL_REGION.latitude,
          longitude: userLongitude > 0 ? userLongitude : INITIAL_REGION.longitude,
        }}
        title="You are here"
        pinColor="#7C3AED"
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 300,
    borderRadius: 16,
  },
});
