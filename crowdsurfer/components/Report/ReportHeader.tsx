import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ReportHeader() {
  return (
    <View style={styles.reportCard}>
      <LinearGradient colors={['#FED7D7', '#FECACA']} style={styles.reportCardGradient}>
        <View style={styles.reportCardContent}>
          <View style={styles.reportIcon}>
            <LinearGradient colors={['#EA580C', '#DC2626']} style={styles.iconGradient}>
              <Ionicons name="people" size={24} color="#FFFFFF" />
            </LinearGradient>
          </View>
          <View style={styles.reportInfo}>
            <Text style={styles.reportTitle}>Report Crowd Level</Text>
            <Text style={styles.reportSubtitle}>Help others find quiet study spots</Text>
            <View style={styles.infoBox}>
              <Ionicons name="time" size={12} color="#EA580C" />
              <Text style={styles.infoText}>Your report helps the community in real-time</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  reportCard: {
    borderRadius: 20,
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  reportCardGradient: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 4,
  },
  reportCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  reportIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconGradient: {
    flex: 1,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportInfo: {
    flex: 1,
    gap: 8,
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
  },
  reportSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(234, 88, 12, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 12,
    color: '#EA580C',
    flex: 1,
  },
}); 
