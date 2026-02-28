// ─────────────────────────────────────────────────────────────────────────────
// FIELDTRACK – Tasks Screen  (app/(tabs)/tasks.tsx)
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/theme';
import { TASKS, TaskStatus } from '../../constants/data';
import { TaskCard } from '../../components/TaskCard';

type Filter = 'all' | TaskStatus;

const FILTERS: Filter[] = ['all', 'assigned', 'started', 'completed'];

export default function TasksScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered =
    filter === 'all' ? TASKS : TASKS.filter((t) => t.status === filter);

  const countFor = (f: Filter) =>
    f === 'all' ? TASKS.length : TASKS.filter((t) => t.status === f).length;

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Header ────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.title}>My Tasks</Text>
        <Text style={styles.subtitle}>
          {TASKS.length} total · {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </Text>
      </View>

      {/* ── Filter Chips ─────────────────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContent}
        style={styles.filters}
      >
        {FILTERS.map((f) => {
          const isActive = filter === f;
          return (
            <TouchableOpacity
              key={f}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => setFilter(f)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {f.toUpperCase()}
              </Text>
              <Text style={[styles.chipCount, isActive && styles.chipCountActive]}>
                {countFor(f)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Task List ────────────────────────────────────────────────── */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>No tasks in this category</Text>
          </View>
        ) : (
          filtered.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              showCheckpoints
              onPress={() =>
                router.push({ pathname: '/task-detail', params: { id: task.id } })
              }
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },

  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontFamily: 'Courier',
  },

  filters: { flexGrow: 0 },
  filtersContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  chipText: {
    fontSize: 10,
    fontFamily: 'Courier',
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#000',
    fontWeight: '700',
  },
  chipCount: {
    fontSize: 10,
    fontFamily: 'Courier',
    color: Colors.textMuted,
  },
  chipCountActive: {
    color: '#00000080',
  },

  list: { flex: 1 },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 10,
  },
  emptyIcon: { fontSize: 40 },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
    fontFamily: 'Courier',
  },
});
