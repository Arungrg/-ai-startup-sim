import { GameState } from '../types/game';
import { clamp } from './economyEngine';
import { getRoleProductivity } from './employeeEngine';

export function processGrowth(state: GameState): GameState {
  const { users, productQuality, churnRate } = state.metrics;

  const marketerBoost = getRoleProductivity(state.employees, 'MARKETER');

  // New users this turn — product quality + marketer effort + base organic growth
  const baseAcquisition = (productQuality * 0.4) + (marketerBoost * 0.5) + 50;
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