import React from 'react';
import { StyleSheet, View } from 'react-native';
import AdditionalStatCard from './AdditionalStatsCard';

export default function AdditionalStats() {
  return (
    <View style={styles.additionalStats}>
      <AdditionalStatCard
        colors={['#FEF3C7', '#FDE68A']}
        iconName="trending-up"
        iconColor="#D97706"
        title="Peak Hours"
        value="2-4 PM"
      />
      <AdditionalStatCard
        colors={['#E9D5FF', '#C7D2FE']}
        iconName="calendar"
        iconColor="#7C3AED"
        title="Busiest Day"
        value="Wednesday"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  additionalStats: {
    flexDirection: 'row',
    gap: 12,
  },
});