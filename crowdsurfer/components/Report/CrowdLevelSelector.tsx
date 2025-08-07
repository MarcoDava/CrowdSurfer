import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type CrowdLevel = {
  id: string;
  title: string;
  description: string;
  colors: [string, string];
  dotColor: string;
  textColor: string;
};

type Props = {
  crowdLevels: CrowdLevel[];
  selectedLevel: string | null;
  onSelect: (id: string) => void;
};

export default function CrowdLevelSelector({ crowdLevels, selectedLevel, onSelect }: Props) {
  return (
<View style={styles.crowdLevelSection}>
    <Text style={styles.sectionTitle}>How crowded is it?</Text>
    <View style={styles.crowdLevelList}>
        {crowdLevels.map((level) => (
        <TouchableOpacity
          key={level.id}
          style={[styles.crowdLevelCard, selectedLevel === level.id && styles.selectedCrowdLevelCard]}
          onPress={() => onSelect(level.id)}
        >
            <LinearGradient
            colors={level.colors} // Still needs to fixed
            style={styles.crowdLevelGradient}
            >
            <View style={styles.crowdLevelContent}>
                <View style={[styles.crowdLevelDot, { backgroundColor: level.dotColor }]} />
                <View style={styles.crowdLevelInfo}>
                <Text style={[styles.crowdLevelTitle, { color: level.textColor }]}>
                    {level.title}
                </Text>
                <Text style={[styles.crowdLevelDescription, { color: level.textColor }]}>
                    {level.description}
                </Text>
                </View>
            </View>
            </LinearGradient>
        </TouchableOpacity>
        ))}
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