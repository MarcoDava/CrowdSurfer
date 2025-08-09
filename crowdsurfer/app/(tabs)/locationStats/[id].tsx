import { useActivity } from '@/context/ActivityContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

// Imports of Components
import AdditionalStats from '@/components/Stats/AdditionalStats';
import AnalyticsCard from '@/components/Stats/AnalyticsCard';
import MetricCard from '@/components/Stats/MetricCard';
import WeeklyActivity from '@/components/Stats/WeeklyActivity';

import KeyLocations from '@/data/KeyLocations.json';

export default function LibraryStatsScreen() {
  const { id } = useLocalSearchParams();
  const locationId = Number(id);
  const location = KeyLocations.find(loc => loc.id === locationId);
  
  if (!location) {
    return (
        <Text>Location not found</Text>
    );
  }
  
  const { activities } = useActivity();
  const totalReports = activities.length;
  const updatedAt = activities.length > 0 ? new Date(activities[activities.length - 1].timestamp).toLocaleString() : undefined;
  return (
    
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
      <View style={styles.content}>
        <View style={styles.activityHeader}>
          <Ionicons name="library" size={22} color='#5B3E96' />
          <Text style={styles.activityTitle}>{location.title}</Text>
        </View>
        {/* Analytics Overview Card */}
        <AnalyticsCard totalReports={totalReports} updatedAt={updatedAt} />

        {/* Key Metrics Cards */}
        <View style={styles.metricsContainer}>
          <MetricCard
            title="Avg Occupancy"
            value="52%"
            iconName="people"
            colors={['#FED7D7', '#FECACA']}
          />
          <MetricCard
            title="Active Locations"
            value={6}
            iconName="location"
            colors={['#DCFCE7', '#BBF7D0']}
          />
        </View>

        {/* Weekly Activity Section */}
        <WeeklyActivity />

        {/* Additional Stats Cards */}
        <AdditionalStats />
        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 20,
  },
    activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activityTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5B3E96',
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
}); 