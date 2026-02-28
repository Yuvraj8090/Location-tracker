// ─────────────────────────────────────────────────────────────────────────────
// FIELDTRACK – TaskCard Component
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from './Badge';
import { Colors, priorityColors } from '../constants/theme';
import type { Task } from '../constants/data';

interface Props {
  task: Task;
  onPress: () => void;
  showCheckpoints?: boolean;
}

export function TaskCard({ task, onPress, showCheckpoints = false }: Props) {
  const reachedCount = task.checkpoints.filter((c) => c.reached).length;
  const priorityColor = priorityColors[task.priority] ?? Colors.warning;

  const statusIcon: Record<string, keyof typeof Ionicons.glyphMap> = {
    completed: 'checkmark-circle',
    started:   'navigate',
    assigned:  'time',
    reached:   'location',
  };

  const statusIconColor: Record<string, string> = {
    completed: Colors.success,
    started:   Colors.accent,
    assigned:  Colors.warning,
    reached:   Colors.purple,
  };

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: priorityColor }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Header row */}
      <View style={styles.headerRow}>
        <View style={[styles.iconWrap, { backgroundColor: `${statusIconColor[task.status]}18` }]}>
          <Ionicons
            name={statusIcon[task.status] ?? 'time'}
            size={18}
            color={statusIconColor[task.status] ?? Colors.accent}
          />
        </View>

        <View style={styles.headerText}>
          <Text style={styles.taskId}>{task.id}</Text>
          <Text style={styles.taskTitle} numberOfLines={1}>{task.title}</Text>
        </View>

        <Badge status={task.status} />
      </View>

      {/* Route row */}
      <View style={styles.routeBox}>
        <View style={styles.routeRow}>
          <View style={[styles.routeDot, { backgroundColor: Colors.success }]} />
          <Text style={styles.routeText} numberOfLines={1}>{task.start.label}</Text>
        </View>
        <View style={styles.routeLine} />
        <View style={styles.routeRow}>
          <View style={[styles.routeDot, { backgroundColor: Colors.danger }]} />
          <Text style={styles.routeText} numberOfLines={1}>{task.end.label}</Text>
        </View>
      </View>

      {/* Meta row */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="location-outline" size={11} color={Colors.textMuted} />
          <Text style={styles.metaText}>{task.distance}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={11} color={Colors.textMuted} />
          <Text style={styles.metaText}>{task.assignedAt} – {task.deadline}</Text>
        </View>
        <View style={styles.metaItem}>
          <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
          <Text style={[styles.priorityText, { color: priorityColor }]}>
            {task.priority.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Checkpoint progress bar */}
      {showCheckpoints && task.status !== 'assigned' && (
        <View style={styles.checkpointRow}>
          {task.checkpoints.map((cp) => (
            <View
              key={cp.id}
              style={[
                styles.checkpointBar,
                { backgroundColor: cp.reached ? Colors.success : Colors.border },
              ]}
            />
          ))}
          <Text style={styles.checkpointCount}>
            {reachedCount}/{task.checkpoints.length} pts
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 3,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerText: {
    flex: 1,
  },
  taskId: {
    fontSize: 9,
    color: Colors.textMuted,
    fontFamily: 'Courier',
    letterSpacing: 1,
    marginBottom: 2,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  routeBox: {
    backgroundColor: Colors.bg,
    borderRadius: 10,
    padding: 10,
    gap: 6,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    flexShrink: 0,
  },
  routeLine: {
    width: 1,
    height: 10,
    backgroundColor: Colors.border,
    marginLeft: 3,
  },
  routeText: {
    fontSize: 11,
    color: Colors.textSecondary,
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 10,
    color: Colors.textMuted,
    fontFamily: 'Courier',
  },
  priorityDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  priorityText: {
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'Courier',
    letterSpacing: 0.8,
  },
  checkpointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  checkpointBar: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  checkpointCount: {
    fontSize: 9,
    color: Colors.textMuted,
    fontFamily: 'Courier',
    marginLeft: 4,
  },
});
