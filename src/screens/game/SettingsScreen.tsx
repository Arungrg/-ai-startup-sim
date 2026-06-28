import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch, StyleSheet } from "react-native";
import { COLORS, SPACING, RADIUS, FONTS } from "../../constants/theme";
import { setSoundEnabled } from "../../constants/sounds";

export default function SettingsScreen({ navigation }: any) {
  const [soundOn, setSoundOn] = useState(true);

  function toggleSound(value: boolean) {
    setSoundOn(value);
    setSoundEnabled(value);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backBtn}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Settings</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Sound effects</Text>
        <Switch
          value={soundOn}
          onValueChange={toggleSound}
          trackColor={{ false: COLORS.border, true: COLORS.purple }}
          thumbColor={COLORS.white}
        />
      </View>

      <Text style={styles.footer}>
        AI Startup Simulator v1.0{"\n"}BCA Final Year Project
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  backBtn: { color: COLORS.muted, fontSize: 14, marginBottom: SPACING.md },
  title: {
    fontSize: 22,
    fontFamily: FONTS.heading,
    color: COLORS.white,
    marginBottom: SPACING.xl,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  label: { fontSize: 14, color: COLORS.white },
  footer: {
    position: "absolute",
    bottom: 32,
    left: SPACING.lg,
    fontSize: 12,
    color: COLORS.hint,
    textAlign: "center",
  },
});
