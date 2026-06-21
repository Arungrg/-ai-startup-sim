import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { COLORS, SPACING, RADIUS } from "../../constants/theme";
import { useGameStore } from "../../store/gameStore";
import { ARCHETYPE_DESCRIPTIONS } from "../../constants/rivals";
import { Rival } from "../../types/game";

function fmt(n: number): string {
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return "$" + (n / 1e3).toFixed(1) + "K";
  return "$" + Math.round(n);
}
function fmtN(n: number): string {
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return Math.round(n).toString();
}

function StatBar({ label, value }: { label: string; value: number }) {
  const color =
    value > 70 ? COLORS.green : value > 40 ? COLORS.amber : COLORS.red;
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statBarBg}>
        <View
          style={[
            styles.statBarFill,
            { width: `${value}%` as any, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={styles.statValue}>{Math.round(value)}/100</Text>
    </View>
  );
}

function RivalCard({
  rival,
  playerValuation,
}: {
  rival: Rival;
  playerValuation: number;
}) {
  const isAhead = rival.valuation > playerValuation;
  return (
    <View style={styles.rivalCard}>
      <View style={styles.rivalHeader}>
        <Text style={styles.rivalName}>{rival.name}</Text>
        <View style={styles.archetypeBadge}>
          <Text style={styles.archetypeText}>
            {rival.archetype.replace("_", " ")}
          </Text>
        </View>
      </View>
      <Text style={styles.archetypeDesc}>
        {ARCHETYPE_DESCRIPTIONS[rival.archetype]}
      </Text>
      <View style={styles.rivalStatsRow}>
        <Text style={styles.rivalStat}>Users: {fmtN(rival.users)}</Text>
        <Text style={styles.rivalStat}>
          Quality: {Math.round(rival.productQuality)}
        </Text>
        <Text
          style={[
            styles.rivalStat,
            { color: isAhead ? COLORS.red : COLORS.green },
          ]}
        >
          Valuation: {fmt(rival.valuation)} {isAhead ? "▲" : "▼"}
        </Text>
      </View>
    </View>
  );
}

export default function MarketScreen() {
  const game = useGameStore((s) => s.game);

  if (!game) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No game in progress</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Market conditions</Text>
      <View style={styles.card}>
        <StatBar label="Demand" value={game.market.demand} />
        <StatBar label="Competition" value={game.market.competition} />
        <StatBar label="Regulation risk" value={game.market.regulation} />
        <View style={styles.growthRow}>
          <Text style={styles.statLabel}>Industry growth</Text>
          <Text style={styles.growthValue}>{game.market.growth}%/yr</Text>
        </View>
      </View>

      <Text style={styles.title}>AI competitors</Text>
      {game.rivals.map((r) => (
        <RivalCard
          key={r.id}
          rival={r}
          playerValuation={game.metrics.valuation}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: 80 },
  empty: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: { color: COLORS.muted, fontSize: 16 },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  statRow: { marginBottom: SPACING.md },
  statLabel: { fontSize: 12, color: COLORS.muted, marginBottom: 4 },
  statBarBg: {
    height: 6,
    backgroundColor: COLORS.elevated,
    borderRadius: RADIUS.full,
    overflow: "hidden",
    marginBottom: 4,
  },
  statBarFill: { height: "100%", borderRadius: RADIUS.full },
  statValue: { fontSize: 11, color: COLORS.hint },
  growthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.sm,
  },
  growthValue: { fontSize: 13, fontWeight: "600", color: COLORS.green },
  rivalCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  rivalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  rivalName: { fontSize: 14, fontWeight: "600", color: COLORS.white },
  archetypeBadge: {
    backgroundColor: COLORS.elevated,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  archetypeText: { fontSize: 10, color: COLORS.cyan, fontWeight: "500" },
  archetypeDesc: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: SPACING.sm,
  },
  rivalStatsRow: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.md },
  rivalStat: { fontSize: 12, color: COLORS.white },
});
