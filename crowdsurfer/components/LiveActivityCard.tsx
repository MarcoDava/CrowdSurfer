import KeyLocations from '@/data/KeyLocations.json';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

// Change


type Props = {
  locationId: string;
  crowdLevel: string;
  timestamp: string;
};   

const getDotColor = (crowdLevel: string) => {
  switch (crowdLevel.toLowerCase()) {
    case 'quiet':
      return '#22c55e';  
    case 'not_busy':
      return '#eab308';  
    case 'busy':
      return '#f97316';  
    case 'very_busy':
      return '#dc2626';  
    default:
      return '#6b7280';  
  }
};

const crowdLevelDisplayMap: Record<string, string> = {
  quiet: 'Quiet',
  not_busy: 'Not Busy',
  busy: 'Busy',
  very_busy: 'Very Busy',
};

const getDisplayCrowdLevel = (level: string) => {
  return crowdLevelDisplayMap[level.toLowerCase()] || 'Unknown';
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

  const locationName = KeyLocations.find((loc) => loc.id === Number(locationId))?.title || 'Unknown Location';
  return (
    <Animated.View style={[styles.activityItem, { opacity: fadeAnim }]}>
      <View style={[styles.activityDot, { backgroundColor: getDotColor(crowdLevel) }]} />
      <View style={styles.activityInfo}>
        <Text style={styles.activityText}>
          {locationName} reported as "{getDisplayCrowdLevel(crowdLevel)}"
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