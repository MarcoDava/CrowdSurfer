import { crowdLevelColorMap, crowdLevelTitleMap } from '@/constants/crowdLevels';
import { API_BASE_URL } from '@/constants/api';
import KeyLocations from '@/data/KeyLocations.json';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// ── Types ────────────────────────────────────────────────────────────────────

interface OccupancyData {
  location_Id: string;
  occupancy: number;
  data: any;
  timestamp: number;
}

interface EnrichedLocation {
  id: string;
  name: string;
  address: string;
  occupancy: number;
  crowdLevel: string;
  lastUpdated: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const occupancyToCrowdLevel = (pct: number): string => {
  if (pct < 25) return 'quiet';
  if (pct < 50) return 'not_busy';
  if (pct < 75) return 'busy';
  return 'very_busy';
};

const LOCATION_NAME_MAP: Record<string, string> = {
  'Mills Memo': 'Mills Library',
  'Thode Libr': 'Thode Library',
  'Health Sci': 'Health Sciences Library',
};

const mapLocationName = (id: string) => LOCATION_NAME_MAP[id] ?? id;

const findLocationId = (apiId: string) => {
  const name = mapLocationName(apiId);
  return KeyLocations.find((loc) => loc.title === name)?.id ?? -1;
};

const timeAgo = (timestamp: number): string => {
  if (timestamp < 1_000_000) return 'Unknown';
  const mins = Math.floor((Date.now() - timestamp) / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} days ago`;
};

const enrich = (data: OccupancyData[]): EnrichedLocation[] =>
  data.map((d) => {
    const name = mapLocationName(d.location_Id);
    const key = KeyLocations.find(
      (loc) =>
        loc.title.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(loc.title.toLowerCase()),
    );
    return {
      id: d.location_Id,
      name,
      address: key?.title ?? `${name} — Campus`,
      occupancy: d.occupancy,
      crowdLevel: occupancyToCrowdLevel(d.occupancy),
      lastUpdated: timeAgo(d.timestamp),
    };
  });

// ── Component ─────────────────────────────────────────────────────────────────

export default function ListScreen() {
  const router = useRouter();
  const [locations, setLocations] = useState<EnrichedLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    try {
      setError(null);
      const { data } = await axios.get<OccupancyData[]>(`${API_BASE_URL}/occupancy/`, {
        timeout: 10_000,
      });
      if (!Array.isArray(data)) throw new Error('Unexpected response format');
      setLocations(enrich(data));
      setLastFetch(new Date());
    } catch (err: any) {
      let msg = `Could not load data: ${err.message}`;
      if (err.code === 'ECONNREFUSED') msg = 'Server unreachable — check that Django is running.';
      if (err.code === 'ECONNABORTED') msg = 'Request timed out — check your network.';
      setError(msg);

      // Fallback to static data so the screen is still usable
      setLocations(
        KeyLocations.slice(0, 3).map((loc) => ({
          id: String(loc.id),
          name: loc.title,
          address: 'Campus Location',
          occupancy: Math.floor(Math.random() * 100),
          crowdLevel: occupancyToCrowdLevel(Math.floor(Math.random() * 100)),
          lastUpdated: 'Offline data',
        })),
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const id = setInterval(() => { if (!refreshing) fetchData(); }, 300_000);
    return () => clearInterval(id);
  }, [refreshing]);

  const visible = search.trim()
    ? locations.filter((l) =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.address.toLowerCase().includes(search.toLowerCase()),
      )
    : locations;

  const countOf = (level: string) => locations.filter((l) => l.crowdLevel === level).length;

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Loading occupancy data…</Text>
        <Text style={styles.loadingSubtext}>{API_BASE_URL}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>

        {/* ── Header ── */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Study Locations</Text>
          <Text style={styles.headerSubtitle}>Find the perfect study spot</Text>
          {lastFetch && (
            <Text style={styles.lastFetchText}>
              Updated {lastFetch.toLocaleTimeString()}
            </Text>
          )}
          <View style={styles.headerMeta}>
            <View style={styles.foundBadge}>
              <Text style={styles.foundText}>{visible.length} found</Text>
            </View>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={() => { setRefreshing(true); fetchData(); }}
              disabled={refreshing}
            >
              <Ionicons name={refreshing ? 'sync' : 'refresh'} size={16} color="#16A34A" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Error banner ── */}
        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="warning-outline" size={16} color="#DC2626" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* ── Search ── */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search locations or buildings…"
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Crowd level summary chips ── */}
        <View style={styles.chips}>
          {(['quiet', 'not_busy', 'busy', 'very_busy'] as const).map((level) => {
            const colors = crowdLevelColorMap[level];
            return (
              <View key={level} style={styles.chip}>
                <LinearGradient colors={colors.bg} style={styles.chipGradient}>
                  <View style={[styles.chipDot, { backgroundColor: colors.dot }]} />
                  <Text style={styles.chipLabel}>{crowdLevelTitleMap[level]}</Text>
                  <Text style={styles.chipCount}>{countOf(level)}</Text>
                </LinearGradient>
              </View>
            );
          })}
        </View>

        {/* ── Location list ── */}
        <View style={styles.list}>
          {visible.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={32} color="#9CA3AF" />
              <Text style={styles.emptyText}>No locations match "{search}"</Text>
            </View>
          ) : (
            visible.map((location) => {
              const colors = crowdLevelColorMap[location.crowdLevel as keyof typeof crowdLevelColorMap] ?? {
                bg: ['#F3F4F6', '#E5E7EB'] as [string, string],
                text: '#6B7280',
                dot: '#9CA3AF',
              };
              const title = crowdLevelTitleMap[location.crowdLevel as keyof typeof crowdLevelTitleMap] ?? 'Unknown';

              return (
                <TouchableOpacity
                  key={location.id}
                  style={styles.locationCard}
                  onPress={() => router.push(`./locationStats/${findLocationId(location.id)}`)}
                  activeOpacity={0.75}
                >
                  <LinearGradient colors={colors.bg} style={styles.locationCardGradient}>
                    <View style={styles.locationRow}>
                      <View style={[styles.levelDot, { backgroundColor: colors.dot }]} />
                      <View style={styles.locationInfo}>
                        <Text style={styles.locationName}>{location.name}</Text>
                        <View style={styles.addressRow}>
                          <Ionicons name="location-outline" size={11} color="#6B7280" />
                          <Text style={styles.addressText}>{location.address}</Text>
                        </View>
                        <View style={styles.metaRow}>
                          <Ionicons name="people-outline" size={11} color="#6B7280" />
                          <Text style={styles.metaText}>{location.occupancy}% full</Text>
                          <Ionicons name="time-outline" size={11} color="#6B7280" />
                          <Text style={styles.metaText}>{location.lastUpdated}</Text>
                        </View>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: colors.bg[0] }]}>
                        <Text style={[styles.statusText, { color: colors.text }]}>{title}</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </View>
    </ScrollView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  content: { padding: 20, gap: 16 },

  // Header
  headerSection: { gap: 6 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#111827' },
  headerSubtitle: { fontSize: 15, color: '#6B7280' },
  lastFetchText: { fontSize: 12, color: '#9CA3AF' },
  headerMeta: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 },
  foundBadge: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  foundText: { fontSize: 13, color: '#FFFFFF', fontWeight: '600' },
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(22,163,74,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Error
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 10,
  },
  errorText: { fontSize: 13, color: '#DC2626', flex: 1 },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 10,
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  searchInput: { flex: 1, fontSize: 15, color: '#374151' },

  // Chips
  chips: { flexDirection: 'row', gap: 8 },
  chip: {
    flex: 1,
    borderRadius: 12,
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  chipGradient: { borderRadius: 12, padding: 10, alignItems: 'center', gap: 4 },
  chipDot: { width: 8, height: 8, borderRadius: 4 },
  chipLabel: { fontSize: 10, fontWeight: '600', color: '#374151', textAlign: 'center' },
  chipCount: { fontSize: 16, fontWeight: '800', color: '#374151' },

  // List
  list: { gap: 10 },
  emptyState: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  emptyText: { fontSize: 15, color: '#9CA3AF' },

  // Location card
  locationCard: {
    borderRadius: 16,
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  locationCardGradient: { borderRadius: 16, padding: 14 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  levelDot: { width: 14, height: 14, borderRadius: 7, flexShrink: 0 },
  locationInfo: { flex: 1, gap: 3 },
  locationName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  addressText: { fontSize: 12, color: '#6B7280' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  metaText: { fontSize: 11, color: '#6B7280' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  statusText: { fontSize: 11, fontWeight: '700' },

  // Loading
  loadingText: { fontSize: 17, fontWeight: '600', color: '#374151' },
  loadingSubtext: { fontSize: 12, color: '#9CA3AF', marginTop: 6 },
});
