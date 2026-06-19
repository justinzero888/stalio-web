"use client";

import { create } from "zustand";

interface ToastState {
  message: string | null;
  seq: number;
  show: (message: string) => void;
  clear: () => void;
}

export const useToast = create<ToastState>((set) => ({
  message: null,
  seq: 0,
  show: (message) => set((s) => ({ message, seq: s.seq + 1 })),
  clear: () => set({ message: null }),
}));
