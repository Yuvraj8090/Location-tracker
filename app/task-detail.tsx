// ─────────────────────────────────────────────────────────────────────────────
// FIELDTRACK – Task Detail Screen  (app/task-detail.tsx)
// Opened as a Stack modal from any task card
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, priorityColors } from '../constants/theme';
import { TASKS } from '../constants/data';
import { Badge } from '../components/Badge';

const { width } = Dimensions.get('window');
const MAP_H = 140;

// ── Mini route map ───────────────────────────────────────────────────────────
function MiniRouteMap({ progress }: { progress: number }) {
  const pts = [
    { x: 0.06, y: 0.82 }, { x: 0.20, y: 0.64 }, { x: 0.36, y: 0.48 },
    { x: 0.52, y: 0.38 }, { x: 0.68, y: 0.32 }, { x: 0.84, y: 0.26 }, { x: 0.92, y: 0.18 },
  ];
  const traveled = Math.ceil((progress / 100) * pts.length);
  const mapW = width - 40;

  return (
    <View style={miniStyles.container}>
      {/* Grid */}
      {Array.from({ length: 6 }).map((_, i) => (
        <View key={`h${i}`} style={[miniStyles.gridH, { top: (i / 5) * MAP_H }]} />
      ))}

      {/* Assigned route (dashed) */}
      {pts.slice(0, -1).map((pt, i) => {
        const nx = pts[i + 1];
        const x1 = pt.x * mapW, y1 = pt.y * MAP_H;
        const x2 = nx.x * mapW, y2 = nx.y * MAP_H;
        const len   = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
        const angle = Math.atan2(y2-y1, x2-x1) * (180 / Math.PI);
        return (
          <View key={`a${i}`} style={{
            position: 'absolute', left: x1, top: y1-1,
            width: len, height: 2,
            backgroundColor: Colors.accent,
            opacity: 0.35,
            transform: [{ rotate: `${angle}deg` }],
            transformOrigin: '0 50%',
          }} />
        );
      })}

      {/* Traveled route (solid) */}
      {pts.slice(0, traveled - 1).map((pt, i) => {
        if (i >= traveled - 1) return null;
        const nx = pts[i + 1];
        const x1 = pt.x * mapW, y1 = pt.y * MAP_H;
        const x2 = nx.x * mapW, y2 = nx.y * MAP_H;
        const len   = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
        const angle = Math.atan2(y2-y1, x2-x1) * (180 / Math.PI);
        return (
          <View key={`t${i}`} style={{
            position: 'absolute', left: x1, top: y1-2,
            width: len, height: 4,
            backgroundColor: Colors.success, borderRadius: 2,
            transform: [{ rotate: `${angle}deg` }],
            transformOrigin: '0 50%',
          }} />
        );
      })}

      {/* Start */}
      <View style={[miniStyles.dot, { left: pts[0].x*mapW-6, top: pts[0].y*MAP_H-6, backgroundColor: Colors.success }]} />
      {/* End */}
      <View style={[miniStyles.dot, { left: pts[pts.length-1].x*mapW-6, top: pts[pts.length-1].y*MAP_H-6, backgroundColor: Colors.danger }]} />
      {/* Current position */}
      <View style={[miniStyles.youWrap, {
        left: pts[Math.min(traveled-1, pts.length-1)].x * mapW - 14,
        top:  pts[Math.min(traveled-1, pts.length-1)].y * MAP_H - 14,
      }]}>
        <View style={miniStyles.youRing} />
        <View style={miniStyles.youDot}>
          <Text style={miniStyles.youText}>▲</Text>
        </View>
      </View>

      <View style={miniStyles.osmAttr}>
        <Text style={miniStyles.osmText}>© OpenStreetMap</Text>
      </View>
    </View>
  );
}

const miniStyles = StyleSheet.create({
  container: {
    height: MAP_H,
    backgroundColor: '#0D1526',
    position: 'relative',
    overflow: 'hidden',
  },
  gridH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: `${Colors.border}30` },
  dot: { position: 'absolute', width: 12, height: 12, borderRadius: 6, borderWidth: 1.5, borderColor: Colors.bg },
  youWrap: { position: 'absolute', width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  youRing: {
    position: 'absolute', width: 28, height: 28, borderRadius: 14,
    borderWidth: 1.5, borderColor: Colors.accent, opacity: 0.5,
  },
  youDot: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
    zIndex: 1,
  },
  youText: { fontSize: 9, color: '#000', fontWeight: '800' },
  osmAttr: {
    position: 'absolute', bottom: 4, right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 3,
    paddingHorizontal: 4, paddingVertical: 1,
  },
  osmText: { fontSize: 7, color: Colors.textMuted, fontFamily: 'Courier' },
});

