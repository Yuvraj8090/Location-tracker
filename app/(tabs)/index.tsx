// ─────────────────────────────────────────────────────────────────────────────
// FIELDTRACK – Home Dashboard  (app/(tabs)/index.tsx)
// ─────────────────────────────────────────────────────────────────────────────
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { TASKS, CURRENT_USER, DASHBOARD_STATS } from '../../constants/data';
import { StatCard }      from '../../components/StatCard';
import { Badge }         from '../../components/Badge';
import { SecurityBanner } from '../../components/SecurityBanner';

export default function HomeScreen() {
  const router    = useRouter();
  const activeTask = TASKS.find((t) => t.status === 'started');

  // Pulse animation for live dot
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.5, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,   duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>GOOD MORNING</Text>
            <Text style={styles.userName}>
              {CURRENT_USER.name.split(' ')[0]} 👋
            </Text>
            <View style={styles.liveRow}>
              <Animated.View style={[styles.liveDot, { opacity: pulseAnim }]} />
              <Text style={styles.liveText}>
                LIVE · {CURRENT_USER.zone}
              </Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{CURRENT_USER.avatar}</Text>
            </View>
          </View>
        </View>

        {/* ── Stat Cards ──────────────────────────────────────────────── */}
        <View style={styles.statsRow}>
          <StatCard
            icon="trending-up-outline"
            value={DASHBOARD_STATS.todayDistance}
            label="Today KM"
            color={Colors.accent}
          />
          <StatCard
            icon="clipboard-outline"
            value={`${DASHBOARD_STATS.tasksCompleted}/${DASHBOARD_STATS.tasksTotal}`}
            label="Tasks"
            color={Colors.success}
          />
          <StatCard
            icon="time-outline"
            value={DASHBOARD_STATS.hoursActive}
            label="Active"
            color={Colors.purple}
          />
        </View>

        {/* ── Active Task Banner ───────────────────────────────────────── */}
        {activeTask && (
          <View style={styles.activeBanner}>
            <View style={styles.activeBannerHeader}>
              <View>
                <Text style={styles.activeBannerLabel}>▶ ACTIVE MISSION</Text>
                <Text style={styles.activeBannerTitle}>{activeTask.title}</Text>
              </View>
              <Badge status={activeTask.status} />
            </View>

            {/* Progress bar */}
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>ROUTE PROGRESS</Text>
                <Text style={styles.progressValue}>
                  {DASHBOARD_STATS.routeProgress}%
                </Text>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${DASHBOARD_STATS.routeProgress}%` },
                  ]}
                />
              </View>
            </View>

            <View style={styles.activeBannerFooter}>
              <View style={styles.activeMeta}>
                <Text style={styles.activeMetaText}>
                  <Text style={styles.activeMetaValue}>{activeTask.distance}</Text> total
                </Text>
                <Text style={styles.activeMetaText}>
                  ETA <Text style={[styles.activeMetaValue, { color: Colors.warning }]}>
                    {activeTask.eta}
                  </Text>
                </Text>
              </View>
              <TouchableOpacity
                style={styles.viewBtn}
                onPress={() =>
                  router.push({ pathname: '/task-detail', params: { id: activeTask.id } })
                }
              >
                <Text style={styles.viewBtnText}>VIEW →</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── Tasks Section ────────────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Tasks</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/tasks')}>
            <Text style={styles.seeAll}>SEE ALL →</Text>
          </TouchableOpacity>
        </View>

        {TASKS.map((task) => {
          const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
            completed: 'checkmark-circle',
            started:   'navigate',
            assigned:  'time-outline',
          };
          const colorMap: Record<string, string> = {
            completed: Colors.success,
            started:   Colors.accent,
            assigned:  Colors.warning,
          };
          const bgMap: Record<string, string> = {
            completed: Colors.successDim,
            started:   Colors.accentGlow,
            assigned:  Colors.warningDim,
          };

          return (
            <TouchableOpacity
              key={task.id}
              style={styles.taskRow}
              onPress={() =>
                router.push({ pathname: '/task-detail', params: { id: task.id } })
              }
              activeOpacity={0.75}
            >
              <View style={[styles.taskIcon, { backgroundColor: bgMap[task.status] }]}>
                <Ionicons
                  name={iconMap[task.status] ?? 'time-outline'}
                  size={18}
                  color={colorMap[task.status] ?? Colors.accent}
                />
              </View>
              <View style={styles.taskInfo}>
                <Text style={styles.taskTitle} numberOfLines={1}>{task.title}</Text>
                <View style={styles.taskMeta}>
                  <View style={[styles.priorityDot, { backgroundColor: colorMap[task.priority] }]} />
                  <Text style={styles.taskMetaText}>{task.priority.toUpperCase()}</Text>
                  <Text style={styles.taskMetaText}>· {task.deadline}</Text>
                </View>
              </View>
              <Badge status={task.status} />
            </TouchableOpacity>
          );
        })}

        {/* ── Security Banner ──────────────────────────────────────────── */}
        <SecurityBanner lastCheck="2 min ago" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingBottom: 20 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
  },
  greeting: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontFamily: 'Courier',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 28,
  },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },
  liveText: { fontSize: 10, color: Colors.success, fontFamily: 'Courier', letterSpacing: 0.5 },

  headerRight: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  iconBtn: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  avatar: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: `${Colors.accent}30`,
    borderWidth: 1, borderColor: `${Colors.accent}50`,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 13, fontWeight: '800', color: Colors.accent },

  statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 16 },

  // Active banner
  activeBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: `${Colors.accent}10`,
    borderWidth: 1.5,
    borderColor: `${Colors.accent}40`,
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  activeBannerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  activeBannerLabel: { fontSize: 9, color: Colors.accent, fontFamily: 'Courier', letterSpacing: 2, marginBottom: 4 },
  activeBannerTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },

  progressSection: { gap: 6 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { fontSize: 10, color: Colors.textSecondary, fontFamily: 'Courier' },
  progressValue: { fontSize: 10, color: Colors.accent, fontFamily: 'Courier' },
  progressTrack: { height: 5, backgroundColor: Colors.border, borderRadius: 3, overflow: 'hidden' },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 3,
  },

  activeBannerFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  activeMeta: { flexDirection: 'row', gap: 14 },
  activeMetaText: { fontSize: 11, color: Colors.textSecondary },
  activeMetaValue: { color: Colors.textPrimary, fontWeight: '600' },
  viewBtn: {
    backgroundColor: Colors.accent, borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 7,
  },
  viewBtnText: { fontSize: 11, fontWeight: '700', color: '#000' },

  // Section header
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 12,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  seeAll: { fontSize: 11, color: Colors.accent, fontFamily: 'Courier' },

  // Task row
  taskRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 14, padding: 14, marginHorizontal: 20, marginBottom: 10,
  },
  taskIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  taskMeta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  priorityDot: { width: 4, height: 4, borderRadius: 2 },
  taskMetaText: { fontSize: 10, color: Colors.textMuted, fontFamily: 'Courier' },
});
