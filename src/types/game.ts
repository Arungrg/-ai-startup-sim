export type Industry =
  'AI_SAAS' | 'FINTECH' | 'EDTECH' | 'HEALTHTECH';

export type FounderTrait =
  'VISIONARY' | 'GROWTH_HACKER' | 'TECHNICAL_GENIUS' | 'NETWORKER';

export type EmployeeRole =
  'ENGINEER' | 'DESIGNER' | 'MARKETER' | 'SALES' | 'DATA_SCIENTIST';

export type FeatureStatus =
  'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED';

export type EventCategory = 'VIRAL' | 'CRISIS' | 'MARKET' | 'COMPETITION' | 'INTERNAL';

export type RivalArchetype = 'AGGRESSIVE' | 'CONSERVATIVE' | 'INNOVATIVE' | 'MARKETING_HEAVY';

export interface EventChoice {
  text: string;
  effect: Partial<StartupMetrics>;  // metrics to ADD (use negative for subtract)
}

export interface GameEvent {
  id: string;
  category: EventCategory;
  title: string;
  description: string;
  choices: EventChoice[];
  weight: number; // higher = more likely to be picked
}


export interface MarketState {
  demand: number;       // 0-100, affects user acquisition
  growth: number;       // % industry growth per year
  competition: number;  // 0-100, higher = harder to grow
  regulation: number;   // 0-100, risk of regulatory events
}

export interface Rival {
  id: string;
  name: string;
  archetype: RivalArchetype;
  users: number;
  cash: number;
  productQuality: number;
  valuation: number;
}

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

export interface FundingRoundInfo {
  name: string;
  amount: number;
  dilution: number;  // 0.0-1.0, fraction of equity given away
  scoreThreshold: number;
}

export interface ProductFeature {
  id: string;
  name: string;
  description: string;
  tier: number;
  status: FeatureStatus;
  progress: number;         // 0–100%
  weeksToComplete: number;  // how many weeks to build
  qualityBonus: number;     // +productQuality when done
  revenueMultiplier: number;// multiplies revenue when active
  churnReduction: number;   // reduces churnRate when done
  userBonus: number;        // instant user boost when done
  prerequisiteIds: string[];// features that must be done first
  active: boolean;          // true when completed and contributing
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
  mrr: number;   // ← add this
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
  metricsHistory: StartupMetrics[];
  gameOverReason?: string;   // ← add this
  activeEvent: GameEvent | null;
  eventHistory: string[];
  market: MarketState;
  rivals: Rival[];
  equityRemaining: number;
}