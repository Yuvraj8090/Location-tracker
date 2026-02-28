// ─────────────────────────────────────────────────────────────────────────────
// FIELDTRACK – Tab Layout  (app/(tabs)/_layout.tsx)
// Custom bottom tab bar using Expo Router + Ionicons
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';

type IoniconName = keyof typeof Ionicons.glyphMap;

interface TabIconProps {
  name: IoniconName;
  focused: boolean;
  label: string;
}

function TabIcon({ name, focused, label }: TabIconProps) {
  return (
    <View style={styles.tabItem}>
      {focused && <View style={styles.activeBar} />}
      <Ionicons
        name={focused ? name : (`${name}-outline` as IoniconName)}
        size={22}
        color={focused ? Colors.accent : Colors.textMuted}
      />
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home" focused={focused} label="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="clipboard" focused={focused} label="Tasks" />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="map" focused={focused} label="Map" />
          ),
        }}
      />
      <Tabs.Screen
        name="security"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="shield" focused={focused} label="Security" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="person" focused={focused} label="Profile" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: Platform.OS === 'ios' ? 84 : 64,
    paddingBottom: Platform.OS === 'ios' ? 20 : 4,
    paddingTop: 4,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    width: 56,
    paddingTop: 4,
  },
  activeBar: {
    position: 'absolute',
    top: -8,
    width: 24,
    height: 2,
    backgroundColor: Colors.accent,
    borderRadius: 1,
  },
  tabLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    fontFamily: 'Courier',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tabLabelActive: {
    color: Colors.accent,
  },
});
