"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdminReports } from "../api/useAdminReports";
import Pagination from "@/shared/components/Pagination";
import tw from "@/shared/utils/tw";

const STATUS_OPTIONS = [
  { value: "", label: "전체" },
  { value: "PENDING", label: "대기" },
  { value: "REVIEWING", label: "검토중" },
  { value: "APPROVED", label: "승인" },
  { value: "REJECTED", label: "기각" },
] as const;

const PAGE_SIZE = 20;

export default function ReportList() {
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<
    "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED" | undefined
  >(undefined);

  const { data, isPending, isError } = useAdminReports({
    status,
    page,
    size: PAGE_SIZE,
  });

  const content = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  if (isPending) {
    return (
      <div className="rounded-lg border border-pastelblue-border p-4">
        <p className="text-gray-500">신고 목록을 불러오는 중...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-pastelred-border bg-pastelred p-4 text-mainred">
        신고 목록을 불러오는데 실패했습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-sm font-medium text-gray-600">상태:</label>
        <select
          value={status ?? ""}
          onChange={(e) => {
            setPage(0);
            setStatus(
              e.target.value
                ? (e.target.value as
                    | "PENDING"
                    | "REVIEWING"
                    | "APPROVED"
                    | "REJECTED")
                : undefined
            );
          }}
          className="rounded-lg border border-pastelblue-border bg-pastelblue px-3 py-2 text-sm"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value || "all"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="rounded-lg border border-pastelblue-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-pastelblue border-b border-pastelblue-border">
              <tr>
                <th className="p-3 font-semibold">ID</th>
                <th className="p-3 font-semibold">대상</th>
                <th className="p-3 font-semibold">대상ID</th>
                <th className="p-3 font-semibold">사유</th>
                <th className="p-3 font-semibold">상태</th>
                <th className="p-3 font-semibold">신고자</th>
                <th className="p-3 font-semibold">신고일</th>
                <th className="p-3 font-semibold">관리</th>
              </tr>
            </thead>
            <tbody>
              {content.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-500">
                    신고가 없습니다.
                  </td>
                </tr>
              ) : (
                content.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-gray-100 hover:bg-pastelblue/30"
                  >
                    <td className="p-3">{r.id}</td>
                    <td className="p-3">{r.targetType ?? "-"}</td>
                    <td className="p-3">{r.targetId ?? "-"}</td>
                    <td className="p-3">{r.reasonType ?? "-"}</td>
                    <td className="p-3">
                      <span
                        className={tw(
                          "font-medium",
                          r.status === "PENDING" && "text-mainred",
                          r.status === "APPROVED" && "text-mainblue",
                          r.status === "REJECTED" && "text-gray-600"
                        )}
                      >
                        {r.status ?? "-"}
                      </span>
                    </td>
                    <td className="p-3">{r.reporterNickname ?? "-"}</td>
                    <td className="p-3 text-gray-600">
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleDateString("ko-KR")
                        : "-"}
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/admin/reports/${r.id}`}
                        className="text-mainblue hover:underline font-medium"
                      >
                        상세
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            mode="state"
            currentPage={page + 1}
            onPageChange={(p) => setPage(p - 1)}
          />
        )}
      </div>
    </div>
  );
}
