import axios from 'axios'; // Import axios for making API calls
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Importing components for reports
import CrowdLevelSelector from '@/components/Report/CrowdLevelSelector';
import LocationList from '@/components/Report/LocationList';
import LocationSearch from '@/components/Report/LocationSearch';
import ReportHeader from '@/components/Report/ReportHeader';
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

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
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