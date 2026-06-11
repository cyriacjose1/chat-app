import { create } from "zustand";

type PresenceState = {
  onlineUsers: string[];

  setOnlineUsers: (
    users: string[]
  ) => void;
};

export const usePresenceStore =
  create<PresenceState>((set) => ({
    onlineUsers: [],

    setOnlineUsers: (
      users
    ) =>
      set({
        onlineUsers: users,
      }),
  }));