// ── Confirm Modal ─────────────────────────────────────────────────────────────
function ConfirmModal({
  visible,
  onCancel,
  onConfirm,
  title,
  message,
}: {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={confirmStyles.overlay}>
        <View style={confirmStyles.sheet}>
          <View style={confirmStyles.handle} />
          <Text style={confirmStyles.title}>{title}</Text>
          <Text style={confirmStyles.message}>{message}</Text>
          <View style={confirmStyles.row}>
            <TouchableOpacity style={confirmStyles.cancelBtn} onPress={onCancel}>
              <Text style={confirmStyles.cancelText}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity style={confirmStyles.confirmBtn} onPress={onConfirm}>
              <Ionicons name="checkmark" size={16} color="#000" />
              <Text style={confirmStyles.confirmText}>CONFIRM</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const confirmStyles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1, borderTopColor: Colors.border,
    borderRadius: 24,
    padding: 24, paddingBottom: 40,
    gap: 12,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center', marginBottom: 8,
  },
  title: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  message: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  row: { flexDirection: 'row', gap: 10, marginTop: 4 },
  cancelBtn: {
    flex: 1, padding: 14,
    backgroundColor: Colors.card,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: 12, alignItems: 'center',
  },
  cancelText: { color: Colors.textSecondary, fontWeight: '700', fontSize: 13 },
  confirmBtn: {
    flex: 2, padding: 14,
    backgroundColor: Colors.accent,
    borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  confirmText: { color: '#000', fontWeight: '700', fontSize: 13 },
});

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function TaskDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const task = TASKS.find((t) => t.id === id) ?? TASKS[0];

  const [showConfirm, setShowConfirm] = useState(false);
  const [localStatus, setLocalStatus] = useState(task.status);

  const reachedCount = task.checkpoints.filter((c) => c.reached).length;
  const progress = Math.round((reachedCount / task.checkpoints.length) * 100);
  const priorityColor = priorityColors[task.priority] ?? Colors.warning;

  const ctaLabel: Record<string, string> = {
    assigned: 'START NAVIGATION',
    started:  'MARK AS REACHED',
    reached:  'COMPLETE TASK',
    completed:'TASK COMPLETED',
  };

  const handleCTA = () => {
    if (localStatus === 'completed') return;
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    const next: Record<string, string> = {
      assigned: 'started',
      started:  'reached',
      reached:  'completed',
    };
    setLocalStatus((next[localStatus] ?? localStatus) as typeof localStatus);
    setShowConfirm(false);
    Alert.alert(
      '✅ Updated',
      'Status updated. GPS coordinates & timestamp captured.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Back button ──────────────────────────────────────────────── */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={Colors.textSecondary} />
          <Text style={styles.backText}>BACK</Text>
        </TouchableOpacity>
        <Badge status={localStatus} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Task title */}
        <Text style={styles.taskId}>{task.id}</Text>
        <Text style={styles.taskTitle}>{task.title}</Text>

        {/* Priority & deadline row */}
        <View style={styles.metaRow}>
          <View style={[styles.priorityChip, { backgroundColor: `${priorityColor}18` }]}>
            <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
            <Text style={[styles.priorityText, { color: priorityColor }]}>
              {task.priority.toUpperCase()} PRIORITY
            </Text>
          </View>
          <View style={styles.deadlineChip}>
            <Ionicons name="time-outline" size={12} color={Colors.textMuted} />
            <Text style={styles.deadlineText}>Due {task.deadline}</Text>
          </View>
        </View>

        {/* Map */}
        <View style={styles.mapWrap}>
          <MiniRouteMap progress={progress} />
        </View>

        {/* Route info */}
        <View style={styles.routeCard}>
          <View style={styles.routeRow}>
            <View style={[styles.routeIconWrap, { backgroundColor: Colors.successDim }]}>
              <Ionicons name="location" size={14} color={Colors.success} />
            </View>
            <View style={styles.routeInfo}>
              <Text style={styles.routeInfoLabel}>FROM</Text>
              <Text style={styles.routeInfoValue}>{task.start.label}</Text>
            </View>
          </View>
          <View style={styles.routeSpacer} />
          <View style={styles.routeRow}>
            <View style={[styles.routeIconWrap, { backgroundColor: Colors.dangerDim }]}>
              <Ionicons name="flag" size={14} color={Colors.danger} />
            </View>
            <View style={styles.routeInfo}>
              <Text style={styles.routeInfoLabel}>TO</Text>
              <Text style={styles.routeInfoValue}>{task.end.label}</Text>
            </View>
          </View>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          {[
            { label: 'Distance', value: task.distance, icon: 'navigate-outline'   as const, color: Colors.accent   },
            { label: 'ETA',      value: task.eta,      icon: 'time-outline'       as const, color: Colors.warning  },
            { label: 'Deadline', value: task.deadline, icon: 'alert-circle-outline' as const, color: Colors.danger },
          ].map((s) => (
            <View key={s.label} style={styles.statBox}>
              <Ionicons name={s.icon} size={16} color={s.color} />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Notes */}
        {task.notes && (
          <View style={styles.notesBox}>
            <Ionicons name="document-text-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.notesText}>{task.notes}</Text>
          </View>
        )}

        {/* Checkpoints */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Checkpoints</Text>
          <Text style={styles.sectionSub}>
            {reachedCount}/{task.checkpoints.length} REACHED
          </Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        {task.checkpoints.map((cp, i) => (
          <View
            key={cp.id}
            style={[
              styles.checkpointRow,
              cp.reached && { backgroundColor: Colors.successDim, borderColor: `${Colors.success}30` },
            ]}
          >
            <View style={[
              styles.checkpointNum,
              { backgroundColor: cp.reached ? Colors.success : Colors.border },
            ]}>
              {cp.reached
                ? <Ionicons name="checkmark" size={12} color="#000" />
                : <Text style={styles.checkpointNumText}>{i + 1}</Text>
              }
            </View>
            <Text style={[
              styles.checkpointLabel,
              { color: cp.reached ? Colors.success : Colors.textSecondary },
              cp.reached && { fontWeight: '600' },
            ]}>
              {cp.label}
            </Text>
            {cp.reached && (
              <Text style={styles.checkpointDone}>✓ DONE</Text>
            )}
          </View>
        ))}
      </ScrollView>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <View style={styles.ctaWrap}>
        <TouchableOpacity
          style={[
            styles.ctaBtn,
            localStatus === 'completed' && styles.ctaBtnDone,
          ]}
          onPress={handleCTA}
          activeOpacity={0.8}
          disabled={localStatus === 'completed'}
        >
          <Ionicons
            name={localStatus === 'completed' ? 'checkmark-circle' : 'navigate'}
            size={18}
            color={localStatus === 'completed' ? Colors.success : '#000'}
          />
          <Text style={[
            styles.ctaBtnText,
            localStatus === 'completed' && { color: Colors.success },
          ]}>
            {ctaLabel[localStatus]}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Confirm modal */}
      <ConfirmModal
        visible={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        title="Confirm Update"
        message="GPS coordinates, timestamp, and location will be automatically captured and sent to admin."
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText: { fontSize: 11, color: Colors.textSecondary, fontFamily: 'Courier' },

  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 10 },

  taskId: {
    fontSize: 9, color: Colors.textMuted,
    fontFamily: 'Courier', letterSpacing: 1.2, marginBottom: 5,
  },
  taskTitle: {
    fontSize: 20, fontWeight: '800',
    color: Colors.textPrimary, marginBottom: 12, lineHeight: 26,
  },
  metaRow: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  priorityChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5,
  },
  priorityDot: { width: 5, height: 5, borderRadius: 2.5 },
  priorityText: { fontSize: 9, fontWeight: '700', fontFamily: 'Courier' },
  deadlineChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.card,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5,
  },
  deadlineText: { fontSize: 10, color: Colors.textSecondary, fontFamily: 'Courier' },

  mapWrap: {
    borderRadius: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.border,
    marginBottom: 14,
  },

  routeCard: {
    backgroundColor: Colors.card,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: 14, padding: 14, marginBottom: 12, gap: 8,
  },
  routeRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  routeIconWrap: { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  routeInfo: { flex: 1 },
  routeInfoLabel: { fontSize: 9, color: Colors.textMuted, fontFamily: 'Courier', letterSpacing: 1, marginBottom: 2 },
  routeInfoValue: { fontSize: 12, color: Colors.textPrimary, fontWeight: '500' },
  routeSpacer: { width: 1, height: 14, backgroundColor: Colors.border, marginLeft: 12 },

  statsGrid: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  statBox: {
    flex: 1, backgroundColor: Colors.card,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: 12, padding: 10, alignItems: 'center', gap: 4,
  },
  statValue: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary },
  statLabel: { fontSize: 8, color: Colors.textMuted, fontFamily: 'Courier', textTransform: 'uppercase' },

  notesBox: {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    backgroundColor: Colors.card,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: 12, padding: 12, marginBottom: 16,
  },
  notesText: { flex: 1, fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },

  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  sectionSub:   { fontSize: 10, color: Colors.accent, fontFamily: 'Courier' },

  progressTrack: {
    height: 5, backgroundColor: Colors.border,
    borderRadius: 3, overflow: 'hidden', marginBottom: 12,
  },
  progressFill: {
    height: '100%', borderRadius: 3,
    backgroundColor: Colors.success,
  },

  checkpointRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.card,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: 10, padding: 10, marginBottom: 8,
  },
  checkpointNum: {
    width: 24, height: 24, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  checkpointNumText: { fontSize: 9, color: Colors.textMuted, fontFamily: 'Courier' },
  checkpointLabel: { flex: 1, fontSize: 12, color: Colors.textSecondary },
  checkpointDone: { fontSize: 9, color: Colors.success, fontFamily: 'Courier' },

  ctaWrap: {
    padding: 16, paddingBottom: 24,
    borderTopWidth: 1, borderTopColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  ctaBtn: {
    backgroundColor: Colors.accent, borderRadius: 14, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  ctaBtnDone: { backgroundColor: Colors.successDim, borderWidth: 1, borderColor: `${Colors.success}40` },
  ctaBtnText: { fontSize: 14, fontWeight: '800', color: '#000', letterSpacing: 0.4 },
});
