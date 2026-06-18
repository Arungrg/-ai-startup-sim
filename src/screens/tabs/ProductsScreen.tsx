import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { COLORS, SPACING, RADIUS } from "../../constants/theme";
import { useGameStore } from "../../store/gameStore";
import { startFeature } from "../../engine/productEngine";
import { ProductFeature } from "../../types/game";

// Status badge color
function statusColor(status: string): string {
  if (status === "COMPLETED") return COLORS.green;
  if (status === "IN_PROGRESS") return COLORS.amber;
  if (status === "AVAILABLE") return COLORS.cyan;
  return COLORS.hint;
}

function statusLabel(status: string): string {
  if (status === "COMPLETED") return "Done ✓";
  if (status === "IN_PROGRESS") return "Building...";
  if (status === "AVAILABLE") return "Available";
  return "Locked 🔒";
}

function FeatureCard({
  feature,
  onBuild,
  inProgressCount,
}: {
  feature: ProductFeature;
  onBuild: () => void;
  inProgressCount: number;
}) {
  const canBuild = feature.status === "AVAILABLE" && inProgressCount < 2;
  const progress = Math.round(feature.progress);

  return (
    <View style={styles.featureCard}>
      {/* Header row */}
      <View style={styles.featureHeader}>
        <View style={styles.featureTitleRow}>
          <Text style={styles.featureName}>{feature.name}</Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: statusColor(feature.status) + "22",
                borderColor: statusColor(feature.status),
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: statusColor(feature.status) },
              ]}
            >
              {statusLabel(feature.status)}
            </Text>
          </View>
        </View>
        <Text style={styles.featureDesc}>{feature.description}</Text>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <Text style={styles.statChip}>Tier {feature.tier}</Text>
        <Text style={styles.statChip}>{feature.weeksToComplete} wks</Text>
        {feature.qualityBonus > 0 && (
          <Text style={styles.statChip}>+{feature.qualityBonus} quality</Text>
        )}
        {feature.revenueMultiplier > 1 && (
          <Text style={styles.statChip}>
            {feature.revenueMultiplier}x revenue
          </Text>
        )}
        {feature.churnReduction > 0 && (
          <Text style={styles.statChip}>
            -{feature.churnReduction * 100}% churn
          </Text>
        )}
        {feature.userBonus > 0 && (
          <Text style={styles.statChip}>+{feature.userBonus} users</Text>
        )}
      </View>

      {/* Progress bar — only when in progress */}
      {feature.status === "IN_PROGRESS" && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBg}>
            <View
              style={[styles.progressFill, { width: `${progress}%` as any }]}
            />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>
      )}

      {/* Build button */}
      {canBuild && (
        <TouchableOpacity style={styles.buildBtn} onPress={onBuild}>
          <Text style={styles.buildBtnText}>Build this feature ↗</Text>
        </TouchableOpacity>
      )}

      {/* Max in progress warning */}
      {feature.status === "AVAILABLE" && inProgressCount >= 2 && (
        <Text style={styles.maxWarning}>
          Max 2 features in progress at once
        </Text>
      )}
    </View>
  );
}

export default function ProductsScreen() {
  const game = useGameStore((s) => s.game);
  const setGame = useGameStore((s) => s.setGame);

  if (!game) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No game in progress</Text>
      </View>
    );
  }

  const inProgressCount = game.features.filter(
    (f) => f.status === "IN_PROGRESS",
  ).length;

  function handleBuild(featureId: string) {
    if (!game) return;
    const feature = game.features.find((f) => f.id === featureId);
    if (!feature) return;
    // works in both browser and phone
    const confirmed = window.confirm(
      `Start building "${feature.name}"?\nTakes ${feature.weeksToComplete} weeks.`,
    );
    if (confirmed) {
      const newState = startFeature(game, featureId);
      setGame(newState);
    }
  }

  // Group features by tier
  const tier1 = game.features.filter((f) => f.tier === 1);
  const tier2 = game.features.filter((f) => f.tier === 2);
  const tier3 = game.features.filter((f) => f.tier === 3);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Product development</Text>
      <Text style={styles.subtitle}>
        {inProgressCount}/2 features in progress · Quality:{" "}
        {Math.round(game.metrics.productQuality)}/100
      </Text>

      {/* Overall product quality bar */}
      <View style={styles.qualityBar}>
        <View
          style={[
            styles.qualityFill,
            { width: `${game.metrics.productQuality}%` as any },
            ,
          ]}
        />
      </View>

      {[
        { label: "Tier 1 — Foundation", features: tier1 },
        { label: "Tier 2 — Growth", features: tier2 },
        { label: "Tier 3 — Advanced", features: tier3 },
      ].map((group) => (
        <View key={group.label}>
          <Text style={styles.tierLabel}>{group.label}</Text>
          {group.features.map((f) => (
            <FeatureCard
              key={f.id}
              feature={f}
              inProgressCount={inProgressCount}
              onBuild={() => handleBuild(f.id)}
            />
          ))}
        </View>
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
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 4,
  },
  subtitle: { fontSize: 13, color: COLORS.muted, marginBottom: SPACING.sm },
  qualityBar: {
    height: 6,
    backgroundColor: COLORS.elevated,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.lg,
    overflow: "hidden",
  },
  qualityFill: {
    height: "100%",
    backgroundColor: COLORS.purple,
    borderRadius: RADIUS.full,
  },
  tierLabel: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  featureCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  featureHeader: { marginBottom: SPACING.sm },
  featureTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  featureName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.white,
    flex: 1,
  },
  featureDesc: { fontSize: 12, color: COLORS.muted, lineHeight: 18 },
  statusBadge: {
    borderWidth: 0.5,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  statusText: { fontSize: 11, fontWeight: "500" },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: SPACING.sm,
  },
  statChip: {
    fontSize: 11,
    color: COLORS.muted,
    backgroundColor: COLORS.elevated,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  progressBg: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.elevated,
    borderRadius: RADIUS.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.amber,
    borderRadius: RADIUS.full,
  },
  progressText: { fontSize: 12, color: COLORS.amber, minWidth: 32 },
  buildBtn: {
    backgroundColor: COLORS.purple,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    alignItems: "center",
  },
  buildBtnText: { color: COLORS.white, fontSize: 13, fontWeight: "600" },
  maxWarning: {
    fontSize: 12,
    color: COLORS.amber,
    textAlign: "center",
    marginTop: 4,
  },
});
