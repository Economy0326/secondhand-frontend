import { create } from "zustand";

type ModalType =
  | "LOGIN_REQUIRED"
  | "DELETE_PRODUCT"
  | "CANCEL_AUCTION"
  | "DELETE_ACCOUNT"
  | null;

type ModalState = {
  modalType: ModalType;
  isOpen: boolean;
  openModal: (modalType: Exclude<ModalType, null>) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalState>((set) => ({
  modalType: null,
  isOpen: false,

  openModal: (modalType) => {
    set({
      modalType,
      isOpen: true,
    });
  },

  closeModal: () => {
    set({
      modalType: null,
      isOpen: false,
    });
  },
}));