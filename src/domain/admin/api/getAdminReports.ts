import { api } from "@/shared/config/api";
import type {
  AdminReportListResponse,
  AdminReportSummaryItem,
} from "../types";

const STATUSES: ("PENDING" | "REVIEWING" | "APPROVED" | "REJECTED")[] = [
  "PENDING",
  "REVIEWING",
  "APPROVED",
  "REJECTED",
];

/**
 * GET /api/admin/reports - 신고 목록 (단일 상태)
 */
async function getAdminReportsByStatus(params: {
  status: "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED";
  page?: number;
  size?: number;
}) {
  const { data } = await api.get<AdminReportListResponse>("/api/admin/reports", {
    params: {
      status: params.status,
      page: params.page ?? 0,
      size: params.size ?? 20,
    },
  });
  return data;
}

/**
 * GET /api/admin/reports - 신고 목록
 * status 없으면 전체(대기·검토중·승인·기각) 각각 조회 후 합쳐서 반환
 */
export async function getAdminReports(params: {
  status?: "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED";
  page?: number;
  size?: number;
}) {
  const page = params.page ?? 0;
  const size = params.size ?? 20;

  if (params.status != null) {
    return getAdminReportsByStatus({
      status: params.status,
      page,
      size,
    });
  }

  const results = await Promise.all(
    STATUSES.map((status) =>
      getAdminReportsByStatus({ status, page: 0, size: 50 })
    )
  );

  const mergedContent: AdminReportSummaryItem[] = [];
  const seenIds = new Set<number>();
  for (const res of results) {
    const list = res.content ?? [];
    for (const item of list) {
      if (item.id != null && !seenIds.has(item.id)) {
        seenIds.add(item.id);
        mergedContent.push(item);
      }
    }
  }
  mergedContent.sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });

  const start = page * size;
  const pagedContent = mergedContent.slice(start, start + size);
  const totalElements = mergedContent.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));

  return {
    content: pagedContent,
    totalPages,
    totalElements,
    number: page,
    size,
    first: page === 0,
    last: page >= totalPages - 1,
  };
}
