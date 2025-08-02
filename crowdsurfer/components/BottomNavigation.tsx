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
    router.push(route as any); // Potential Fix here
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
    borderTopWidth: 0.5,
    borderTopColor: '#E5E7EB', // Tailwind slate-200
    backgroundColor: '#FFFFFFF0',
    paddingBottom: 8,
  },
  navigationGradient: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  navigationContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  activeTabGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inactiveTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  inactiveTabText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 2,
  },
});
