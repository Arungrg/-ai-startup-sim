import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  COLORS,
  SPACING,
  RADIUS,
  FONTS,
  GLASS_CARD,
} from "../../constants/theme";
import { useGameStore } from "../../store/gameStore";
import { processTurn } from "../../engine/turnEngine";
import { resolveEvent } from "../../engine/eventEngine";
import { MotiView } from "moti";
import { playSound } from "../../constants/sounds";
import { haptic } from "../../constants/haptics";

// Format large numbers: 1200 → $1.2K
function fmt(n: number): string {
  if (n >= 1e9) return "$" + (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return "$" + (n / 1e3).toFixed(1) + "K";
  return "$" + Math.round(n);
}

function fmtN(n: number): string {
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return Math.round(n).toString();
}

// Single metric card in the HUD
function MetricCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 350 }}
      style={styles.metricCard}
    >
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, color ? { color } : {}]}>{value}</Text>
    </MotiView>
  );
}

// Mini bar chart from metrics history
function RevenueChart({ history }: { history: any[] }) {
  if (history.length === 0) {
    return (
      <View style={styles.chartEmpty}>
        <Text style={styles.chartEmptyText}>
          Advance turns to see revenue history
        </Text>
      </View>
    );
  }
  const max = Math.max(...history.map((h) => h.revenue), 1);
  return (
    <View style={styles.chart}>
      {history.map((h, i) => (
        <View
          key={i}
          style={[
            styles.chartBar,
            { height: Math.max(4, (h.revenue / max) * 64) },
          ]}
        />
      ))}
    </View>
  );
}

