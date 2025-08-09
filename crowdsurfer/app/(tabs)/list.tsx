import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { crowdLevelColorMap, crowdLevelTitleMap } from '@/constants/crowdLevels';
import KeyLocations from '@/data/KeyLocations.json';

// For keylocations informations
const enrichLocations = (locations: typeof KeyLocations) => {
  return locations.map((loc) => ({
    id: loc.id.toString(),
    name: loc.title,
    address: 'Unknown address', // placeholder, update as you want
    occupancy: Math.floor(Math.random() * 100), // mock occupancy 0-99%
    crowdLevel: ['quiet', 'not_busy', 'busy', 'very_busy'][Math.floor(Math.random() * 4)], // random crowd level
    distance: 'unknown', // or calculate based on location
    lastUpdated: '-5 mins ago', // placeholder
  }));
};

export default function ListScreen() {
  const router = useRouter();
  const locations = enrichLocations(KeyLocations);
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Study Locations</Text>
          <Text style={styles.headerSubtitle}>Find the perfect study spot</Text>
          <View style={styles.headerMeta}>
            <View style={styles.foundBadge}>
              <Text style={styles.foundText}>6 found</Text>
            </View>
            <TouchableOpacity style={styles.locationButton}>
              <Ionicons name="location" size={16} color="#16A34A" />
            </TouchableOpacity>
          </View>
        </View>

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

        {/* Crowd Level Filters */}
        <View style={styles.filtersContainer}>
          <View style={styles.filterCard}>
            {/* Generate these filter cards dynamically from crowdLevels  */}
            <LinearGradient colors={crowdLevelColorMap.quiet.bg} style={styles.filterGradient}>
              <View style={styles.filterContent}>
                <View style={[styles.crowdDot, { backgroundColor: crowdLevelColorMap.quiet.dot }]} /> 
                <Text style={styles.filterTitle}>{crowdLevelTitleMap.quiet}</Text>
                <Text style={styles.filterCount}>2</Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.filterCard}>
            <LinearGradient colors={crowdLevelColorMap.not_busy.bg} style={styles.filterGradient}>
              <View style={styles.filterContent}>
                <View style={[styles.crowdDot, { backgroundColor: crowdLevelColorMap.not_busy.dot }]} />
                <Text style={styles.filterTitle}>{crowdLevelTitleMap.not_busy}</Text>
                <Text style={styles.filterCount}>1</Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.filterCard}>
            <LinearGradient colors={crowdLevelColorMap.busy.bg} style={styles.filterGradient}>
              <View style={styles.filterContent}>
                <View style={[styles.crowdDot, { backgroundColor: crowdLevelColorMap.busy.dot }]} />
                <Text style={styles.filterTitle}>{crowdLevelTitleMap.busy}</Text>
                <Text style={styles.filterCount}>2</Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.filterCard}>
            <LinearGradient colors={crowdLevelColorMap.very_busy.bg} style={styles.filterGradient}>
              <View style={styles.filterContent}>
                <View style={[styles.crowdDot, { backgroundColor: crowdLevelColorMap.very_busy.dot }]} />
                <Text style={styles.filterTitle}>{crowdLevelTitleMap.very_busy}</Text>
                <Text style={styles.filterCount}>1</Text>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Show Filters Button */}
        <TouchableOpacity style={styles.showFiltersButton}>
          <Ionicons name="filter" size={16} color="#6B7280" />
          <Text style={styles.showFiltersText}>Show Filters</Text>
        </TouchableOpacity>

        {/* Location List */}
        <View style={styles.locationList}>
          {locations.map((location) => {
            const colors = crowdLevelColorMap[location.crowdLevel] ?? {
              bg: ['#F3F4F6', '#E5E7EB'],
              text: '#6B7280',
              dot: '#9CA3AF',
            };
            const title = crowdLevelTitleMap[location.crowdLevel] ?? 'Unknown';            

            return (
              <TouchableOpacity
                key={location.id}
                onPress={() => router.push(`./locationStats/${location.id}`)}
                style={styles.locationCard} // move styles here from View if needed
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

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.fab}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
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
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },
  yellowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
  },
  orangeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F97316',
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
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