import { GameState } from '../types/game';
import { getRoleProductivity } from './employeeEngine';


// Helper — keeps a number between min and max
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// Revenue = Users × ConversionRate × Price × QualityModifier
export function calcRevenue(state: GameState): number {
  const { users, productQuality } = state.metrics;
  const salesBoost = getRoleProductivity(state.employees, 'SALES');

  const baseConversionRate = 0.05;
  const conversionRate = baseConversionRate + (salesBoost / 10000); // small bonus
  const price = 29;
  const qualityModifier = 0.5 + (productQuality / 100);

  const featureMultiplier = state.features
    .filter(f => f.active && f.revenueMultiplier > 1)
    .reduce((mult, f) => mult * f.revenueMultiplier, 1.0);

  return Math.round(users * conversionRate * price * qualityModifier * featureMultiplier);
}
// BurnRate = Salaries + Infrastructure + Marketing
export function calcBurnRate(state: GameState): number {
  const salaries = state.employees.reduce((sum, e) => sum + e.salary, 0);
  const infrastructure = Math.max(500, state.metrics.users * 0.1);
  const marketing = 500; // base marketing cost
  return Math.round(salaries + infrastructure + marketing);
}

// Runway = Cash / BurnRate (in weeks)
export function calcRunway(cash: number, burnRate: number): number {
  if (burnRate <= 0) return 999;
  return Math.round(cash / burnRate);
}

// Valuation = Revenue × GrowthMultiplier × ReputationMultiplier
export function calcValuation(state: GameState): number {
  const { revenue, reputation, investorConfidence, users } = state.metrics;
  const growthMultiplier = Math.max(1, Math.min(10, (users / 100) * 0.5 + 2));
  const reputationMultiplier = 0.5 + (reputation / 100) * 1.5;
  const confidenceBonus = 1 + (investorConfidence / 100);
  return Math.round(revenue * 52 * growthMultiplier * reputationMultiplier * confidenceBonus);
}

// Main function — runs every turn
export function processEconomy(state: GameState): GameState {
  const revenue = calcRevenue(state);
  const burnRate = calcBurnRate(state);
  const newCash = state.metrics.cash + revenue - burnRate;
  const runway = calcRunway(newCash, burnRate);
  const mrr = Math.round(revenue * 4.33);
  const valuation = calcValuation({ ...state, metrics: { ...state.metrics, revenue } });

  // Check bankruptcy
  const isGameOver = newCash <= 0;

  return {
    ...state,
    metrics: {
      ...state.metrics,
      cash: newCash,
      revenue,
      burnRate,
      runway,
      mrr,
      valuation,
    },
    isGameOver,
    gameOverReason: isGameOver ? 'BANKRUPTCY' : state.gameOverReason,
  };
}