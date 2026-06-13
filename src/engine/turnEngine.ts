import { GameState } from '../types/game';
import { processEconomy } from './economyEngine';
import { processGrowth } from './growthEngine';
import { clamp } from './economyEngine';

// Win condition check
function checkWinCondition(state: GameState): GameState {
  if (state.metrics.valuation >= 500000000) {
    return { ...state, isWin: true, isGameOver: true,
      gameOverReason: 'UNICORN' };
  }
  if (state.fundingRound >= 4) {
    return { ...state, isWin: true, isGameOver: true,
      gameOverReason: 'IPO' };
  }
  return state;
}

// Morale drift — overworked team loses morale slowly
function processMorale(state: GameState): GameState {
  const moraleChange = state.employees.length > 0 ? -1 : 0;
  const newMorale = clamp(state.metrics.teamMorale + moraleChange, 0, 100);

  // Morale collapse = game over
  if (newMorale <= 5) {
    return { ...state,
      metrics: { ...state.metrics, teamMorale: newMorale },
      isGameOver: true, gameOverReason: 'TEAM_COLLAPSE' };
  }

  // Morale also affects each employee
  const updatedEmployees = state.employees.map(e => ({
    ...e,
    morale: clamp(e.morale + (newMorale - e.morale) * 0.1, 10, 100),
  }));

  return {
    ...state,
    metrics: { ...state.metrics, teamMorale: newMorale },
    employees: updatedEmployees,
  };
}

// Reputation drift
function processReputation(state: GameState): GameState {
  const { revenue, burnRate, reputation } = state.metrics;
  const change = revenue > burnRate ? 0.5 : -0.3;
  return {
    ...state,
    metrics: {
      ...state.metrics,
      reputation: clamp(reputation + change, 0, 100),
      investorConfidence: clamp(
        state.metrics.investorConfidence + (revenue > burnRate ? 1 : -1),
        0, 100
      ),
    },
  };
}

// MAIN FUNCTION — call this when player taps "Next Week"
export function processTurn(state: GameState): GameState {
  if (state.isGameOver) return state;

  let s = { ...state, turn: state.turn + 1 };

  // Run all engines in order
  s = processMorale(s);       // 1. Morale
  s = processGrowth(s);       // 2. User growth
  s = processEconomy(s);      // 3. Economy (revenue, burn, cash)
  s = processReputation(s);   // 4. Reputation drift

  // Save snapshot for analytics chart
  s = {
    ...s,
    metricsHistory: [...(s.metricsHistory || []), { ...s.metrics }].slice(-20),
  };

  // Check win/lose
  s = checkWinCondition(s);

  return s;
}