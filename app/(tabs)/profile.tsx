// ─────────────────────────────────────────────────────────────────────────────
// FIELDTRACK – Profile Screen  (app/(tabs)/profile.tsx)
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { CURRENT_USER, DASHBOARD_STATS } from '../../constants/data';
import { useAuth } from '../../store/useAuth';

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sub: string;
  color: string;
}

const MENU_ITEMS: MenuItem[] = [
  { icon: 'notifications-outline', label: 'Notifications',    sub: 'Task alerts & warnings',        color: Colors.warning  },
  { icon: 'map-outline',           label: 'Route History',    sub: 'Past 30 days',                  color: Colors.accent   },
  { icon: 'star-outline',          label: 'Performance',      sub: '95% on-time · 0 deviations',    color: Colors.success  },
  { icon: 'call-outline',          label: 'Contact Admin',    sub: '+91 11 2345 6789',              color: Colors.purple   },
  { icon: 'shield-outline',        label: 'Privacy Policy',   sub: 'Data usage & permissions',      color: Colors.textSecondary },
  { icon: 'information-circle-outline', label: 'App Info',   sub: 'v2.4.1 · Enterprise Edition',   color: Colors.textSecondary },
];

export default function ProfileScreen() {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out? Your location tracking will stop.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Profile</Text>
        </View>

        {/* ── Profile Card ─────────────────────────────────────────────── */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarText}>{CURRENT_USER.avatar}</Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{CURRENT_USER.name}</Text>
            <Text style={styles.profileRole}>{CURRENT_USER.role}</Text>
            <View style={styles.employeeIdPill}>
              <Text style={styles.employeeIdText}>{CURRENT_USER.employeeId}</Text>
            </View>
          </View>
        </View>

        {/* ── Zone Info ───────────────────────────────────────────────── */}
        <View style={styles.zoneCard}>
          <View style={styles.zoneRow}>
            <Ionicons name="location-outline" size={14} color={Colors.accent} />
            <Text style={styles.zoneText}>{CURRENT_USER.zone}</Text>
          </View>

          <View style={styles.statsRow}>
            {[
              { v: DASHBOARD_STATS.todayDistance, l: 'Today' },
              { v: `${DASHBOARD_STATS.tasksCompleted}/${DASHBOARD_STATS.tasksTotal}`, l: 'Tasks' },
              { v: `${DASHBOARD_STATS.deviations}`, l: 'Deviations' },
            ].map((s) => (
              <View key={s.l} style={styles.statItem}>
                <Text style={styles.statValue}>{s.v}</Text>
                <Text style={styles.statLabel}>{s.l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Menu ────────────────────────────────────────────────────── */}
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.menuRow}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
              <Ionicons name={item.icon} size={16} color={item.color} />
            </View>
            <View style={styles.menuText}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuSub}>{item.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} />
          </TouchableOpacity>
        ))}

        {/* ── Logout Button ────────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={16} color={Colors.danger} />
          <Text style={styles.logoutText}>SIGN OUT</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1 },
  content: { paddingBottom: 30 },

  pageHeader: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },

  profileCard: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  avatarWrap: {
    width: 60, height: 60, borderRadius: 16,
    backgroundColor: `${Colors.accent}30`,
    borderWidth: 2, borderColor: `${Colors.accent}50`,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: { fontSize: 22, fontWeight: '800', color: Colors.accent },

  profileInfo: { flex: 1, gap: 4 },
  profileName: { fontSize: 17, fontWeight: '800', color: Colors.textPrimary },
  profileRole: { fontSize: 12, color: Colors.accent, fontFamily: 'Courier' },
  employeeIdPill: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.bg,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  employeeIdText: { fontSize: 9, color: Colors.textMuted, fontFamily: 'Courier' },

  zoneCard: {
    backgroundColor: Colors.card,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: 14,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 14,
    gap: 12,
  },
  zoneRow: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  zoneText: { fontSize: 12, color: Colors.textSecondary },

  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center', gap: 3 },
  statValue: { fontSize: 17, fontWeight: '800', color: Colors.textPrimary },
  statLabel: { fontSize: 9, color: Colors.textMuted, fontFamily: 'Courier', textTransform: 'uppercase' },

  menuRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.card,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 20, marginBottom: 8,
  },
  menuIcon: { width: 36, height: 36, borderRadius: 9, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  menuText: { flex: 1 },
  menuLabel: { fontSize: 13, color: Colors.textPrimary, fontWeight: '600' },
  menuSub:   { fontSize: 10, color: Colors.textMuted, fontFamily: 'Courier', marginTop: 2 },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.dangerDim,
    borderWidth: 1, borderColor: `${Colors.danger}40`,
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 20,
    marginTop: 4,
  },
  logoutText: { fontSize: 13, fontWeight: '700', color: Colors.danger, letterSpacing: 0.5 },
});
