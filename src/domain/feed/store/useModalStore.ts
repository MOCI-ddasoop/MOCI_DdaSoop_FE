import { create } from "zustand";

export type ModalType = "feedCreate" | "feed" | null;

interface ModalState {
	type: ModalType;
	open: (type: Exclude<ModalType, null>) => void;
	close: () => void;

	canClose: () => Promise<boolean>;
	setCanClose: (fn: () => Promise<boolean>) => void;
	resetCanClose: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
	type: null,
	open: (type) => set(() => ({ type })),
	close: () => set(() => ({ type: null })),

	canClose: async () => true,

	setCanClose: (fn) => set({ canClose: fn }),
	resetCanClose: () => set({ canClose: async () => true }),
}));
