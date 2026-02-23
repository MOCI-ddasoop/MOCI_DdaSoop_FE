import { create } from "zustand";
import { ReportCreateRequest } from "../type";

interface ReportModalStore {
	reportTargetType: ReportCreateRequest["targetType"] | null;
	reportTargetId: ReportCreateRequest["targetId"] | null;

	action: {
		setReportTarget: (
			targetType: ReportCreateRequest["targetType"],
			targetId: ReportCreateRequest["targetId"],
		) => void;
		resetReportTarget: () => void;
	};
}

const reportModalStore = create<ReportModalStore>()((set) => {
	return {
		reportTargetType: null,
		reportTargetId: null,

		action: {
			setReportTarget: (targetType, targetId) =>
				set({ reportTargetType: targetType, reportTargetId: targetId }),
			resetReportTarget: () =>
				set({ reportTargetType: null, reportTargetId: null }),
		},
	};
});

export default reportModalStore;
