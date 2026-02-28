// ─────────────────────────────────────────────────────────────────────────────
// FIELDTRACK – SecurityBanner Component
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';

interface Props {
  violated?: boolean;
  message?: string;
  lastCheck?: string;
}

export function SecurityBanner({
  violated = false,
  message = 'ALL SECURITY CHECKS PASSED',
  lastCheck = '2 min ago',
}: Props) {
  const color = violated ? Colors.danger : Colors.success;
  const bg    = violated ? Colors.dangerDim : Colors.successDim;
  const bord  = violated ? `${Colors.danger}30` : `${Colors.success}25`;

  return (
    <View style={[styles.container, { backgroundColor: bg, borderColor: bord }]}>
      <Ionicons
        name={violated ? 'warning' : 'shield-checkmark'}
        size={14}
        color={color}
      />
      <Text style={[styles.text, { color }]}>{message}</Text>
      <Text style={styles.time}>{lastCheck}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  text: {
    flex: 1,
    fontSize: 10,
    fontFamily: 'Courier',
    letterSpacing: 0.5,
  },
  time: {
    fontSize: 9,
    color: Colors.textMuted,
    fontFamily: 'Courier',
  },
});
