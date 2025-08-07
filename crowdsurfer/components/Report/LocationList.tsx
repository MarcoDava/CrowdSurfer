import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Location = {
  id: number;
  title: string;
  location: {
    latitude: number;
    longitude: number;
  };
};

type Props = {
  locations: Location[];
  selectedLocation: number | null;
  onSelect: (id: number) => void;
};

export default function LocationList({ locations, selectedLocation, onSelect }: Props) {
  return (
    <View style={styles.locationList}>
      {locations.map((location) => (
        <TouchableOpacity
          key={location.id}
          style={[
            styles.locationItem,
            selectedLocation === location.id && styles.selectedLocationItem,
          ]}
          onPress={() => onSelect(location.id)}
        >
          <View style={styles.locationItemContent}>
            <Ionicons name="location" size={16} color="#6B7280" />
            <View style={styles.locationItemInfo}>
              <Text style={styles.locationItemName}>{location.title}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  locationList: {
    gap: 8,
  },
  locationItem: {
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedLocationItem: {
    backgroundColor: '#E9D5FF',
    borderWidth: 2,
    borderColor: '#7C3AED',
  },
  locationItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  locationItemInfo: {
    flex: 1,
    gap: 4,
  },
  locationItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  locationItemAddress: {
    fontSize: 14,
    color: '#6B7280',
  },
}); 
