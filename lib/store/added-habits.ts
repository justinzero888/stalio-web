"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AddedHabitsState {
  ids: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  isAdded: (id: string) => boolean;
}

export const useAddedHabits = create<AddedHabitsState>()(
  persist(
    (set, get) => ({
      ids: [],
      add: (id) =>
        set((s) => (s.ids.includes(id) ? s : { ids: [...s.ids, id] })),
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      isAdded: (id) => get().ids.includes(id),
    }),
    { name: "stalio-added-habits" },
  ),
);
