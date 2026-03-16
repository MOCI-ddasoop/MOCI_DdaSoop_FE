"use client";

import { useAdminReportStats } from "../api/useAdminReportStats";
import tw from "@/shared/utils/tw";

const STAT_ITEMS: {
  key: keyof import("../types").AdminReportStatsResponse;
  label: string;
}[] = [
  { key: "totalPending", label: "전체 대기" },
  { key: "feedPending", label: "피드 대기" },
  { key: "commentPending", label: "댓글 대기" },
  { key: "togetherPending", label: "함께하기 대기" },
];

export default function ReportStatsSection() {
  const { data, isPending } = useAdminReportStats();

  if (isPending) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {STAT_ITEMS.map(({ label }) => (
          <div
            key={label}
            className="rounded-lg bg-pastelblue border border-pastelblue-border p-4 animate-pulse"
          >
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-1 h-6 bg-gray-200 rounded w-12" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {STAT_ITEMS.map(({ key, label }) => (
        <div
          key={key}
          className={tw(
            "rounded-lg border p-4",
            "bg-pastelblue border-pastelblue-border"
          )}
        >
          <p className="text-sm text-gray-600">{label}</p>
          <p className="mt-1 text-xl font-bold text-mainblue">
            {data?.[key] ?? 0}
          </p>
        </div>
      ))}
    </div>
  );
}
