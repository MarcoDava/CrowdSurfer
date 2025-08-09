import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function WeeklyActivity() {
  return (       
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
  );
}


const styles = StyleSheet.create({
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
}); 