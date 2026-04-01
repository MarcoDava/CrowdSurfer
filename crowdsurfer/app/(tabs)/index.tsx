import CampusMap from '@/components/CampusMap';
import { API_BASE_URL } from '@/constants/api';
import KeyLocations from '@/data/KeyLocations.json';
import UserLocations from '@/data/UserLocations.json';
import useLocationBackground from '@/hooks/useLocationBackground';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import Geocoder from 'react-native-geocoding';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// TODO: move this key to EXPO_PUBLIC_GOOGLE_MAPS_KEY in your .env file
Geocoder.init('AIzaSyD78InqEVaxOaVeverkrfA9UoScmhrwVFY');

const COUNTDOWN_SECONDS = 300;

const getAddress = async (lat: number, lng: number): Promise<string> => {
  if (Platform.OS === 'web') {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
  try {
    const json = await Geocoder.from(lat, lng);
    return json.results[0]?.formatted_address ?? 'Unknown location';
  } catch {
    return 'Unknown location';
  }
};

const shortAddress = (full: string): string => {
  const parts = full.split(',');
  return [parts[0], parts[1]].filter(Boolean).join(',');
};

const formatCountdown = (s: number) =>
  `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

// Static fallback markers (always shown)
const markers = KeyLocations.map((item) => ({
  id: item.id,
  latitude: item.location.latitude,
  longitude: item.location.longitude,
  title: item.title,
}));

// Static fallback heat points used until the API responds
const STATIC_HEAT_POINTS = UserLocations.map((item) => ({
  latitude: item.location.latitude,
  longitude: item.location.longitude,
}));

export default function MapScreen() {
  const { latitude, longitude, errorMsg } = useLocationBackground();
  const [address, setAddress] = useState('Locating…');
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const refreshRef = useRef<TouchableOpacity>(null);

  // Live heatmap points — replaced by API data when available
  const [heatPoints, setHeatPoints] = useState(STATIC_HEAT_POINTS);

  useEffect(() => {
    if (latitude > 0 && longitude > 0) {
      getAddress(latitude, longitude).then((addr) => setAddress(shortAddress(addr)));
    }
  }, [latitude, longitude]);

  useEffect(() => {
    const id = setInterval(
      () => setCountdown((prev) => (prev <= 1 ? COUNTDOWN_SECONDS : prev - 1)),
      1000,
    );
    return () => clearInterval(id);
  }, []);

  // Fetch live heatmap points; silently keep static fallback on failure
  useEffect(() => {
    const load = () => {
      axios
        .get(`${API_BASE_URL}/heatmap/`)
        .then(({ data }) => {
          if (Array.isArray(data) && data.length > 0) setHeatPoints(data);
        })
        .catch(() => {});
    };
    load();
    // Refresh every 30 seconds to match live user movement
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>

        {/* ── Location card ── */}
        <View style={styles.card}>
          <LinearGradient colors={['#E9D5FF', '#C7D2FE']} style={styles.cardGradient}>
            <View style={styles.row}>
              <View style={styles.iconCircle}>
                <Ionicons name="paper-plane" size={22} color="#7C3AED" />
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {errorMsg ? 'Location unavailable' : address}
                </Text>
                <Text style={styles.cardSub}>
                  {errorMsg || 'Location active'}
                </Text>
                <View style={styles.metaRow}>
                  <Ionicons name="time-outline" size={12} color="#6B7280" />
                  <Text style={styles.metaText}>
                    Updating in {formatCountdown(countdown)}
                  </Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{KeyLocations.length} nearby</Text>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* ── Status summary ── */}
        <View style={styles.statusRow}>
          <View style={styles.statusCard}>
            <LinearGradient colors={['#DCFCE7', '#BBF7D0']} style={styles.statusGradient}>
              <View style={[styles.dot, { backgroundColor: '#16A34A' }]} />
              <Text style={styles.statusLabel}>Quiet</Text>
              <Text style={[styles.statusCount, { color: '#16A34A' }]}>2</Text>
            </LinearGradient>
          </View>
          <View style={styles.statusCard}>
            <LinearGradient colors={['#FED7D7', '#FECACA']} style={styles.statusGradient}>
              <View style={[styles.dot, { backgroundColor: '#DC2626' }]} />
              <Text style={styles.statusLabel}>Very Busy</Text>
              <Text style={[styles.statusCount, { color: '#DC2626' }]}>1</Text>
            </LinearGradient>
          </View>
        </View>

        {/* ── Campus map ── */}
        <View style={styles.card}>
          <LinearGradient colors={['#DBEAFE', '#BFDBFE']} style={styles.cardGradient}>
            <View style={styles.mapHeader}>
              <Ionicons name="location" size={18} color="#2563EB" />
              <Text style={styles.mapTitle}>Campus Map</Text>
            </View>
            <CampusMap
              heatPoints={heatPoints}
              markers={markers}
              userLatitude={latitude}
              userLongitude={longitude}
            />
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
    gap: 16,
    backgroundColor: '#FFFFFF',
  },

  // Generic card
  card: {
    borderRadius: 20,
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cardGradient: {
    borderRadius: 20,
    padding: 18,
  },

  // Location card internals
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
    gap: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  cardSub: {
    fontSize: 13,
    color: '#6B7280',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  badge: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Status row
  statusRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statusCard: {
    flex: 1,
    borderRadius: 16,
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  statusGradient: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  statusCount: {
    fontSize: 28,
    fontWeight: '800',
  },

  // Map card internals
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  mapTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2563EB',
  },
});
