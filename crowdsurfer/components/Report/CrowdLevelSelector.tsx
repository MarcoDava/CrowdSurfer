import {
  crowdLevelColorMap,
  crowdLevels,
  crowdLevelTitleMap,
} from '@/constants/crowdLevels';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CrowdLevelSelectorProps {
  selectedLevel: string | null;
  onSelect: (id: string) => void;
}



export default function CrowdLevelSelector({
  selectedLevel,
  onSelect,
}: CrowdLevelSelectorProps) {
  return (
    <View style={styles.crowdLevelSection}>
      <Text style={styles.sectionTitle}>How crowded is it?</Text>
      <View style={styles.crowdLevelList}>
        {crowdLevels.map((level) => {
          const colors = crowdLevelColorMap[level.id].bg;
          const textColor = crowdLevelColorMap[level.id].text;
          const dotColor = crowdLevelColorMap[level.id].dot;

          return (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.crowdLevelCard,
                selectedLevel === level.id && styles.selectedCrowdLevelCard,
              ]}
              onPress={() => onSelect(level.id)}
            >
              <LinearGradient colors={colors} style={styles.crowdLevelGradient}>
                <View style={styles.crowdLevelContent}>
                  <View
                    style={[styles.crowdLevelDot, { backgroundColor: dotColor }]}
                  />
                  <View style={styles.crowdLevelInfo}>
                    <Text style={[styles.crowdLevelTitle, { color: textColor }]}>
                      {crowdLevelTitleMap[level.id]}
                    </Text>
                    <Text
                      style={[
                        styles.crowdLevelDescription,
                        { color: textColor },
                      ]}
                    >
                      {level.description}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
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
}); 