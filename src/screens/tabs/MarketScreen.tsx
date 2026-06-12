import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../constants/theme";

export default function MarketScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Market</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { color: COLORS.white, fontSize: 20 },
});
