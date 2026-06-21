import { Employee } from '../types/game';

export interface HireCandidate {
  id: string;
  name: string;
  role: Employee['role'];
  level: Employee['level'];
  skillScore: number;
  salary: number;
}

export const HIRE_POOL: HireCandidate[] = [
  { id: 'e1', name: 'Priya Sharma',   role: 'ENGINEER',       level: 'JUNIOR', skillScore: 65, salary: 3500 },
  { id: 'e2', name: 'Marcus Chen',    role: 'ENGINEER',       level: 'MID',    skillScore: 78, salary: 5500 },
  { id: 'e3', name: 'Sofia Torres',   role: 'DESIGNER',       level: 'JUNIOR', skillScore: 60, salary: 3000 },
  { id: 'e4', name: 'James Okonkwo',  role: 'MARKETER',       level: 'MID',    skillScore: 72, salary: 4500 },
  { id: 'e5', name: 'Anya Patel',     role: 'ENGINEER',       level: 'SENIOR', skillScore: 90, salary: 8000 },
  { id: 'e6', name: 'Leo Nakamura',   role: 'SALES',          level: 'MID',    skillScore: 75, salary: 4000 },
  { id: 'e7', name: 'Zara Ali',       role: 'DATA_SCIENTIST', level: 'MID',    skillScore: 80, salary: 6000 },
  { id: 'e8', name: 'Tom Erikson',    role: 'DESIGNER',       level: 'SENIOR', skillScore: 88, salary: 7000 },
];

// What each role does — shown in the UI as a tooltip/description
export const ROLE_DESCRIPTIONS: Record<Employee['role'], string> = {
  ENGINEER: 'Speeds up feature development',
  DESIGNER: 'Boosts product quality and reputation',
  MARKETER: 'Increases user acquisition',
  SALES: 'Boosts revenue and conversion rate',
  DATA_SCIENTIST: 'Boosts innovation and feature speed',
};