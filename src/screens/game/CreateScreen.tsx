import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { COLORS, SPACING, RADIUS } from "../../constants/theme";
import { useGameStore } from "../../store/gameStore";
import { GameState, Industry, FounderTrait } from "../../types/game";
import { INITIAL_FEATURES } from "../../constants/features";
import { INITIAL_RIVALS } from "../../constants/rivals";

const INDUSTRIES: { value: Industry; label: string; desc: string }[] = [
  { value: "AI_SAAS", label: "AI SaaS", desc: "High demand, fast growth" },
  {
    value: "FINTECH",
    label: "Fintech",
    desc: "High regulation, strong revenue",
  },
  {
    value: "EDTECH",
    label: "EdTech",
    desc: "Steady growth, lower competition",
  },
  {
    value: "HEALTHTECH",
    label: "HealthTech",
    desc: "Slow growth, high reputation",
  },
];

const TRAITS: { value: FounderTrait; label: string; desc: string }[] = [
  {
    value: "VISIONARY",
    label: "Visionary",
    desc: "+20 Innovation, events go better",
  },
  {
    value: "GROWTH_HACKER",
    label: "Growth Hacker",
    desc: "+500 users, cheaper acquisition",
  },
  {
    value: "TECHNICAL_GENIUS",
    label: "Technical Genius",
    desc: "+20 Product Quality",
  },
  { value: "NETWORKER", label: "Networker", desc: "+20 Investor Confidence" },
];

function createInitialState(
  name: string,
  industry: Industry,
  trait: FounderTrait,
): GameState {
  const bonuses = {
    VISIONARY: { innovationScore: 20, reputation: 10 },
    GROWTH_HACKER: { users: 500 },
    TECHNICAL_GENIUS: { productQuality: 20 },
    NETWORKER: { investorConfidence: 20, reputation: 15 },
  }[trait];

  return {
    startupName: name,
    industry,
    founderTrait: trait,
    turn: 0,
    fundingRound: 0,
    equityRemaining: 100,
    isGameOver: false,
    isWin: false,
    metricsHistory: [],
    employees: [],
    activeEvent: null,
    eventHistory: [],
    features: INITIAL_FEATURES.map((f) => ({ ...f })),
    metrics: {
      cash: 50000,
      revenue: 0,
      burnRate: 500,
      users: trait === "GROWTH_HACKER" ? 500 : 50,
      churnRate: 0.08,
      productQuality: trait === "TECHNICAL_GENIUS" ? 50 : 30,
      teamMorale: 75,
      reputation: bonuses.reputation ?? 25,
      valuation: 100000,
      investorConfidence: bonuses.investorConfidence ?? 30,
      marketShare: 0.001,
      runway: 100,
      mrr: 0,
    },
    market: { demand: 65, growth: 8, competition: 55, regulation: 25 },
    rivals: INITIAL_RIVALS.map((r) => ({ ...r })),
  };
}

export default function CreateScreen({ navigation }: any) {
  const [name, setName] = useState("NexusAI");
  const [industry, setIndustry] = useState<Industry>("AI_SAAS");
  const [trait, setTrait] = useState<FounderTrait>("VISIONARY");
  const setGame = useGameStore((s) => s.setGame);

  function launch() {
    if (!name.trim()) {
      Alert.alert("Enter a startup name");
      return;
    }
    const state = createInitialState(name.trim(), industry, trait);
    setGame(state);
    navigation.replace("Game");
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Found your startup</Text>

      <Text style={styles.label}>Startup name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter name..."
        placeholderTextColor={COLORS.muted}
      />

      <Text style={styles.label}>Industry</Text>
      {INDUSTRIES.map((i) => (
        <TouchableOpacity
          key={i.value}
          style={[styles.option, industry === i.value && styles.optionActive]}
          onPress={() => setIndustry(i.value)}
        >
          <Text style={styles.optionTitle}>{i.label}</Text>
          <Text style={styles.optionDesc}>{i.desc}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Founder trait</Text>
      {TRAITS.map((t) => (
        <TouchableOpacity
          key={t.value}
          style={[styles.option, trait === t.value && styles.optionActive]}
          onPress={() => setTrait(t.value)}
        >
          <Text style={styles.optionTitle}>{t.label}</Text>
          <Text style={styles.optionDesc}>{t.desc}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.launchBtn} onPress={launch}>
        <Text style={styles.launchText}>Launch startup ↗</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: 60 },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.white,
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.card,
    color: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: 15,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  option: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  optionActive: {
    borderColor: COLORS.purple,
    backgroundColor: COLORS.elevated,
  },
  optionTitle: { fontSize: 14, fontWeight: "500", color: COLORS.white },
  optionDesc: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  launchBtn: {
    backgroundColor: COLORS.purple,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    alignItems: "center",
    marginTop: SPACING.xl,
  },
  launchText: { color: COLORS.white, fontSize: 16, fontWeight: "600" },
});
