import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
// Change
const mockLocations = [
  { id: '1', name: 'Main Library - Level 2' },
  { id: '2', name: 'Engineering Computer Lab' },
  { id: '3', name: 'Campus Coffee & Study' },
  { id: '4', name: 'Student Union Study Hall' },
];

type Props = {
  locationId: string;
  crowdLevel: string;
  timestamp: string;
};   

const getDotColor = (crowdLevel: string) => {
  switch (crowdLevel.toLowerCase()) {
    case 'quiet':
      return '#16A34A';
    case 'not_busy':
      return '#FACC15';
    case 'busy':
      return '#ef9f44ff';
    case 'very_busy':
      return '#EF4444';
    default:
      return '#9CA3AF';
  }
};

export default function LiveActivityCard({ locationId, crowdLevel, timestamp }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const locationName = mockLocations.find((loc) => loc.id === locationId)?.name || 'Unknown Location';

  return (
    <Animated.View style={[styles.activityItem, { opacity: fadeAnim }]}>
      <View style={[styles.activityDot, { backgroundColor: getDotColor(crowdLevel) }]} />
      <View style={styles.activityInfo}>
        <Text style={styles.activityText}>
          {locationName} reported as "{crowdLevel}"
        </Text>
        <Text style={styles.activityTime}>
          {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </Animated.View>
  );
}



const styles = StyleSheet.create({
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityDot: {
    width: 12,
    height: 12,
    borderRadius: 4,
    marginRight: 10,
  },
  activityInfo: {
    flex: 1,
    gap: 4,
  },
  activityText: {
    fontSize: 14,
    color: '#374151',
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
  },
});