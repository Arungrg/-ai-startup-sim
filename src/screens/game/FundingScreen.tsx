import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { COLORS, SPACING, RADIUS } from "../../constants/theme";
import { useGameStore } from "../../store/gameStore";
import {
  calcFundingScore,
  getNextRound,
  canRaiseFunding,
  raiseFunding,
} from "../../engine/fundingEngine";
import { FUNDING_ROUNDS } from "../../constants/funding";

function fmt(n: number): string {
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return "$" + (n / 1e3).toFixed(1) + "K";
  return "$" + Math.round(n);
}

export default function FundingScreen({ navigation }: any) {
  const game = useGameStore((s) => s.game);
  const setGame = useGameStore((s) => s.setGame);

  if (!game) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No game in progress</Text>
      </View>
    );
  }

  const score = calcFundingScore(game);
  const nextRound = getNextRound(game);
  const qualifies = canRaiseFunding(game);

  function handleRaise() {
    if (!game) return;
    const confirmed = window.confirm(
      `Accept ${nextRound?.name} round?\nRaise ${fmt(nextRound!.amount)} for ${(nextRound!.dilution * 100).toFixed(0)}% equity.`,
    );
    if (confirmed) {
      setGame(raiseFunding(game));
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backBtn}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Funding</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Equity remaining</Text>
          <Text style={styles.value}>{Math.round(game.equityRemaining)}%</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Equity given away</Text>
          <Text style={[styles.value, { color: COLORS.amber }]}>
            {Math.round(100 - game.equityRemaining)}%
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Funding score</Text>
          <Text style={styles.value}>{score}</Text>
        </View>
      </View>

      {nextRound ? (
        <View style={[styles.card, qualifies && styles.cardReady]}>
          <Text style={styles.roundName}>{nextRound.name}</Text>
          <Text style={styles.roundDetail}>
            Raise {fmt(nextRound.amount)} for{" "}
            {(nextRound.dilution * 100).toFixed(0)}% equity
          </Text>

          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                {
                  width:
                    `${Math.min(100, (score / nextRound.scoreThreshold) * 100)}%` as any,
                },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>
            {score} / {nextRound.scoreThreshold} score needed
          </Text>

          {qualifies ? (
            <TouchableOpacity style={styles.acceptBtn} onPress={handleRaise}>
              <Text style={styles.acceptBtnText}>Accept funding ↗</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.hint}>
              Grow revenue, reputation, and investor confidence to qualify
            </Text>
          )}
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.hint}>All funding rounds completed! 🎉</Text>
        </View>
      )}

      <Text style={styles.tierLabel}>All funding rounds</Text>
      {FUNDING_ROUNDS.map((r, i) => (
        <View key={r.name} style={styles.roundRow}>
          <Text
            style={[
              styles.roundRowName,
              i < game.fundingRound && { color: COLORS.green },
            ]}
          >
            {i < game.fundingRound ? "✓ " : ""}
            {r.name}
          </Text>
          <Text style={styles.roundRowDetail}>
            {fmt(r.amount)} · {(r.dilution * 100).toFixed(0)}% equity
          </Text>
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
  backBtn: { color: COLORS.muted, fontSize: 14, marginBottom: SPACING.md },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  cardReady: {
    borderColor: COLORS.green,
    backgroundColor: COLORS.green + "11",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  label: { fontSize: 13, color: COLORS.muted },
  value: { fontSize: 14, fontWeight: "600", color: COLORS.white },
  roundName: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 4,
  },
  roundDetail: { fontSize: 13, color: COLORS.muted, marginBottom: SPACING.md },
  progressBg: {
    height: 8,
    backgroundColor: COLORS.elevated,
    borderRadius: RADIUS.full,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.purple,
    borderRadius: RADIUS.full,
  },
  progressLabel: { fontSize: 12, color: COLORS.hint, marginBottom: SPACING.md },
  acceptBtn: {
    backgroundColor: COLORS.green,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: "center",
  },
  acceptBtnText: { color: COLORS.white, fontWeight: "700", fontSize: 15 },
  hint: { fontSize: 12, color: COLORS.muted, textAlign: "center" },
  tierLabel: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
  },
  roundRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  roundRowName: { fontSize: 13, color: COLORS.white },
  roundRowDetail: { fontSize: 12, color: COLORS.muted },
});
