import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  totalReports: number;
  updatedAt?: string; // optional last update string if needed
};


export default function AnalyticsCard({ totalReports, updatedAt }: Props) {
  return (
    <View style={styles.analyticsCard}>
        <LinearGradient
        colors={['#DBEAFE', '#BFDBFE']}
        style={styles.analyticsCardGradient}
        >
        <View style={styles.analyticsCardContent}>
            <View style={styles.analyticsIcon}>
                <Ionicons name="bar-chart" size={24} color="#2563EB" />
            </View>
            <View style={styles.analyticsInfo}>
                <Text style={styles.analyticsTitle}>Analytics</Text>
                <Text style={styles.analyticsSubtitle}>Study spot insights & trends</Text>
                <View style={styles.analyticsMeta}>
                    <View style={styles.metaItem}>
                        <Ionicons name="time" size={12} color="#2563EB" />
                        <Text style={styles.metaText}>
                            {updatedAt ? `Updated at ${updatedAt}` : 'Updated in real-time'}
                        </Text>
                    </View>
                    <View style={styles.reportsBadge}>
                        <Text style={styles.reportsText}>{totalReports} total reports</Text>
                    </View>
                </View>
            </View>
        </View>
        </LinearGradient>
    </View>
  );
}
const styles = StyleSheet.create({
  analyticsCard: {
    borderRadius: 20,
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  analyticsCardGradient: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 4,
  },
  analyticsCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  analyticsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyticsInfo: {
    flex: 1,
    gap: 4,
  },
  analyticsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  analyticsSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  analyticsMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#2563EB',
  },
  reportsBadge: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  reportsText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
}); 