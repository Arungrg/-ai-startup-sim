import { GameState, GameEvent, EventChoice } from '../types/game';
import { EVENT_POOL } from '../constants/events';
import { clamp } from './utils';

const EVENT_CHANCE = 0.35; // 35% chance per turn after week 2

// Pick a random event using weighted probability
function pickWeightedEvent(pool: GameEvent[]): GameEvent {
  const totalWeight = pool.reduce((sum, e) => sum + e.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const event of pool) {
    roll -= event.weight;
    if (roll <= 0) return event;
  }
  return pool[0];
}

// Main function — runs every turn, may trigger a new event
export function processEvents(state: GameState): GameState {
  // Don't trigger a new event if one is already active
  if (state.activeEvent) return state;

  // No events in the first 2 turns — let player get oriented
  if (state.turn < 2) return state;

  // Random chance check
  if (Math.random() > EVENT_CHANCE) return state;

  // Avoid repeating events already seen (until pool exhausted)
  const unseenEvents = EVENT_POOL.filter(e => !state.eventHistory.includes(e.id));
  const pool = unseenEvents.length > 0 ? unseenEvents : EVENT_POOL;

  const event = pickWeightedEvent(pool);

  return { ...state, activeEvent: event };
}

// Apply the player's chosen response — called when they tap a choice button
export function resolveEvent(state: GameState, choice: EventChoice): GameState {
  if (!state.activeEvent) return state;

  const effect = choice.effect;
  const updatedMetrics = { ...state.metrics };

  // Apply each metric change, clamping 0-100 stats appropriately
  if (effect.cash !== undefined) updatedMetrics.cash += effect.cash;
  if (effect.revenue !== undefined) updatedMetrics.revenue += effect.revenue;
  if (effect.burnRate !== undefined) updatedMetrics.burnRate += effect.burnRate;
  if (effect.users !== undefined) updatedMetrics.users = Math.max(0, updatedMetrics.users + effect.users);
  if (effect.productQuality !== undefined)
    updatedMetrics.productQuality = clamp(updatedMetrics.productQuality + effect.productQuality, 0, 100);
  if (effect.teamMorale !== undefined)
    updatedMetrics.teamMorale = clamp(updatedMetrics.teamMorale + effect.teamMorale, 0, 100);
  if (effect.reputation !== undefined)
    updatedMetrics.reputation = clamp(updatedMetrics.reputation + effect.reputation, 0, 100);
  if (effect.investorConfidence !== undefined)
    updatedMetrics.investorConfidence = clamp(updatedMetrics.investorConfidence + effect.investorConfidence, 0, 100);

  return {
    ...state,
    metrics: updatedMetrics,
    activeEvent: null,
    eventHistory: [...state.eventHistory, state.activeEvent.id],
  };
}