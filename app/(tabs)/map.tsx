// ─────────────────────────────────────────────────────────────────────────────
// FIELDTRACK – Map Screen  (app/(tabs)/map.tsx)
// Uses View-based map simulation.
// For production: replace <SimulatedMap> with MapLibre GL RN
//   → npm install @maplibre/maplibre-react-native
// ─────────────────────────────────────────────────────────────────────────────
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { FIELD_AGENTS } from '../../constants/data';

const { width } = Dimensions.get('window');
const MAP_HEIGHT = 280;

// ── Route polyline points (normalized 0–1) ──────────────────────────────────
const ASSIGNED_ROUTE = [
  { x: 0.13, y: 0.85 }, { x: 0.20, y: 0.70 }, { x: 0.30, y: 0.58 },
  { x: 0.42, y: 0.50 }, { x: 0.54, y: 0.44 }, { x: 0.64, y: 0.39 },
  { x: 0.74, y: 0.36 }, { x: 0.84, y: 0.30 }, { x: 0.90, y: 0.22 },
];
const ACTUAL_ROUTE = ASSIGNED_ROUTE.slice(0, 7);

// ── Ping animation component ────────────────────────────────────────────────
function PingDot({ color }: { color: string }) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.timing(scale,   { toValue: 2.2, duration: 1500, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0,   duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: 20, height: 20,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: color,
        transform: [{ scale }],
        opacity,
      }}
    />
  );
}

// ── Simple polyline using positioned Views ───────────────────────────────────
function MapPolyline({
  points,
  mapW,
  mapH,
  color,
  dashed = false,
  strokeWidth = 2.5,
}: {
  points: { x: number; y: number }[];
  mapW: number;
  mapH: number;
  color: string;
  dashed?: boolean;
  strokeWidth?: number;
}) {
  return (
    <>
      {points.slice(0, -1).map((pt, i) => {
        const next = points[i + 1];
        const x1 = pt.x   * mapW;
        const y1 = pt.y   * mapH;
        const x2 = next.x * mapW;
        const y2 = next.y * mapH;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: x1,
              top: y1 - strokeWidth / 2,
              width: len,
              height: strokeWidth,
              backgroundColor: dashed ? 'transparent' : color,
              borderWidth: dashed ? strokeWidth / 2 : 0,
              borderColor: dashed ? color : 'transparent',
              borderStyle: dashed ? 'dashed' : 'solid',
              opacity: dashed ? 0.5 : 0.85,
              transformOrigin: '0 50%',
              transform: [{ rotate: `${angle}deg` }],
              borderRadius: 2,
            }}
          />
        );
      })}
    </>
  );
}

// ── Simulated Map ────────────────────────────────────────────────────────────
function SimulatedMap({ mapW }: { mapW: number }) {
  const mapH = MAP_HEIGHT;

  return (
    <View style={[styles.mapCanvas, { height: mapH }]}>
      {/* Grid */}
      {Array.from({ length: 8 }).map((_, i) => (
        <View key={`h${i}`} style={[styles.gridLine, {
          top: (i / 7) * mapH, left: 0, right: 0, height: 1,
        }]} />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <View key={`v${i}`} style={[styles.gridLine, {
          left: (i / 7) * mapW, top: 0, bottom: 0, width: 1,
        }]} />
      ))}

      {/* Simulated roads */}
      <View style={[styles.road, { top: mapH * 0.52, left: 0, right: 0, height: 8 }]} />
      <View style={[styles.road, { left: mapW * 0.45, top: 0, bottom: 0, width: 8 }]} />
      <View style={[styles.road, { top: mapH * 0.28, left: 0, right: 0, height: 5, opacity: 0.5 }]} />
      <View style={[styles.road, { top: mapH * 0.75, left: 0, right: 0, height: 5, opacity: 0.5 }]} />

      {/* Assigned route (dashed) */}
      <MapPolyline
        points={ASSIGNED_ROUTE}
        mapW={mapW}
        mapH={mapH}
        color={Colors.accent}
        dashed
        strokeWidth={3}
      />

      {/* Actual traveled route (solid green) */}
      <MapPolyline
        points={ACTUAL_ROUTE}
        mapW={mapW}
        mapH={mapH}
        color={Colors.success}
        strokeWidth={3.5}
      />

      {/* Start marker */}
      <View style={[styles.markerWrap, {
        left: ASSIGNED_ROUTE[0].x * mapW - 8,
        top:  ASSIGNED_ROUTE[0].y * mapH - 8,
      }]}>
        <View style={[styles.markerDot, { backgroundColor: Colors.success }]} />
        <Text style={styles.markerLabel}>S</Text>
      </View>

      {/* End marker */}
      <View style={[styles.markerWrap, {
        left: ASSIGNED_ROUTE[ASSIGNED_ROUTE.length - 1].x * mapW - 8,
        top:  ASSIGNED_ROUTE[ASSIGNED_ROUTE.length - 1].y * mapH - 8,
      }]}>
        <View style={[styles.markerDot, { backgroundColor: Colors.danger }]} />
        <Text style={styles.markerLabel}>E</Text>
      </View>

      {/* Agent markers */}
      {FIELD_AGENTS.map((agent) => (
        <View
          key={agent.id}
          style={[styles.agentWrap, { left: agent.mapX * mapW - 12, top: agent.mapY * mapH - 12 }]}
        >
          <PingDot color={agent.status === 'started' ? Colors.accent : Colors.warning} />
          <View style={[
            styles.agentDot,
            { backgroundColor: agent.status === 'started' ? Colors.accent : Colors.warning },
          ]}>
            <Text style={styles.agentInitial}>{agent.avatar.charAt(0)}</Text>
          </View>
        </View>
      ))}

      {/* OSM Attribution */}
      <View style={styles.osmAttr}>
        <Text style={styles.osmText}>© OpenStreetMap contributors</Text>
      </View>
    </View>
  );
}

