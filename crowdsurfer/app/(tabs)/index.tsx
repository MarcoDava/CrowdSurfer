import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import useLocation from '@/hooks/useLocation';

export default function MapScreen() {
  const { latitude, longitude, errorMsg } = useLocation();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Your Location Card */}
        <View style={styles.locationCard}>
          <LinearGradient
            colors={['#E9D5FF', '#C7D2FE']}
            style={styles.locationCardGradient}
          >
            <View style={styles.locationCardContent}>
              <View style={styles.locationIcon}>
                <Ionicons name="paper-plane" size={24} color="#7C3AED" />
              </View>
              <View style={styles.locationInfo}>
                <Text style={styles.locationTitle}>Your Location</Text>
                <Text style={styles.locationStatus}>Location found</Text>
                <View style={styles.locationMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time" size={12} color="#6B7280" />
                    <Text style={styles.metaText}>Updated Just now</Text>
                  </View>
                  <View style={styles.nearbyBadge}>
                    <Text style={styles.nearbyText}>6 locations nearby</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.refreshButton}>
                <Ionicons name="refresh" size={20} color="#7C3AED" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Crowd Status Indicators */}
        <View style={styles.statusContainer}>
          <View style={styles.statusCard}>
            <LinearGradient
              colors={['#DCFCE7', '#BBF7D0']}
              style={styles.statusCardGradient}
            >
              <View style={styles.statusContent}>
                <View style={styles.statusIcon}>
                  <View style={styles.greenDot} />
                </View>
                <Text style={styles.statusTitle}>Quiet Now</Text>
                <Text style={styles.statusCount}>2</Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.statusCard}>
            <LinearGradient
              colors={['#FED7D7', '#FECACA']}
              style={styles.statusCardGradient}
            >
              <View style={styles.statusContent}>
                <View style={styles.statusIcon}>
                  <View style={styles.redDot} />
                </View>
                <Text style={styles.statusTitle}>Very Busy</Text>
                <Text style={styles.statusCount}>1</Text>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Campus Map Section */}
        <View style={styles.mapCard}>
          <LinearGradient
            colors={['#DBEAFE', '#BFDBFE']}
            style={styles.mapCardGradient}
          >
            <View style={styles.mapHeader}>
              <Ionicons name="location" size={20} color="#2563EB" />
              <Text style={styles.mapTitle}>Campus Map</Text>
            </View>
            <Text style={styles.mapSubtitle}>Interactive map coming soon</Text>
            
            <View style={styles.mapPlaceholder}>
              <Ionicons name="location" size={48} color="#2563EB" />
              <Text style={styles.mapPlaceholderTitle}>Map View</Text>
              <Text style={styles.mapPlaceholderText}>
                Tap locations below to see details
              </Text>
            </View>

            <TouchableOpacity style={styles.fab}>
              <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
    gap: 20,
    backgroundColor: '#FFFFFF',
  },
  locationCard: {
    borderRadius: 20,
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  locationCardGradient: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 4,
  },
  locationCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  locationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfo: {
    flex: 1,
    gap: 4,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  locationStatus: {
    fontSize: 14,
    color: '#6B7280',
  },
  locationMeta: {
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
    color: '#6B7280',
  },
  nearbyBadge: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  nearbyText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statusCard: {
    flex: 1,
    borderRadius: 16,
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  statusCardGradient: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 4,
  },
  statusContent: {
    alignItems: 'center',
    gap: 8,
  },
  statusIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  greenDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#16A34A',
  },
  redDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#DC2626',
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  statusCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#16A34A',
  },
  mapCard: {
    borderRadius: 20,
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  mapCardGradient: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 4,
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  mapSubtitle: {
    fontSize: 14,
    color: '#3B82F6',
    marginBottom: 20,
  },
  mapPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  mapPlaceholderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  mapPlaceholderText: {
    fontSize: 14,
    color: '#3B82F6',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EA580C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