function EventCard({
  game,
  onChoice,
}: {
  game: any;
  onChoice: (choice: any) => void;
}) {
  if (!game.activeEvent) return null;
  const event = game.activeEvent;

  const categoryColors: Record<string, string> = {
    VIRAL: COLORS.green,
    CRISIS: COLORS.red,
    MARKET: COLORS.amber,
    COMPETITION: COLORS.purple,
    INTERNAL: COLORS.cyan,
  };
  const color = categoryColors[event.category] || COLORS.cyan;

  return (
    <View
      style={[styles.card, { borderColor: color, marginBottom: SPACING.md }]}
    >
      <Text style={[styles.cardTitle, { color }]}>{event.title}</Text>
      <Text style={styles.eventDesc}>{event.description}</Text>
      {event.choices.map((choice: any, i: number) => (
        <TouchableOpacity
          key={i}
          style={styles.choiceBtn}
          onPress={() => onChoice(choice)}
        >
          <Text style={styles.choiceBtnText}>{choice.text}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function DashboardScreen({ navigation }: any) {
  const game = useGameStore((s) => s.game);
  const setGame = useGameStore((s) => s.setGame);

  if (!game) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No game in progress</Text>
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => navigation.navigate("Create")}
        >
          <Text style={styles.startBtnText}>Start a game</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { metrics, startupName, turn, isGameOver, isWin, gameOverReason } =
    game;
  const runwayColor =
    metrics.runway > 12
      ? COLORS.green
      : metrics.runway > 6
        ? COLORS.amber
        : COLORS.red;

  function handleNextTurn() {
    if (!game || isGameOver) return;
    haptic.action();
    playSound("click"); // ← add this
    const newState = processTurn(game);
    setGame(newState);
    if (newState.isGameOver) {
      if (newState.isWin) {
        haptic.success();
        playSound("success");
      } else {
        haptic.error();
        playSound("notification");
      }
      navigation.navigate(newState.isWin ? "Win" : "Fail");
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.companyName}>{startupName}</Text>
          <Text style={styles.weekLabel}>Week {turn}</Text>
        </View>
        <TouchableOpacity
          style={styles.fundingBtn}
          onPress={() => navigation.navigate("Funding")}
        >
          <Text style={styles.fundingBtnText}>
            💰 Funding — Round {game.fundingRound + 1}/5
          </Text>
        </TouchableOpacity>
        <MotiView
          animate={{ scale: 1 }}
          transition={{ type: "timing", duration: 100 }}
        >
          <TouchableOpacity
            style={[styles.nextBtn, isGameOver && styles.nextBtnDisabled]}
            onPress={handleNextTurn}
            disabled={isGameOver}
            activeOpacity={0.7}
          >
            <Text style={styles.nextBtnText}>Next week ↗</Text>
          </TouchableOpacity>
        </MotiView>
      </View>

      <EventCard
        game={game}
        onChoice={(choice) => {
          const newState = resolveEvent(game, choice);
          setGame(newState);
        }}
      />

      {/* HUD — 6 metric cards */}
      <View style={styles.hud}>
        <MetricCard
          label="Cash"
          value={fmt(metrics.cash)}
          color={
            metrics.cash > metrics.burnRate * 12
              ? COLORS.green
              : metrics.cash < metrics.burnRate * 4
                ? COLORS.red
                : COLORS.amber
          }
        />
        <MetricCard label="MRR" value={fmt(metrics.mrr)} color={COLORS.green} />
        <MetricCard label="Users" value={fmtN(metrics.users)} />
        <MetricCard
          label="Burn/wk"
          value={fmt(metrics.burnRate)}
          color={COLORS.red}
        />
        <MetricCard
          label="Runway"
          value={metrics.runway > 99 ? "∞ wks" : metrics.runway + " wks"}
          color={runwayColor}
        />
        <MetricCard
          label="Valuation"
          value={fmt(metrics.valuation)}
          color={COLORS.purple}
        />
      </View>

      {/* Revenue chart */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Revenue history</Text>
        <RevenueChart history={game.metricsHistory || []} />
      </View>

      {/* Key stats */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Key metrics</Text>
        {[
          ["Product quality", metrics.productQuality + "/100"],
          ["Team morale", metrics.teamMorale + "/100"],
          ["Reputation", Math.round(metrics.reputation) + "/100"],
          ["Investor confidence", metrics.investorConfidence + "/100"],
          ["Market share", (metrics.marketShare * 100).toFixed(2) + "%"],
          ["Churn rate", (metrics.churnRate * 100).toFixed(1) + "%/wk"],
        ].map(([label, value]) => (
          <View key={label} style={styles.statRow}>
            <Text style={styles.statLabel}>{label}</Text>
            <Text style={styles.statValue}>{value}</Text>
          </View>
        ))}
      </View>
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
  emptyText: { color: COLORS.muted, fontSize: 16, marginBottom: SPACING.lg },
  startBtn: {
    backgroundColor: COLORS.purple,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  startBtnText: { color: COLORS.white, fontWeight: "600" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  companyName: { fontSize: 18, fontWeight: "700", color: COLORS.white },
  weekLabel: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  nextBtn: {
    backgroundColor: COLORS.purple,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  nextBtnDisabled: { opacity: 0.4 },
  nextBtnText: { color: COLORS.white, fontWeight: "600", fontSize: 14 },
  hud: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  metricCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    width: "31%",
    borderWidth: 0.5,
    borderColor: COLORS.border,
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  metricLabel: { fontSize: 11, color: COLORS.muted, marginBottom: 2 },
  metricValue: { fontSize: 15, fontWeight: "500", color: COLORS.white },
  card: {
    ...GLASS_CARD,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: 13,
    color: COLORS.muted,
    marginBottom: SPACING.md,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  chart: { flexDirection: "row", alignItems: "flex-end", gap: 3, height: 72 },
  chartBar: {
    flex: 1,
    backgroundColor: COLORS.cyan,
    borderRadius: 2,
    opacity: 0.8,
  },
  chartEmpty: { height: 72, alignItems: "center", justifyContent: "center" },
  chartEmptyText: { color: COLORS.hint, fontSize: 12 },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  statLabel: { fontSize: 13, color: COLORS.muted },
  statValue: { fontSize: 13, fontWeight: "500", color: COLORS.white },
  eventDesc: {
    fontSize: 13,
    color: COLORS.muted,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  choiceBtn: {
    backgroundColor: COLORS.elevated,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  choiceBtnText: { fontSize: 13, color: COLORS.white },
  fundingBtn: {
    backgroundColor: COLORS.elevated,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    alignItems: "center",
    marginBottom: SPACING.md,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  fundingBtnText: { color: COLORS.white, fontSize: 13, fontWeight: "500" },
});
