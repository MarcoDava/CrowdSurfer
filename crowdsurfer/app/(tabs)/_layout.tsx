import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="list" />
          <Stack.Screen name="report" />
          <Stack.Screen name="stats" />
        </Stack>
      </View>
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingBottom: 80, // Space for bottom navigation
    backgroundColor: '#FFFFFF',
  },
});
