import { GameState, Rival } from '../types/game';
import { clamp } from './utils';

// Each archetype's priority-ordered rules
function decideAction(rival: Rival, playerQuality: number, marketGrowth: number): Partial<Rival> {
  const runway = rival.cash / 5000; // rough estimate of weeks left

  if (rival.archetype === 'AGGRESSIVE') {
    if (runway < 6) {
      return { cash: rival.cash + 80000 }; // raises emergency funding
    }
    return { users: Math.round(rival.users * 1.06) }; // aggressive growth push
  }

  if (rival.archetype === 'CONSERVATIVE') {
    if (rival.cash < 50000) {
      return { cash: rival.cash + 10000 }; // cuts costs, saves cash
    }
    return { productQuality: clamp(rival.productQuality + 1, 0, 100) };
  }

  if (rival.archetype === 'INNOVATIVE') {
    if (rival.productQuality < playerQuality - 15) {
      return { productQuality: clamp(rival.productQuality + 5, 0, 100) }; // catches up fast
    }
    return { productQuality: clamp(rival.productQuality + 1.5, 0, 100) };
  }

  // MARKETING_HEAVY
  if (rival.users < playerQuality * 5) {
    return { users: Math.round(rival.users * 1.08) }; // viral campaign
  }
  return { users: Math.round(rival.users * 1.03) };
}

// Main function — runs every turn for each rival
export function processRivals(state: GameState): GameState {
  const updatedRivals = state.rivals.map(rival => {
    const action = decideAction(rival, state.metrics.productQuality, state.market.growth);

    // Apply natural market drift on top of the decision
    const marketDrift = 1 + (state.market.growth / 300) + (Math.random() * 0.04 - 0.02);

    const updated: Rival = {
      ...rival,
      ...action,
      users: Math.round((action.users ?? rival.users) * marketDrift),
    };

    // Recalculate valuation
    updated.valuation = Math.round(updated.users * updated.productQuality * 20);

    return updated;
  });

  return { ...state, rivals: updatedRivals };
}