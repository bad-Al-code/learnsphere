import { create } from 'zustand';

import { User } from '@/types/user';

type SessionState = {
  user: User;
  setUser: (user: User) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
