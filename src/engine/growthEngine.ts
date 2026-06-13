import { GameState } from '../types/game';
import { clamp } from './economyEngine';

export function processGrowth(state: GameState): GameState {
  const { users, productQuality, churnRate, marketShare } = state.metrics;

  // Marketers boost acquisition
  const marketerBoost = state.employees
    .filter(e => e.role === 'MARKETER')
    .reduce((sum, e) => sum + (e.skillScore * (e.morale / 100)), 0);

  // New users this turn
  const baseAcquisition = (productQuality * 0.4) + (marketerBoost * 0.3) + 20;
  const newUsers = Math.round(baseAcquisition);

  // Users lost to churn
  const churnedUsers = Math.round(users * churnRate);

  // Net users
  const updatedUsers = Math.max(0, users + newUsers - churnedUsers);

  // Market share (out of 100,000 total addressable users)
  const updatedMarketShare = clamp(updatedUsers / 100000, 0, 1);

  return {
    ...state,
    metrics: {
      ...state.metrics,
      users: updatedUsers,
      marketShare: updatedMarketShare,
    },
  };
}