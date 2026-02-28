// ─────────────────────────────────────────────────────────────────────────────
// FIELDTRACK – Badge Component
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { statusColors } from '../constants/theme';

interface Props {
  status: string;
}

export function Badge({ status }: Props) {
  const c = statusColors[status] ?? statusColors.assigned;

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <View style={[styles.dot, { backgroundColor: c.dot }]} />
      <Text style={[styles.label, { color: c.text }]}>
        {status.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    fontFamily: 'Courier',
  },
});
