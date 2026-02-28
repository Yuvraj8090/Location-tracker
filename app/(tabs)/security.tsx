// ─────────────────────────────────────────────────────────────────────────────
// FIELDTRACK – Security Screen  (app/(tabs)/security.tsx)
// ─────────────────────────────────────────────────────────────────────────────
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { SECURITY_CHECKS, GPS_STATUS } from '../../constants/data';

export default function SecurityScreen() {
  const pulseAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.8,  duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const allPassed = SECURITY_CHECKS.every((c) => c.passed);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.title}>Security</Text>
          <Text style={styles.subtitle}>
            Anti-tamper · Anti-spoof · Device integrity
          </Text>
        </View>

        {/* ── Overall Status ───────────────────────────────────────────── */}
        <View style={[
          styles.statusCard,
          { borderColor: allPassed ? `${Colors.success}40` : `${Colors.danger}40` },
        ]}>
          <Animated.View style={[
            styles.shieldWrap,
            {
              backgroundColor: allPassed ? Colors.successDim : Colors.dangerDim,
              transform: [{ scale: pulseAnim }],
            },
          ]}>
            <Ionicons
              name="shield-checkmark"
              size={34}
              color={allPassed ? Colors.success : Colors.danger}
            />
          </Animated.View>

          <Text style={[styles.statusTitle, { color: allPassed ? Colors.success : Colors.danger }]}>
            {allPassed ? 'DEVICE SECURE' : 'SECURITY ALERT'}
          </Text>
          <Text style={styles.statusSub}>
            All {SECURITY_CHECKS.length} checks passed · Last scan: Just now
          </Text>
        </View>

        {/* ── Security Checks ──────────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Security Checks</Text>

        {SECURITY_CHECKS.map((check) => (
          <View key={check.key} style={styles.checkRow}>
            <View style={[
              styles.checkIcon,
              { backgroundColor: check.passed ? Colors.successDim : Colors.dangerDim },
            ]}>
              <Ionicons
                name={check.icon as keyof typeof Ionicons.glyphMap}
                size={16}
                color={check.passed ? Colors.success : Colors.danger}
              />
            </View>

            <View style={styles.checkText}>
              <Text style={styles.checkLabel}>{check.label}</Text>
              <Text style={styles.checkDesc}>{check.desc}</Text>
            </View>

            <View style={[
              styles.checkBadge,
              { backgroundColor: check.passed ? Colors.success : Colors.danger },
            ]}>
              <Ionicons
                name={check.passed ? 'checkmark' : 'close'}
                size={12}
                color="#000"
              />
            </View>
          </View>
        ))}

        {/* ── GPS Status ──────────────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>GPS Status</Text>

        <View style={styles.gpsCard}>
          {[
            { label: 'Accuracy',       value: GPS_STATUS.accuracy,         color: Colors.success },
            { label: 'Speed',          value: GPS_STATUS.speed,             color: Colors.accent  },
            { label: 'Satellites',     value: GPS_STATUS.satellites,        color: Colors.textPrimary },
            { label: 'Signal',         value: GPS_STATUS.signal,            color: Colors.success },
            { label: 'Mock Location',  value: GPS_STATUS.mockDetected ? 'DETECTED!' : 'NOT DETECTED',
              color: GPS_STATUS.mockDetected ? Colors.danger : Colors.success },
          ].map((row) => (
            <View key={row.label} style={styles.gpsRow}>
              <Text style={styles.gpsLabel}>{row.label}</Text>
              <Text style={[styles.gpsValue, { color: row.color }]}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* ── Violation Log (empty) ────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Violation Log</Text>
        <View style={styles.emptyLog}>
          <Ionicons name="checkmark-circle-outline" size={30} color={Colors.textMuted} />
          <Text style={styles.emptyLogText}>No violations recorded today</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1 },
  content: { paddingBottom: 30 },

  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  title: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  subtitle: {
    fontSize: 11, color: Colors.textSecondary,
    fontFamily: 'Courier', marginTop: 3,
  },

  statusCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  shieldWrap: {
    width: 70, height: 70, borderRadius: 35,
    alignItems: 'center', justifyContent: 'center',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontFamily: 'Courier',
    textAlign: 'center',
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 4,
  },

  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  checkIcon: {
    width: 38, height: 38, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  checkText: { flex: 1 },
  checkLabel: { fontSize: 13, color: Colors.textPrimary, fontWeight: '600', marginBottom: 2 },
  checkDesc:  { fontSize: 10, color: Colors.textMuted, fontFamily: 'Courier' },
  checkBadge: {
    width: 22, height: 22, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },

  gpsCard: {
    backgroundColor: Colors.card,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: 14,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 14,
    gap: 10,
  },
  gpsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gpsLabel: { fontSize: 12, color: Colors.textSecondary },
  gpsValue: { fontSize: 12, fontFamily: 'Courier', fontWeight: '600' },

  emptyLog: {
    backgroundColor: Colors.card,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: 14,
    marginHorizontal: 20,
    padding: 24,
    alignItems: 'center',
    gap: 10,
  },
  emptyLogText: { fontSize: 13, color: Colors.textMuted, fontFamily: 'Courier' },
});
