import { create } from "zustand";

type User = {
  userId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrls: { small?: string; medium?: string; large?: string } | null;
  settings?: { language?: string };
} | null;

type SessionState = {
  user: User;
  setUser: (user: User) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
