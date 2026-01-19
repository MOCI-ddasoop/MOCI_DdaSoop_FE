import { create } from "zustand";

export type ModalType = "feedCreate" | "feed" | null;

interface ModalState {
	type: ModalType;
	open: (type: Exclude<ModalType, null>) => void;
	close: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
	type: null,
	open: (type) => set(() => ({ type })),
	close: () => set(() => ({ type: null })),
}));
