import { create } from 'zustand';
import { GameState } from '../types/game';

interface GameStore {
  game: GameState | null;
  setGame: (game: GameState) => void;
  updateGame: (partial: Partial<GameState>) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  game: null,

  setGame: (game) => set({ game }),

  updateGame: (partial) =>
    set((state) => ({
      game: state.game
        ? { ...state.game, ...partial }
        : null,
    })),

  resetGame: () => set({ game: null }),
}));