// store.ts
import { create } from 'zustand';

type UserState = {
  user: { id: string; name: string } | null;
  setUser: (u: { id: string; name: string } | null) => void;
};
type ChatState = {
  chat: { id: string } | null;
  setChat: (u: { id: string; } | null) => void;
};

export const useUserProfile = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
export const useCurrentChat = create<ChatState>((set) => ({
  chat: null,
  setChat: (chat) => set({ chat }),
}));
