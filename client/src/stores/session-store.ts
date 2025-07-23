import { create } from "zustand";

type User = {
  userId: string;
  firstName: string | null;
  lastName: string | null;
};

type SessionState = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
