import axios from 'axios'; // Import axios for making API calls
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Importing components for reports
import CrowdLevelSelector from '@/components/Report/CrowdLevelSelector';
import LocationList from '@/components/Report/LocationList';
import LocationSearch from '@/components/Report/LocationSearch';
import ReportHeader from '@/components/Report/ReportHeader';
import { crowdLevels } from '@/constants/crowdLevels';
import { useActivity } from '@/context/ActivityContext';
import { useFilteredLocations } from '@/hooks/useFilteredLocations';

export default function ReportScreen() {
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [selectedCrowdLevel, setSelectedCrowdLevel] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const filteredLocations = useFilteredLocations(searchQuery);

  const { addActivity } = useActivity();
  // Submission for Report
  const apiUrl = process.env.EXPO_PUBLIC_API_URL; // Will need to be addressed using Django in the future for security
  

  const handleSubmitReport = async () => {
    if (!selectedLocation || !selectedCrowdLevel) {
      Alert.alert("Missing Information", "Please select both a location and a crowd level.");
      return;
    }
  
    const timestamp = new Date().toISOString();
  
    const reportData = {
      location_Id: selectedLocation,
      crowd_Level: selectedCrowdLevel,
      timestamp,
    };

    console.log("Submitting report:", reportData);

    try {
      // Need to make this more secure
      const response = await axios.post(`${apiUrl}`, reportData);

      if (response.status === 201) {
        Alert.alert("Success", "Crowd level reported successfully!");

        addActivity({
          locationId: reportData.location_Id.toString(),
          // locationName,
          crowdLevel: reportData.crowd_Level,
          timestamp,
        });
        
        // Resets the form on success
        setSelectedLocation(null);
        setSelectedCrowdLevel(null);
        setSearchQuery('');

      } else {
        // Handle unexpected status codes from the server
        Alert.alert("Error", "Something went wrong while submitting the report. Please try again.");
      }

    } catch (error) {
      // Catch network errors, server errors, etc.
      console.error("Failed to submit report:", error);
      Alert.alert("Error", "Could not connect to the server. Please check your internet connection.");
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Report Crowd Level Section */}
        <ReportHeader />

        {/* Select Location Section */}
        
          <Text style={styles.sectionTitle}>Select Location</Text>
          
          <LocationSearch value={searchQuery} onChange={setSearchQuery} />

          <LocationList
            locations={filteredLocations}
            selectedLocation={selectedLocation}
            onSelect={setSelectedLocation}
          />
        

        {/* Crowd Level Selection */}
        {selectedLocation && (
          <CrowdLevelSelector
            crowdLevels={crowdLevels}
            selectedLevel={selectedCrowdLevel}
            onSelect={setSelectedCrowdLevel}
          />
        )}

        {/* Submit Button */}
        {selectedLocation && selectedCrowdLevel && (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReport}>
            <LinearGradient
              colors={['#EA580C', '#DC2626']}
              style={styles.submitButtonGradient}
            >
              <Text style={styles.submitButtonText}>Submit Report</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
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