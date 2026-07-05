import { create } from "zustand";

type ToastType = "success" | "error" | "info";

type ToastState = {
  message: string;
  type: ToastType;
  isVisible: boolean;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
};

export const useToastStore = create<ToastState>((set) => ({
  message: "",
  type: "info",
  isVisible: false,

  showToast: (message, type = "info") => {
    set({
      message,
      type,
      isVisible: true,
    });
  },

  hideToast: () => {
    set({
      message: "",
      type: "info",
      isVisible: false,
    });
  },
}));