// ── Main Screen ──────────────────────────────────────────────────────────────
export default function MapScreen() {
  const [mapW, setMapW] = useState(width - 40);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Live Map</Text>
          <View style={styles.liveRow}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>
              OSM · {FIELD_AGENTS.length} agents active
            </Text>
          </View>
        </View>
        <View style={styles.mapTypeBadge}>
          <Ionicons name="map-outline" size={12} color={Colors.accent} />
          <Text style={styles.mapTypeText}>OpenStreetMap</Text>
        </View>
      </View>

      {/* Map */}
      <View
        style={styles.mapWrapper}
        onLayout={(e) => setMapW(e.nativeEvent.layout.width)}
      >
        <SimulatedMap mapW={mapW} />
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: Colors.success }]} />
          <Text style={styles.legendText}>ACTUAL ROUTE</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendLineDashed, { borderColor: Colors.accent }]} />
          <Text style={styles.legendText}>ASSIGNED ROUTE</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.accent }]} />
          <Text style={styles.legendText}>AGENT</Text>
        </View>
      </View>

      {/* Agent cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.agentCards}
        style={styles.agentCardsList}
      >
        {FIELD_AGENTS.map((agent) => (
          <View key={agent.id} style={styles.agentCard}>
            <View style={[
              styles.agentCardAvatar,
              { backgroundColor: agent.status === 'started' ? `${Colors.accent}20` : `${Colors.warning}20` },
            ]}>
              <Text style={[
                styles.agentCardAvatarText,
                { color: agent.status === 'started' ? Colors.accent : Colors.warning },
              ]}>
                {agent.avatar}
              </Text>
            </View>
            <Text style={styles.agentCardName}>{agent.name.split(' ')[0]}</Text>
            <Text style={styles.agentCardTask} numberOfLines={1}>{agent.currentTask}</Text>
            <View style={[
              styles.agentCardStatus,
              { backgroundColor: agent.status === 'started' ? Colors.accentGlow : Colors.warningDim },
            ]}>
              <Text style={[
                styles.agentCardStatusText,
                { color: agent.status === 'started' ? Colors.accent : Colors.warning },
              ]}>
                {agent.status.toUpperCase()}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },
  liveText: { fontSize: 10, color: Colors.success, fontFamily: 'Courier' },
  mapTypeBadge: {
    flexDirection: 'row', gap: 5, alignItems: 'center',
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6,
  },
  mapTypeText: { fontSize: 10, color: Colors.accent, fontFamily: 'Courier' },

  mapWrapper: {
    marginHorizontal: 20,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mapCanvas: {
    backgroundColor: '#0D1526',
    position: 'relative',
    overflow: 'hidden',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: `${Colors.border}40`,
  },
  road: {
    position: 'absolute',
    backgroundColor: '#1A2840',
  },

  markerWrap: {
    position: 'absolute',
    width: 16, height: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  markerDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 1.5, borderColor: Colors.bg },
  markerLabel: { position: 'absolute', fontSize: 7, fontWeight: '800', color: '#000' },

  agentWrap: { position: 'absolute', width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  agentDot: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  agentInitial: { fontSize: 9, fontWeight: '800', color: '#000' },

  osmAttr: {
    position: 'absolute', bottom: 6, right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 4,
    paddingHorizontal: 5, paddingVertical: 2,
  },
  osmText: { fontSize: 7, color: Colors.textMuted, fontFamily: 'Courier' },

  legend: {
    flexDirection: 'row', gap: 16,
    paddingHorizontal: 20, paddingVertical: 10,
    flexWrap: 'wrap',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendLine: { width: 20, height: 2.5, borderRadius: 2 },
  legendLineDashed: { width: 20, height: 0, borderWidth: 1.5, borderStyle: 'dashed' },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 9, color: Colors.textSecondary, fontFamily: 'Courier', letterSpacing: 0.5 },

  agentCardsList: { flexGrow: 0, marginBottom: 8 },
  agentCards: { paddingHorizontal: 20, paddingBottom: 4, gap: 10 },
  agentCard: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: 110,
    gap: 6,
  },
  agentCardAvatar: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  agentCardAvatarText: { fontSize: 12, fontWeight: '800' },
  agentCardName: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary },
  agentCardTask: { fontSize: 9, color: Colors.textMuted, fontFamily: 'Courier', textAlign: 'center' },
  agentCardStatus: {
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
  },
  agentCardStatusText: { fontSize: 8, fontFamily: 'Courier', fontWeight: '700' },
});
