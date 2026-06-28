import { FundingRoundInfo } from '../types/game';

export const FUNDING_ROUNDS: FundingRoundInfo[] = [
  { name: 'Pre-Seed', amount: 100000,    dilution: 0.08, scoreThreshold: 20 },
  { name: 'Seed',     amount: 1000000,   dilution: 0.15, scoreThreshold: 40 },
  { name: 'Series A', amount: 5000000,   dilution: 0.20, scoreThreshold: 60 },
  { name: 'Series B', amount: 20000000,  dilution: 0.18, scoreThreshold: 75 },
  { name: 'IPO',       amount: 80000000, dilution: 0.25, scoreThreshold: 90 },
];