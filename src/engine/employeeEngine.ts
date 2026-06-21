import { GameState, Employee } from '../types/game';
import { HireCandidate } from '../constants/employees';
import { clamp } from './utils';

// Hire a new employee — called when player taps "Hire"
export function hireEmployee(state: GameState, candidate: HireCandidate): GameState {
  const alreadyHired = state.employees.find(e => e.id === candidate.id);
  if (alreadyHired) return state;

  const newEmployee: Employee = {
    id: candidate.id,
    name: candidate.name,
    role: candidate.role,
    level: candidate.level,
    skillScore: candidate.skillScore,
    morale: 80,
    salary: candidate.salary,
    hiredTurn: state.turn,
  };

  return {
    ...state,
    employees: [...state.employees, newEmployee],
  };
}

// Fire an employee — called when player taps "Fire"
export function fireEmployee(state: GameState, employeeId: string): GameState {
  const updatedEmployees = state.employees.filter(e => e.id !== employeeId);
  // Firing someone hurts team morale
  const newMorale = clamp(state.metrics.teamMorale - 10, 0, 100);

  return {
    ...state,
    employees: updatedEmployees,
    metrics: { ...state.metrics, teamMorale: newMorale },
  };
}

// Get total productivity contribution from a specific role
export function getRoleProductivity(employees: Employee[], role: Employee['role']): number {
  return employees
    .filter(e => e.role === role)
    .reduce((sum, e) => sum + (e.skillScore * (e.morale / 100)), 0);
}

// Main function — runs every turn to update employee morale and effects
export function processEmployees(state: GameState): GameState {
  if (state.employees.length === 0) return state;

  // Each employee's morale drifts toward team morale
  const updatedEmployees = state.employees.map(e => ({
    ...e,
    morale: clamp(e.morale + (state.metrics.teamMorale - e.morale) * 0.15, 10, 100),
  }));

  // Marketer boost → applied directly to growth via marketing stat
  const marketerBoost = getRoleProductivity(updatedEmployees, 'MARKETER');
  const salesBoost = getRoleProductivity(updatedEmployees, 'SALES');
  const designerBoost = getRoleProductivity(updatedEmployees, 'DESIGNER');

  // Designers slowly improve reputation
  const reputationBonus = designerBoost > 0 ? 0.2 : 0;

  return {
    ...state,
    employees: updatedEmployees,
    metrics: {
      ...state.metrics,
      reputation: clamp(state.metrics.reputation + reputationBonus, 0, 100),
    },
  };
}