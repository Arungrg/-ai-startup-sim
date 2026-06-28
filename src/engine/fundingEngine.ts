import { GameState } from '../types/game';
import { FUNDING_ROUNDS } from '../constants/funding';
import { clamp } from './utils';

// FundingScore = (Revenue×0.3) + (GrowthRate×0.3) + (Reputation×0.2) − (MarketRisk×0.2)
export function calcFundingScore(state: GameState): number {
  const { revenue, reputation, investorConfidence } = state.metrics;
  const history = state.metricsHistory;

  // Growth rate from trailing revenue history
  let growthRate = 0;
  if (history.length >= 2) {
    const prev = history[history.length - 2].revenue;
    growthRate = prev > 0 ? ((revenue - prev) / prev) * 100 : 0;
  }

  const marketRisk = state.market.competition + state.market.regulation;

  const score =
    (revenue * 0.003) +
    (growthRate * 0.3) +
    (reputation * 0.2) -
    (marketRisk * 0.1) +
    (investorConfidence * 0.1);

  return Math.round(Math.max(0, score));
}

// Get the next available funding round (or null if all done)
export function getNextRound(state: GameState) {
  return FUNDING_ROUNDS[state.fundingRound] ?? null;
}

// Check if player qualifies for the next round
export function canRaiseFunding(state: GameState): boolean {
  const round = getNextRound(state);
  if (!round) return false;
  return calcFundingScore(state) >= round.scoreThreshold;
}

// Accept the funding offer — called when player taps "Accept funding"
export function raiseFunding(state: GameState): GameState {
  const round = getNextRound(state);
  if (!round) return state;

  const newEquity = clamp(state.equityRemaining * (1 - round.dilution), 0, 100);

  return {
    ...state,
    metrics: {
      ...state.metrics,
      cash: state.metrics.cash + round.amount,
      investorConfidence: clamp(state.metrics.investorConfidence + 15, 0, 100),
    },
    equityRemaining: newEquity,
    fundingRound: state.fundingRound + 1,
  };
}