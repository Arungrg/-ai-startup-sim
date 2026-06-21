import { GameState } from '../types/game';
import { clamp } from './utils';

// Random walk — small random change each turn, trending back to a baseline
function drift(value: number, baseline: number, volatility: number): number {
  const pullToBaseline = (baseline - value) * 0.05;
  const randomChange = (Math.random() - 0.5) * volatility;
  return clamp(value + pullToBaseline + randomChange, 10, 100);
}

export function processMarket(state: GameState): GameState {
  const { demand, competition, regulation } = state.market;

  return {
    ...state,
    market: {
      ...state.market,
      demand: drift(demand, 65, 8),
      competition: drift(competition, 55, 6),
      regulation: drift(regulation, 25, 4),
    },
  };
}