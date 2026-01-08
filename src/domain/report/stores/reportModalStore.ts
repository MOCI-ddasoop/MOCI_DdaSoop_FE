import { create } from "zustand";

interface ReportModalStore {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}

const reportModalStore = create<ReportModalStore>()((set) => {
	return {
		isOpen: false,
		setIsOpen: (isOpen: boolean) => {
			set({ isOpen });
		},
	};
});

export default reportModalStore;
