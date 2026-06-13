import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, SPACING, RADIUS } from "../../constants/theme";
import { useGameStore } from "../../store/gameStore";

export default function MenuScreen({ navigation }: any) {
  const game = useGameStore((s) => s.game);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Startup{"\n"}Simulator</Text>
      <Text style={styles.subtitle}>Build. Grow. Exit.</Text>

      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() => navigation.navigate("Create")}
      >
        <Text style={styles.primaryText}>New Game ↗</Text>
      </TouchableOpacity>

      {game && !game.isGameOver && (
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate("Game")}
        >
          <Text style={styles.secondaryText}>
            Continue — {game.startupName} (Week {game.turn})
          </Text>
        </TouchableOpacity>
      )}

      <Text style={styles.footer}>BCA Final Year Project · Arun Gurung</Text>
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
  title: {
    fontSize: 42,
    fontWeight: "700",
    color: COLORS.white,
    textAlign: "center",
    lineHeight: 48,
    marginBottom: SPACING.sm,
  },
  subtitle: { fontSize: 16, color: COLORS.muted, marginBottom: SPACING.xxl },
  primaryBtn: {
    backgroundColor: COLORS.purple,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxl,
    width: "100%",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  primaryText: { color: COLORS.white, fontSize: 16, fontWeight: "600" },
  secondaryBtn: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    width: "100%",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  secondaryText: { color: COLORS.muted, fontSize: 14 },
  footer: {
    position: "absolute",
    bottom: 32,
    fontSize: 12,
    color: COLORS.hint,
  },
});
