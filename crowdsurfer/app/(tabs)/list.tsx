import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { crowdLevelColorMap, crowdLevelTitleMap } from '@/constants/crowdLevels';
import KeyLocations from '@/data/KeyLocations.json';
import axios from 'axios';

// STEP 1: Fix API URL - Replace with your computer's IP address
// To find your IP: Open Command Prompt/Terminal and run: ipconfig (Windows) or ifconfig (Mac/Linux)
const API_BASE_URL = 'http://xxx.xxx.x.xx:8000/api'; //CHANGE THIS TO YOUR COMPUTER'S IP

// Types
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
  distance: string;
  lastUpdated: string;
}

const formatCountdown = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const occupancyLevelConvert = (occupancy: number) => {
  if (occupancy < 25) return 'quiet';
  if (occupancy < 50) return 'not_busy';
  if (occupancy < 75) return 'busy';
  if (occupancy < 90) return 'very_busy';
  return 'full';
};

// STEP 2: Improved location mapping
const mapLocationName = (locationId: string) => {
  const mapping: { [key: string]: string } = {
    'Mills Memo': 'Mills Memorial Library',
    'Thode Libr': 'Thode Library',
    'Health Sci': 'Health Sciences Library',
    'Innis Libr': 'Innis Library',
    'Mills Memorial Library': 'Mills Memorial Library',
    'Thode Library': 'Thode Library',
    // Add more mappings based on your actual data
  };
  return mapping[locationId] || locationId;
};

