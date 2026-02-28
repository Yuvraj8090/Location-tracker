// ─────────────────────────────────────────────────────────────────────────────
// FIELDTRACK – StatCard Component
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
  color?: string;
}

export function StatCard({ icon, value, label, color = Colors.accent }: Props) {
  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: `${color}18` }]}>
        <Ionicons name={icon} size={16} color={color} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  label: {
    fontSize: 9,
    color: Colors.textSecondary,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    fontFamily: 'Courier',
  },
});
