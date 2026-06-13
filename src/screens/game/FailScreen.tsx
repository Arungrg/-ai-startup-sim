import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, SPACING, RADIUS } from "../../constants/theme";
import { useGameStore } from "../../store/gameStore";

const REASONS: Record<string, string> = {
  BANKRUPTCY: "You ran out of cash. The startup is dead.",
  TEAM_COLLAPSE: "Your team burned out and resigned.",
};

export default function FailScreen({ navigation }: any) {
  const { game, resetGame } = useGameStore();
  const reason = REASONS[game?.gameOverReason ?? ""] ?? "Your startup failed.";
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>💀</Text>
      <Text style={styles.title}>Game over</Text>
      <Text style={styles.sub}>{reason}</Text>
      <Text style={styles.stats}>
        {game?.startupName} · Week {game?.turn} · Valuation: $
        {((game?.metrics.valuation ?? 0) / 1e3).toFixed(0)}K
      </Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          resetGame();
          navigation.replace("Menu");
        }}
      >
        <Text style={styles.btnText}>Try again</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xl,
  },
  icon: { fontSize: 64, marginBottom: SPACING.lg },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.red,
    marginBottom: SPACING.sm,
  },
  sub: {
    fontSize: 15,
    color: COLORS.muted,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  stats: { fontSize: 13, color: COLORS.hint, marginBottom: SPACING.xxl },
  btn: {
    backgroundColor: COLORS.red,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    paddingHorizontal: SPACING.xxl,
  },
  btnText: { color: COLORS.white, fontWeight: "600", fontSize: 16 },
});
