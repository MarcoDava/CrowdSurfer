import { useActivity } from '@/context/ActivityContext';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

// Imports of Components
import AdditionalStats from '@/components/Stats/AdditionalStats';
import AnalyticsCard from '@/components/Stats/AnalyticsCard';
import MetricCard from '@/components/Stats/MetricCard';
import RecentActivityList from '@/components/Stats/RecentActivityList';
import WeeklyActivity from '@/components/Stats/WeeklyActivity';


export default function StatsScreen() {
  const { activities } = useActivity();
  
  const totalReports = activities.length;
  const updatedAt = activities.length > 0 ? new Date(activities[activities.length - 1].timestamp).toLocaleString() : undefined;
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
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
        
        {/* Recent Activity */}
        <RecentActivityList activities={activities} />
      </View>
    </ScrollView>
  );
}

// After successfully sending, fetch from report.tsx and create an item in the stats live activity section
// Will show the library based on id, report status, and acutal time or 5 minutes ago type thing

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
}); 