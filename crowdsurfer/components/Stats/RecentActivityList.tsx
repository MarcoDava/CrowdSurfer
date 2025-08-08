import LiveActivityCard from '@/components/LiveActivityCard';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Activity {
  id: string;
  locationId: string;
  crowdLevel: string;
  timestamp: string;
}

interface RecentActivityListProps {
  activities: Activity[];
}

export default function RecentActivityList({ activities }: RecentActivityListProps) {
  return (
    <View style={styles.recentActivity}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
            {activities.length === 0 && (
                <Text>No recent activity reported yet.</Text>
            )}
            {activities.map((activity) => (
                <LiveActivityCard
                    key={activity.id}
                    locationId={activity.locationId}
                    crowdLevel={activity.crowdLevel}
                    timestamp={activity.timestamp}
                />
            ))}            
        </View>
    </View>
    );
}


const styles = StyleSheet.create({
  recentActivity: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  activityList: {
    gap: 12,
  },
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
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
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