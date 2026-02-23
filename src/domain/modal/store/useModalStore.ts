import reportModalStore from "@/domain/report/stores/useReportModalStore";
import { create } from "zustand";

export type ModalType = "feedCreate" | "feed" | "report";

interface ModalState {
	stack: ModalType[];
	canCloseMap: Partial<Record<ModalType, () => Promise<boolean>>>;

	open: (type: ModalType) => void;
	close: () => boolean | Promise<boolean>;

	setCanClose: (type: ModalType, fn: () => Promise<boolean>) => void;
	resetCanClose: (type: ModalType) => void;
}

export const useModalStore = create<ModalState>((set, get) => ({
	stack: [],
	canCloseMap: {},

	open: (type) =>
		set((state) => ({
			stack: state.stack.includes(type) ? state.stack : [...state.stack, type],
		})),

	close: async () => {
		const { stack, canCloseMap } = get();

		const top = stack[stack.length - 1];

		const canCloseFn = canCloseMap[top];
		if (!canCloseFn) return true;

		const isAllowed = await canCloseFn();
		if (!isAllowed) return false;

		set((state) => {
			const newStack = [...state.stack];
			const poppedModal = newStack.pop();
			const newMap = { ...state.canCloseMap };
			if (poppedModal) delete newMap[poppedModal];

			return { stack: newStack, canCloseMap: newMap };
		});

		if (top === "report") {
			reportModalStore.getState().action.resetReportTarget();
		}

		return true;
	},

	setCanClose: (type, fn) =>
		set((state) => ({
			canCloseMap: {
				...state.canCloseMap,
				[type]: fn,
			},
		})),

	resetCanClose: (type) =>
		set((state) => {
			const newMap = { ...state.canCloseMap };
			delete newMap[type];
			return {
				canCloseMap: newMap,
			};
		}),
}));
