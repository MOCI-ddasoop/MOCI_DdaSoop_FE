"use client";

import { useDashboardStats } from "../api/useDashboardStats";
import tw from "@/shared/utils/tw";

const STAT_ITEMS: { key: keyof import("../types").DashboardStatsResponse; label: string }[] = [
  { key: "memberCount", label: "회원" },
  { key: "feedCount", label: "피드" },
  { key: "commentCount", label: "댓글" },
  { key: "togetherCount", label: "함께하기" },
  { key: "donationCount", label: "기부" },
  { key: "reportPendingCount", label: "신고 대기" },
];

export default function DashboardStats() {
  const { data, isPending, isError } = useDashboardStats();

  if (isPending) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {STAT_ITEMS.map(({ label }) => (
          <div
            key={label}
            className="rounded-lg bg-pastelblue border border-pastelblue-border p-4 animate-pulse"
          >
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-1 h-8 bg-gray-200 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-pastelred border border-pastelred-border p-4 text-mainred">
        통계를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {STAT_ITEMS.map(({ key, label }) => (
        <div
          key={key}
          className={tw(
            "rounded-lg border p-4",
            key === "reportPendingCount"
              ? "bg-pastelred border-pastelred-border"
              : "bg-pastelblue border-pastelblue-border"
          )}
        >
          <p className="text-sm text-gray-600">{label}</p>
          <p className="mt-1 text-2xl font-bold text-mainblue">
            {data?.[key] ?? 0}
          </p>
        </div>
      ))}
    </div>
  );
}
