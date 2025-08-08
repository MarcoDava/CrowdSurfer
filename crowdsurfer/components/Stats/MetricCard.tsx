import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  value: string | number;
  iconName: keyof typeof Ionicons.glyphMap;
  colors: [string, string];
  textColor?: string;
};

export default function MetricCard({ title, value, iconName, colors }: Props) {
  return (
    <View style={styles.metricCard}>
        <LinearGradient 
            colors={colors}
            style={styles.metricCardGradient}
        >
            <View style={styles.metricContent}>
                <View style={styles.metricIcon}>
                    <Ionicons name={iconName} size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.metricTitle}>{title}</Text>
                <Text style={styles.metricValue}>{value}</Text>
            </View>
        </LinearGradient>
    </View>
  );
}    

const styles = StyleSheet.create({
  metricCard: {
    flex: 1,
    borderRadius: 16,
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  metricCardGradient: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 4,
  },
  metricContent: {
    alignItems: 'center',
    gap: 8,
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
  },
}); 