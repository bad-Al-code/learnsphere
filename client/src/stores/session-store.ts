import { create } from "zustand";

type User = {
  userId: string;
  firstName: string | null;
  lastName: string | null;
} | null;

type SessionState = {
  user: User;
  setUser: (user: User) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
