import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { usePathname } from 'expo-router';

interface HeaderProps {
  currentPageName?: string;
}

export default function Header({ currentPageName }: HeaderProps) {
  const pathname = usePathname();
  
  const getPageName = () => {
    if (currentPageName) return currentPageName;
    
    switch (pathname) {
      case '/':
        return 'Dashboard';
      case '/list':
        return 'LocationList';
      case '/report':
        return 'Report';
      case '/stats':
        return 'Analytics';
      default:
        return '';
    }
  };

  return (
    <View style={styles.header}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.8)', 'rgba(243, 232, 255, 0.8)']}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <LinearGradient
                colors={['#E9D5FF', '#C7D2FE']}
                style={styles.iconGradient}
              >
                <Ionicons name="location" size={20} color="#7C3AED" />
              </LinearGradient>
            </View>
            <View style={styles.logoText}>
              <Text style={styles.appName}>CrowdSurfer</Text>
              <Text style={styles.tagline}>Find quiet study spots</Text>
            </View>
          </View>
          <Text style={styles.pageName}>{getPageName()}</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerGradient: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 16,
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  iconGradient: {
    flex: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 4,
  },
  logoText: {
    gap: 2,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7C3AED',
  },
  tagline: {
    fontSize: 12,
    color: '#6B7280',
  },
  pageName: {
    fontSize: 12,
    color: '#9CA3AF',
  },
}); 