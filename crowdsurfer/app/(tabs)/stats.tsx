import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function StatsScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Analytics Overview Card */}
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
                    <Text style={styles.metaText}>Updated in real-time</Text>
                  </View>
                  <View style={styles.reportsBadge}>
                    <Text style={styles.reportsText}>0 total reports</Text>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Key Metrics Cards */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <LinearGradient
              colors={['#FED7D7', '#FECACA']}
              style={styles.metricCardGradient}
            >
              <View style={styles.metricContent}>
                <View style={styles.metricIcon}>
                  <Ionicons name="people" size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.metricTitle}>Avg Occupancy</Text>
                <Text style={styles.metricValue}>52%</Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.metricCard}>
            <LinearGradient
              colors={['#DCFCE7', '#BBF7D0']}
              style={styles.metricCardGradient}
            >
              <View style={styles.metricContent}>
                <View style={styles.metricIcon}>
                  <Ionicons name="location" size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.metricTitle}>Active Locations</Text>
                <Text style={styles.metricValue}>6</Text>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Weekly Activity Section */}
        <View style={styles.activitySection}>
          <View style={styles.activityHeader}>
            <Ionicons name="bar-chart" size={16} color="#2563EB" />
            <Text style={styles.activityTitle}>Weekly Activity</Text>
          </View>
          
          <View style={styles.chartContainer}>
            <View style={styles.chartYAxis}>
              <Text style={styles.yAxisLabel}>4</Text>
              <Text style={styles.yAxisLabel}>3</Text>
              <Text style={styles.yAxisLabel}>2</Text>
              <Text style={styles.yAxisLabel}>1</Text>
            </View>
            <View style={styles.chartPlaceholder}>
              <Text style={styles.chartPlaceholderText}>Chart coming soon</Text>
              <Text style={styles.chartPlaceholderSubtext}>
                Weekly crowd level trends will be displayed here
              </Text>
            </View>
          </View>
        </View>

        {/* Additional Stats Cards */}
        <View style={styles.additionalStats}>
          <View style={styles.statCard}>
            <LinearGradient
              colors={['#FEF3C7', '#FDE68A']}
              style={styles.statCardGradient}
            >
              <View style={styles.statContent}>
                <Ionicons name="trending-up" size={20} color="#D97706" />
                <Text style={styles.statTitle}>Peak Hours</Text>
                <Text style={styles.statValue}>2-4 PM</Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={['#E9D5FF', '#C7D2FE']}
              style={styles.statCardGradient}
            >
              <View style={styles.statContent}>
                <Ionicons name="calendar" size={20} color="#7C3AED" />
                <Text style={styles.statTitle}>Busiest Day</Text>
                <Text style={styles.statValue}>Wednesday</Text>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityInfo}>
                <Text style={styles.activityText}>Library Level 2 reported as "Not Busy"</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityInfo}>
                <Text style={styles.activityText}>Engineering Lab reported as "Busy"</Text>
                <Text style={styles.activityTime}>3 hours ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityInfo}>
                <Text style={styles.activityText}>Student Union reported as "Quiet"</Text>
                <Text style={styles.activityTime}>4 hours ago</Text>
              </View>
            </View>
          </View>
        </View>
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
  metricsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    borderRadius: 16,
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  metricCardGradient: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 4,
  },
  metricContent: {
    alignItems: 'center',
    gap: 8,
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
  },
  activitySection: {
    gap: 16,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  chartContainer: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartYAxis: {
    marginRight: 16,
    justifyContent: 'space-between',
  },
  yAxisLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  chartPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  chartPlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  chartPlaceholderSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  additionalStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statCardGradient: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 4,
  },
  statContent: {
    alignItems: 'center',
    gap: 8,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
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