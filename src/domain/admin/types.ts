/**
 * 관리자 도메인 전용 타입 (admin 도메인 내부에서만 사용)
 */

/** 대시보드 통계 API 응답 */
export interface DashboardStatsResponse {
  memberCount?: number;
  feedCount?: number;
  commentCount?: number;
  togetherCount?: number;
  donationCount?: number;
  reportPendingCount?: number;
}

/** 회원 목록 항목 (GET /api/admin/members) - BE가 id 또는 memberId로 줄 수 있음 */
export interface AdminMemberListItem {
  id?: number;
  memberId?: number;
  name?: string;
  nickname?: string;
  email?: string;
  profileImageUrl?: string | null;
  role?: string;
  lastLoginProvider?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

/** 회원 목록 페이지 응답 */
export interface AdminMemberListResponse {
  totalPages?: number;
  totalElements?: number;
  content?: AdminMemberListItem[];
  number?: number;
  size?: number;
  first?: boolean;
  last?: boolean;
}

/** 회원 상세 (GET /api/admin/members/{memberId}) - id 필드 포함 */
export interface AdminMemberDetailResponse extends AdminMemberListItem {
  id?: number;
}

/** 신고 목록 항목 */
export interface AdminReportSummaryItem {
  id?: number;
  targetType?: "FEED" | "COMMENT" | "TOGETHER";
  targetId?: number;
  reasonType?: string;
  status?: "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED";
  reporterNickname?: string;
  reportedMemberNickname?: string;
  createdAt?: string;
  processedAt?: string;
}

/** 신고 목록 페이지 응답 */
export interface AdminReportListResponse {
  totalPages?: number;
  totalElements?: number;
  content?: AdminReportSummaryItem[];
  number?: number;
  size?: number;
}

/** 신고 상세 응답 */
export interface AdminReportDetailResponse extends AdminReportSummaryItem {
  reasonDetail?: string;
  reporterId?: number;
  reportedMemberId?: number;
  adminComment?: string;
  processedById?: number;
  processedByNickname?: string;
}

/** 신고 통계 (ReportStatsResponse 호환) */
export interface AdminReportStatsResponse {
  totalPending?: number;
  feedPending?: number;
  commentPending?: number;
  togetherPending?: number;
}

/** 관리자 피드 요약 응답 */
export interface AdminFeedSummaryResponse {
  id: number;
  feedType: string;
  visibility: string;
  authorId: number;
  authorNickname: string;
  contentPreview: string;
  reactionCount: number;
  commentCount: number;
  bookmarkCount: number;
  reportCount: number;
  createdAt: string;
  deletedAt?: string | null;
  isDeleted: boolean;
}

/** 관리자 피드 목록 페이지 응답 */
export interface AdminFeedListResponse {
  totalPages: number;
  totalElements: number;
  content: AdminFeedSummaryResponse[];
  number: number;
  size: number;
}

/** 관리자 댓글 요약 응답 */
export interface AdminCommentSummaryResponse {
  id: number;
  commentType: string;
  targetId: number;
  authorId: number;
  authorNickname: string;
  contentPreview: string;
  reactionCount: number;
  reportCount: number;
  createdAt: string;
  deletedAt?: string | null;
  isDeleted: boolean;
}

/** 관리자 댓글 목록 페이지 응답 */
export interface AdminCommentListResponse {
  totalPages: number;
  totalElements: number;
  content: AdminCommentSummaryResponse[];
  number: number;
  size: number;
}

