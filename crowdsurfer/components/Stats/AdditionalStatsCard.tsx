import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


interface AdditionalStatCardProps {
  colors: [string, string];
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  title: string;
  value: string;
}

export default function AdditionalStatCard({ colors, iconName, iconColor, title, value, }: AdditionalStatCardProps) {
  return (
        <View style={styles.statCard}>
            <LinearGradient
                colors={colors}
                style={styles.statCardGradient}
            >
                <View style={styles.statContent}>
                    <Ionicons name={iconName} size={20} color={iconColor} />
                    <Text style={styles.statTitle}>{title}</Text>
                    <Text style={styles.statValue}>{value}</Text>
                </View>
            </LinearGradient>
        </View>
  );
}
const styles = StyleSheet.create({
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
}); 