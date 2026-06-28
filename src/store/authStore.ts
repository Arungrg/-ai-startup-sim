import { create } from 'zustand';
import { api } from '../constants/api';

interface User { id: string; email: string; username: string; }

interface AuthStore {
  user: User | null;
  token: string | null;
  isGuest: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isGuest: false,

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    set({ user: res.data.user, token: res.data.accessToken, isGuest: false });
  },

  register: async (email, username, password) => {
    const res = await api.post('/auth/register', { email, username, password });
    set({ user: res.data.user, token: res.data.accessToken, isGuest: false });
  },

  loginAsGuest: () => {
    set({ user: { id: 'guest', email: '', username: 'Guest' }, token: null, isGuest: true });
  },

  logout: () => set({ user: null, token: null, isGuest: false }),
}));