import { create } from "zustand";
import type { AlertColor } from "@mui/material";

interface Toast {
  id: number;
  message: string;
  severity: AlertColor;
}

interface ToastState {
  toasts: Toast[];
  show: (message: string, severity?: AlertColor) => void;
  dismiss: (id: number) => void;
}

let nextId = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  show: (message, severity = "success") => {
    const id = ++nextId;
    set((s) => ({ toasts: [...s.toasts, { id, message, severity }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
