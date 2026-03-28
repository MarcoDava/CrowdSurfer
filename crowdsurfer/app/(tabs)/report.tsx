import CrowdLevelSelector from '@/components/Report/CrowdLevelSelector';
import LocationList from '@/components/Report/LocationList';
import LocationSearch from '@/components/Report/LocationSearch';
import ReportHeader from '@/components/Report/ReportHeader';
import { API_BASE_URL } from '@/constants/api';
import { useActivity } from '@/context/ActivityContext';
import { useFilteredLocations } from '@/hooks/useFilteredLocations';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ReportScreen() {
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [selectedCrowdLevel, setSelectedCrowdLevel] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const filteredLocations = useFilteredLocations(searchQuery);
  const { addActivity } = useActivity();

  const handleSubmitReport = async () => {
    if (!selectedLocation || !selectedCrowdLevel) {
      Alert.alert('Missing Information', 'Please select both a location and a crowd level.');
      return;
    }

    const timestamp = new Date().toISOString();
    const reportData = {
      location_Id: selectedLocation,
      crowd_Level: selectedCrowdLevel,
      timestamp,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/reports/`, reportData);

      if (response.status === 201) {
        Alert.alert('Success', 'Crowd level reported successfully!');
        addActivity({
          locationId: reportData.location_Id.toString(),
          crowdLevel: reportData.crowd_Level,
          timestamp,
        });
        setSelectedLocation(null);
        setSelectedCrowdLevel(null);
        setSearchQuery('');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Failed to submit report:', error);
      Alert.alert('Error', 'Could not reach the server. Check your connection.');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <ReportHeader />

        <Text style={styles.sectionTitle}>Select Location</Text>
        <LocationSearch value={searchQuery} onChange={setSearchQuery} />
        <LocationList
          locations={filteredLocations}
          selectedLocation={selectedLocation}
          onSelect={setSelectedLocation}
        />

        {selectedLocation && (
          <CrowdLevelSelector
            selectedLevel={selectedCrowdLevel}
            onSelect={setSelectedCrowdLevel}
          />
        )}

        {selectedLocation && selectedCrowdLevel && (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReport}>
            <LinearGradient colors={['#EA580C', '#DC2626']} style={styles.submitGradient}>
              <Text style={styles.submitText}>Submit Report</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
  },
  submitButton: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  submitGradient: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
