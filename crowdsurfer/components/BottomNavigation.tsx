import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

interface TabItem {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  activeColors: string[];
  activeTextColor: string;
}

const tabs: TabItem[] = [
  {
    name: 'Map',
    icon: 'map',
    route: '/',
    activeColors: ['#E9D5FF', '#C7D2FE'],
    activeTextColor: '#7C3AED',
  },
  {
    name: 'List',
    icon: 'list',
    route: '/list',
    activeColors: ['#DCFCE7', '#BBF7D0'],
    activeTextColor: '#16A34A',
  },
  {
    name: 'Report',
    icon: 'add',
    route: '/report',
    activeColors: ['#FED7D7', '#FECACA'],
    activeTextColor: '#EA580C',
  },
  {
    name: 'Stats',
    icon: 'bar-chart',
    route: '/stats',
    activeColors: ['#DBEAFE', '#BFDBFE'],
    activeTextColor: '#2563EB',
  },
];

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabPress = (route: string) => {
    router.push(route);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.95)']}
        style={styles.navigationGradient}
      >
        <View style={styles.navigationContent}>
          {tabs.map((tab) => {
            const isActive = pathname === tab.route;
            return (
              <TouchableOpacity
                key={tab.name}
                style={[
                  styles.tabButton,
                  isActive && styles.activeTabButton,
                ]}
                onPress={() => handleTabPress(tab.route)}
                activeOpacity={0.7}
              >
                {isActive ? (
                  <LinearGradient
                    colors={tab.activeColors}
                    style={styles.activeTabGradient}
                  >
                    <Ionicons
                      name={tab.icon}
                      size={20}
                      color={tab.activeTextColor}
                    />
                    <Text style={[styles.tabText, { color: tab.activeTextColor }]}>
                      {tab.name}
                    </Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.inactiveTab}>
                    <Ionicons name={tab.icon} size={20} color="#9CA3AF" />
                    <Text style={styles.inactiveTabText}>{tab.name}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  navigationGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  navigationContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  tabButton: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  activeTabButton: {
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  activeTabGradient: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 4,
  },
  inactiveTab: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  inactiveTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
}); 