// STEP 3: Calculate actual time difference for lastUpdated
const calculateTimeAgo = (timestamp: number) => {
  // If timestamp is just an ID, return a default
  if (timestamp < 1000000) {
    return "Unknown";
  }
  
  // If it's a proper timestamp
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} mins ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} days ago`;
};

// STEP 4: Enhanced location enrichment
const enrichLocationsWithAPI = (occupancyData: OccupancyData[]): EnrichedLocation[] => {
  return occupancyData.map((data) => {
    // Try to find matching KeyLocation
    const keyLocation = KeyLocations.find(loc => {
      const mappedName = mapLocationName(data.location_Id);
      return loc.title.toLowerCase().includes(mappedName.toLowerCase()) || 
             mappedName.toLowerCase().includes(loc.title.toLowerCase()) ||
             loc.title.toLowerCase().includes(data.location_Id.toLowerCase());
    });

    return {
      id: data.location_Id,
      name: mapLocationName(data.location_Id),
      address: keyLocation?.title || `${data.location_Id} - Campus Location`,
      occupancy: data.occupancy,
      crowdLevel: occupancyLevelConvert(data.occupancy),
      distance: keyLocation ? 'nearby' : 'unknown',
      lastUpdated: calculateTimeAgo(data.timestamp),
    };
  });
};

export default function ListScreen() {
  const router = useRouter();
  const [locations, setLocations] = useState<EnrichedLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);

  // STEP 5: Enhanced API fetch function
  const fetchOccupancyData = async () => {
    try {
      console.log('Fetching from:', `${API_BASE_URL}/occupancy/`);
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}/occupancy/`, {
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('API Response:', response.data);
      
      const occupancyData: OccupancyData[] = response.data;
      
      if (!Array.isArray(occupancyData)) {
        throw new Error('Invalid data format received from API');
      }
      
      const enrichedLocations = enrichLocationsWithAPI(occupancyData);
      setLocations(enrichedLocations);
      setLastFetchTime(new Date());
      
      console.log('Enriched locations:', enrichedLocations);
      
    } catch (err: any) {
      console.error('Error fetching occupancy data:', err);
      
      // More specific error handling
      if (err.code === 'ECONNREFUSED') {
        setError('Cannot connect to server. Make sure Django is running and check your IP address.');
      } else if (err.code === 'TIMEOUT') {
        setError('Request timed out. Check your network connection.');
      } else {
        setError(`Failed to fetch occupancy data: ${err.message}`);
      }
      
      // Show alert for debugging
      Alert.alert(
        'API Error', 
        `Error: ${err.message}\nURL: ${API_BASE_URL}/occupancy/\n\nMake sure:\n1. Django server is running\n2. Your IP address is correct\n3. Phone/emulator is on same network`,
        [{ text: 'OK' }]
      );
      
      // Fallback to mock data
      const fallbackLocations = KeyLocations.slice(0, 3).map((loc, index) => ({
        id: loc.id.toString(),
        name: loc.title,
        address: 'Campus Location (Mock Data)',
        occupancy: Math.floor(Math.random() * 100),
        crowdLevel: occupancyLevelConvert(Math.floor(Math.random() * 100)),
        distance: 'unknown',
        lastUpdated: "Mock data",
      }));
      setLocations(fallbackLocations);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchOccupancyData();
  }, []);

  // Refresh function with better UX
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOccupancyData();
  };

  // STEP 6: Auto-refresh with better timing
  useEffect(() => {
    const interval = setInterval(() => {
      if (!refreshing) {
        console.log('Auto-refreshing data...');
        fetchOccupancyData();
      }
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [refreshing]);

  // Count locations by crowd level
  const countByCrowdLevel = (level: string) => {
    return locations.filter(loc => loc.crowdLevel === level).length;
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.loadingText}>Loading occupancy data...</Text>
        <Text style={styles.loadingSubtext}>Connecting to {API_BASE_URL}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header Section with Debug Info */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Study Locations</Text>
          <Text style={styles.headerSubtitle}>
            {error ? 'Using mock data - ' : ''}Find the perfect study spot
          </Text>
          {lastFetchTime && (
            <Text style={styles.debugText}>
              Last updated: {lastFetchTime.toLocaleTimeString()}
            </Text>
          )}
          <View style={styles.headerMeta}>
            <View style={styles.foundBadge}>
              <Text style={styles.foundText}>{locations.length} found</Text>
            </View>
            <TouchableOpacity 
              style={styles.locationButton} 
              onPress={handleRefresh}
              disabled={refreshing}
            >
              <Ionicons 
                name={refreshing ? "refresh" : "location"} 
                size={16} 
                color="#16A34A" 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Error Banner */}
        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="warning" size={16} color="#DC2626" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search locations or buildings..."
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Crowd Level Filters - Now showing actual counts */}
        <View style={styles.filtersContainer}>
          <View style={styles.filterCard}>
            <LinearGradient colors={crowdLevelColorMap.quiet.bg} style={styles.filterGradient}>
              <View style={styles.filterContent}>
                <View style={[styles.crowdDot, { backgroundColor: crowdLevelColorMap.quiet.dot }]} /> 
                <Text style={styles.filterTitle}>{crowdLevelTitleMap.quiet}</Text>
                <Text style={styles.filterCount}>{countByCrowdLevel('quiet')}</Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.filterCard}>
            <LinearGradient colors={crowdLevelColorMap.not_busy.bg} style={styles.filterGradient}>
              <View style={styles.filterContent}>
                <View style={[styles.crowdDot, { backgroundColor: crowdLevelColorMap.not_busy.dot }]} />
                <Text style={styles.filterTitle}>{crowdLevelTitleMap.not_busy}</Text>
                <Text style={styles.filterCount}>{countByCrowdLevel('not_busy')}</Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.filterCard}>
            <LinearGradient colors={crowdLevelColorMap.busy.bg} style={styles.filterGradient}>
              <View style={styles.filterContent}>
                <View style={[styles.crowdDot, { backgroundColor: crowdLevelColorMap.busy.dot }]} />
                <Text style={styles.filterTitle}>{crowdLevelTitleMap.busy}</Text>
                <Text style={styles.filterCount}>{countByCrowdLevel('busy')}</Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.filterCard}>
            <LinearGradient colors={crowdLevelColorMap.very_busy.bg} style={styles.filterGradient}>
              <View style={styles.filterContent}>
                <View style={[styles.crowdDot, { backgroundColor: crowdLevelColorMap.very_busy.dot }]} />
                <Text style={styles.filterTitle}>{crowdLevelTitleMap.very_busy}</Text>
                <Text style={styles.filterCount}>{countByCrowdLevel('very_busy')}</Text>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Show Filters Button */}
        <TouchableOpacity style={styles.showFiltersButton}>
          <Ionicons name="filter" size={16} color="#6B7280" />
          <Text style={styles.showFiltersText}>Show Filters</Text>
        </TouchableOpacity>

        {/* Location List - Now with real data */}
        <View style={styles.locationList}>
          {locations.map((location) => {
            const colors = crowdLevelColorMap[location.crowdLevel as keyof typeof crowdLevelColorMap] ?? {
              bg: ['#F3F4F6', '#E5E7EB'],
              text: '#6B7280',
              dot: '#9CA3AF',
            };
            const title = crowdLevelTitleMap[location.crowdLevel as keyof typeof crowdLevelTitleMap] ?? 'Unknown';            

            return (
              <TouchableOpacity
                key={location.id}
                onPress={() => router.push(`./locationStats/${location.id}`)}
                style={styles.locationCard}
              >
               <LinearGradient colors={colors.bg} style={styles.locationCardGradient}>
                  <View style={styles.locationCardContent}>
                    <View style={styles.locationIcon}>
                      <View style={[styles.crowdDot, { backgroundColor: colors.dot }]} />
                    </View>
                    <View style={styles.locationInfo}>
                      <Text style={styles.locationName}>{location.name}</Text>
                      <View style={styles.locationAddress}>
                        <Ionicons name="location" size={12} color="#6B7280" />
                        <Text style={styles.addressText}>{location.address}</Text>
                      </View>
                      <View style={styles.locationMeta}>
                        <View style={styles.metaItem}>
                          <Ionicons name="people" size={12} color="#6B7280" />
                          <Text style={styles.metaText}>{location.occupancy}% full</Text>
                        </View>
                        <View style={styles.metaItem}>
                          <Ionicons name="time" size={12} color="#6B7280" />
                          <Text style={styles.metaText}>{location.lastUpdated}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: colors.bg[0] }]}>
                      <Text style={[styles.statusText, { color: colors.text }]}>
                        {title}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Debug Info (remove in production) */}
        {__DEV__ && (
          <View style={styles.debugContainer}>
            <Text style={styles.debugTitle}>Debug Info:</Text>
            <Text style={styles.debugText}>API URL: {API_BASE_URL}</Text>
            <Text style={styles.debugText}>Locations loaded: {locations.length}</Text>
            <Text style={styles.debugText}>Has error: {error ? 'Yes' : 'No'}</Text>
          </View>
        )}

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.fab}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Enhanced styles with debug elements
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  headerSection: {
    gap: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  foundBadge: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  foundText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  locationButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // New styles for debug and error handling
  loadingText: {
    fontSize: 18,
    color: '#374151',
    fontWeight: '600',
  },
  loadingSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    flex: 1,
  },
  debugContainer: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  debugText: {
    fontSize: 12,
    color: '#6B7280',
  },
  searchContainer: {
    marginTop: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterCard: {
    flex: 1,
    borderRadius: 12,
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  filterGradient: {
    borderRadius: 12,
    padding: 12,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 4,
  },
  filterContent: {
    alignItems: 'center',
    gap: 6,
  },
  filterTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  filterCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16A34A',
  },
  showFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  showFiltersText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  locationList: {
    gap: 12,
  },
  locationCard: {
    borderRadius: 16,
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  locationCardGradient: {
    borderRadius: 16,
    padding: 16,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  crowdDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  locationInfo: {
    flex: 1,
    gap: 4,
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  locationAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#6B7280',
  },
  locationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
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
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
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