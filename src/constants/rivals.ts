import { Rival } from '../types/game';

export const INITIAL_RIVALS: Rival[] = [
  {
    id: 'r1', name: 'VelocityAI', archetype: 'AGGRESSIVE',
    users: 200, cash: 150000, productQuality: 55, valuation: 400000,
  },
  {
    id: 'r2', name: 'SteadyStack', archetype: 'CONSERVATIVE',
    users: 120, cash: 300000, productQuality: 60, valuation: 280000,
  },
  {
    id: 'r3', name: 'NovaBuild', archetype: 'INNOVATIVE',
    users: 180, cash: 200000, productQuality: 70, valuation: 350000,
  },
];

export const ARCHETYPE_DESCRIPTIONS: Record<string, string> = {
  AGGRESSIVE: 'Prioritizes rapid expansion, even at financial risk',
  CONSERVATIVE: 'Focuses on runway and minimizing risk',
  INNOVATIVE: 'Invests heavily in product and R&D',
  MARKETING_HEAVY: 'Prioritizes user acquisition and brand visibility',
};