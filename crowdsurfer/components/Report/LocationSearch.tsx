import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

type Props = {
  value: string;
  onChange: (text: string) => void;
};

export default function LocationSearch({ value, onChange }: Props) {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search locations..."
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChange}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 24,
  },
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
  locationSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
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
  locationList: {
    gap: 8,
  },
  locationItem: {
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedLocationItem: {
    backgroundColor: '#E9D5FF',
    borderWidth: 2,
    borderColor: '#7C3AED',
  },
  locationItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  locationItemInfo: {
    flex: 1,
    gap: 4,
  },
  locationItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  locationItemAddress: {
    fontSize: 14,
    color: '#6B7280',
  },
  crowdLevelSection: {
    gap: 16,
  },
  crowdLevelList: {
    gap: 12,
  },
  crowdLevelCard: {
    borderRadius: 16,
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  selectedCrowdLevelCard: {
    borderWidth: 3,
    borderColor: '#7C3AED',
  },
  crowdLevelGradient: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 4,
  },
  crowdLevelContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  crowdLevelDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  crowdLevelInfo: {
    flex: 1,
    gap: 4,
  },
  crowdLevelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  crowdLevelDescription: {
    fontSize: 14,
  },
  submitButton: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonGradient: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
}); 
