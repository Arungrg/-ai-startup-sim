import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { COLORS, SPACING, RADIUS } from "../../constants/theme";
import { useGameStore } from "../../store/gameStore";
import { hireEmployee, fireEmployee } from "../../engine/employeeEngine";
import {
  HIRE_POOL,
  ROLE_DESCRIPTIONS,
  HireCandidate,
} from "../../constants/employees";
import { Employee } from "../../types/game";

function fmt(n: number): string {
  if (n >= 1e3) return "$" + (n / 1e3).toFixed(1) + "K";
  return "$" + Math.round(n);
}

function moraleColor(morale: number): string {
  if (morale >= 70) return COLORS.green;
  if (morale >= 40) return COLORS.amber;
  return COLORS.red;
}

function EmployeeCard({
  employee,
  onFire,
}: {
  employee: Employee;
  onFire: () => void;
}) {
  return (
    <View style={styles.empCard}>
      <View style={styles.empRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.empName}>{employee.name}</Text>
          <Text style={styles.empMeta}>
            {employee.role.replace("_", " ")} · {employee.level} ·{" "}
            {fmt(employee.salary)}/wk
          </Text>
          <View style={styles.moraleBarBg}>
            <View
              style={[
                styles.moraleBarFill,
                {
                  width: `${employee.morale}%` as any,
                  backgroundColor: moraleColor(employee.morale),
                },
              ]}
            />
          </View>
          <Text
            style={[
              styles.moraleLabel,
              { color: moraleColor(employee.morale) },
            ]}
          >
            Morale: {Math.round(employee.morale)}/100
          </Text>
        </View>
        <TouchableOpacity style={styles.fireBtn} onPress={onFire}>
          <Text style={styles.fireBtnText}>Fire</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function CandidateCard({
  candidate,
  onHire,
}: {
  candidate: HireCandidate;
  onHire: () => void;
}) {
  return (
    <View style={styles.empCard}>
      <View style={styles.empRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.empName}>{candidate.name}</Text>
          <Text style={styles.empMeta}>
            {candidate.role.replace("_", " ")} · {candidate.level} ·{" "}
            {fmt(candidate.salary)}/wk
          </Text>
          <Text style={styles.roleDesc}>
            {ROLE_DESCRIPTIONS[candidate.role]}
          </Text>
          <Text style={styles.skillLabel}>
            Skill: {candidate.skillScore}/100
          </Text>
        </View>
        <TouchableOpacity style={styles.hireBtn} onPress={onHire}>
          <Text style={styles.hireBtnText}>Hire</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function TeamScreen() {
  const game = useGameStore((s) => s.game);
  const setGame = useGameStore((s) => s.setGame);

  if (!game) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No game in progress</Text>
      </View>
    );
  }

  function handleHire(candidate: HireCandidate) {
    if (!game) return;
    const confirmed = window.confirm(
      `Hire ${candidate.name} for ${fmt(candidate.salary)}/week?`,
    );
    if (confirmed) {
      setGame(hireEmployee(game, candidate));
    }
  }

  function handleFire(employeeId: string, name: string) {
    if (!game) return;
    const confirmed = window.confirm(
      `Fire ${name}? This will hurt team morale.`,
    );
    if (confirmed) {
      setGame(fireEmployee(game, employeeId));
    }
  }

  const hiredIds = new Set(game.employees.map((e) => e.id));
  const availableCandidates = HIRE_POOL.filter((c) => !hiredIds.has(c.id));
  const totalSalaries = game.employees.reduce((sum, e) => sum + e.salary, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Your team</Text>
      <Text style={styles.subtitle}>
        {game.employees.length} employees · {fmt(totalSalaries)}/wk total salary
        · Team morale: {Math.round(game.metrics.teamMorale)}/100
      </Text>

      {game.employees.length === 0 ? (
        <View style={styles.noEmp}>
          <Text style={styles.noEmpText}>
            No employees yet — hire from below to start building features faster
          </Text>
        </View>
      ) : (
        game.employees.map((e) => (
          <EmployeeCard
            key={e.id}
            employee={e}
            onFire={() => handleFire(e.id, e.name)}
          />
        ))
      )}

      <Text style={styles.sectionLabel}>Available candidates</Text>
      {availableCandidates.map((c) => (
        <CandidateCard key={c.id} candidate={c} onHire={() => handleHire(c)} />
      ))}
      {availableCandidates.length === 0 && (
        <Text style={styles.noEmpText}>You've hired everyone in the pool!</Text>
      )}
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
  subtitle: { fontSize: 13, color: COLORS.muted, marginBottom: SPACING.lg },
  noEmp: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  noEmpText: { color: COLORS.muted, fontSize: 13, textAlign: "center" },
  sectionLabel: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  empCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  empRow: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  empName: { fontSize: 14, fontWeight: "600", color: COLORS.white },
  empMeta: { fontSize: 12, color: COLORS.muted, marginTop: 2, marginBottom: 6 },
  roleDesc: { fontSize: 12, color: COLORS.cyan, marginBottom: 4 },
  skillLabel: { fontSize: 11, color: COLORS.hint },
  moraleBarBg: {
    height: 5,
    backgroundColor: COLORS.elevated,
    borderRadius: RADIUS.full,
    overflow: "hidden",
    marginBottom: 4,
  },
  moraleBarFill: { height: "100%", borderRadius: RADIUS.full },
  moraleLabel: { fontSize: 11 },
  fireBtn: {
    backgroundColor: COLORS.red + "22",
    borderWidth: 0.5,
    borderColor: COLORS.red,
    borderRadius: RADIUS.md,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  fireBtnText: { color: COLORS.red, fontSize: 12, fontWeight: "600" },
  hireBtn: {
    backgroundColor: COLORS.green + "22",
    borderWidth: 0.5,
    borderColor: COLORS.green,
    borderRadius: RADIUS.md,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  hireBtnText: { color: COLORS.green, fontSize: 12, fontWeight: "600" },
});
