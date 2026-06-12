export type Industry =
  'AI_SAAS' | 'FINTECH' | 'EDTECH' | 'HEALTHTECH';

export type FounderTrait =
  'VISIONARY' | 'GROWTH_HACKER' | 'TECHNICAL_GENIUS' | 'NETWORKER';

export type EmployeeRole =
  'ENGINEER' | 'DESIGNER' | 'MARKETER' | 'SALES' | 'DATA_SCIENTIST';

export type FeatureStatus =
  'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED';

export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  level: 'JUNIOR' | 'MID' | 'SENIOR';
  skillScore: number;
  morale: number;
  salary: number;
  hiredTurn: number;
}

export interface ProductFeature {
  id: string;
  name: string;
  description: string;
  tier: number;
  status: FeatureStatus;
  progress: number;
  qualityBonus: number;
  prerequisiteIds: string[];
}

export interface StartupMetrics {
  cash: number;
  revenue: number;
  burnRate: number;
  users: number;
  churnRate: number;
  productQuality: number;
  teamMorale: number;
  reputation: number;
  valuation: number;
  investorConfidence: number;
  marketShare: number;
  runway: number;
}

export interface GameState {
  startupName: string;
  industry: Industry;
  founderTrait: FounderTrait;
  turn: number;
  metrics: StartupMetrics;
  employees: Employee[];
  features: ProductFeature[];
  fundingRound: number;
  isGameOver: boolean;
  isWin: boolean;
}