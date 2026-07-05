import { create } from "zustand";

export type MyPageTab =
  | "PROFILE"
  | "MY_PRODUCTS"
  | "MY_BIDS"
  | "MY_LIKES"
  | "MY_QNA";

type MyPageUiState = {
  activeTab: MyPageTab;
  setActiveTab: (activeTab: MyPageTab) => void;
  resetActiveTab: () => void;
};

export const useMyPageUiStore = create<MyPageUiState>((set) => ({
  activeTab: "PROFILE",

  setActiveTab: (activeTab) => {
    set({ activeTab });
  },

  resetActiveTab: () => {
    set({ activeTab: "PROFILE" });
  },
}));