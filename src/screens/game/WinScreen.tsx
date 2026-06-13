import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, SPACING, RADIUS } from "../../constants/theme";
import { useGameStore } from "../../store/gameStore";

export default function WinScreen({ navigation }: any) {
  const { game, resetGame } = useGameStore();
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🏆</Text>
      <Text style={styles.title}>You won!</Text>
      <Text style={styles.sub}>
        {game?.startupName} reached{" "}
        {game?.gameOverReason === "UNICORN"
          ? "Unicorn status 🦄"
          : "a successful IPO 🚀"}
      </Text>
      <Text style={styles.stats}>
        Week {game?.turn} · Valuation: $
        {((game?.metrics.valuation ?? 0) / 1e6).toFixed(1)}M
      </Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          resetGame();
          navigation.replace("Menu");
        }}
      >
        <Text style={styles.btnText}>Play again</Text>
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
    color: COLORS.green,
    marginBottom: SPACING.sm,
  },
  sub: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  stats: { fontSize: 13, color: COLORS.muted, marginBottom: SPACING.xxl },
  btn: {
    backgroundColor: COLORS.green,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    paddingHorizontal: SPACING.xxl,
  },
  btnText: { color: COLORS.white, fontWeight: "600", fontSize: 16 },
});
