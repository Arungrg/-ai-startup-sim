import { GameState, ProductFeature } from '../types/game';
import { clamp } from './economyEngine';

// How fast features progress — based on engineer skill
function calcDevSpeed(state: GameState): number {
  const engineers = state.employees.filter(
    e => e.role === 'ENGINEER' || e.role === 'DATA_SCIENTIST'
  );
  if (engineers.length === 0) return 5; // very slow without engineers
  const totalProductivity = engineers.reduce(
    (sum, e) => sum + (e.skillScore * (e.morale / 100)), 0
  );
  return Math.max(5, totalProductivity / 8);
}

// Unlock features whose prerequisites are all completed
function unlockFeatures(features: ProductFeature[]): ProductFeature[] {
  return features.map(f => {
    if (f.status !== 'LOCKED') return f;
    const allPrereqsDone = f.prerequisiteIds.every(
      pid => features.find(x => x.id === pid)?.status === 'COMPLETED'
    );
    return allPrereqsDone ? { ...f, status: 'AVAILABLE' } : f;
  });
}

// Apply revenue multipliers from all active features
export function calcRevenueMultiplier(features: ProductFeature[]): number {
  return features
    .filter(f => f.active && f.revenueMultiplier > 1)
    .reduce((mult, f) => mult * f.revenueMultiplier, 1.0);
}

// Main function — runs every turn
export function processProducts(state: GameState): GameState {
  const devSpeed = calcDevSpeed(state);
  let updatedMetrics = { ...state.metrics };
  let notifications: string[] = [];

  const updatedFeatures = state.features.map(f => {
    if (f.status !== 'IN_PROGRESS') return f;

    // Advance progress
    const progressPerTurn = (100 / f.weeksToComplete) * (devSpeed / 10);
    const newProgress = Math.min(100, f.progress + progressPerTurn);

    // Feature just completed!
    if (newProgress >= 100) {
      updatedMetrics.productQuality = clamp(
        updatedMetrics.productQuality + f.qualityBonus, 0, 100
      );
      updatedMetrics.churnRate = clamp(
        updatedMetrics.churnRate - f.churnReduction, 0.01, 0.3
      );
      updatedMetrics.users = updatedMetrics.users + f.userBonus;
      notifications.push(`✅ "${f.name}" completed! +${f.qualityBonus} quality`);

      return { ...f, progress: 100, status: 'COMPLETED' as const, active: true };
    }

    return { ...f, progress: newProgress };
  });

  // Unlock any newly available features
  const unlockedFeatures = unlockFeatures(updatedFeatures);

  return {
    ...state,
    features: unlockedFeatures,
    metrics: updatedMetrics,
  };
}

// Start building a feature — called when player taps "Build"
export function startFeature(state: GameState, featureId: string): GameState {
  const inProgress = state.features.filter(f => f.status === 'IN_PROGRESS').length;
  if (inProgress >= 2) return state; // max 2 at once

  const updatedFeatures = state.features.map(f =>
    f.id === featureId && f.status === 'AVAILABLE'
      ? { ...f, status: 'IN_PROGRESS' as const }
      : f
  );
  return { ...state, features: updatedFeatures };
}