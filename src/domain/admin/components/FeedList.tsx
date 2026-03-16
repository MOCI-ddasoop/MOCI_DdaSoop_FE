"use client";

import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useAdminFeeds } from "../api/useAdminFeeds";
import Pagination from "@/shared/components/Pagination";
import Button from "@/shared/components/Button";
import tw from "@/shared/utils/tw";
import { deleteAdminFeed } from "../api/deleteAdminFeed";
import { putAdminFeedPrivate } from "../api/putAdminFeedPrivate";
import Swal from "sweetalert2";

const VISIBILITY_OPTIONS = [
  { value: "ALL", label: "전체" },
  { value: "PUBLIC", label: "공개" },
  { value: "PRIVATE", label: "비공개" },
  { value: "FOLLOWERS", label: "팔로워" },
  { value: "MEMBERS", label: "멤버만" },
  { value: "NOTICE", label: "공지" },
] as const;

const VISIBILITY_LABELS: Record<string, string> = {
  PUBLIC: "공개",
  PRIVATE: "비공개",
  FOLLOWERS: "팔로워",
  MEMBERS: "멤버만",
  NOTICE: "공지",
};

const FEED_TYPE_LABELS: Record<string, string> = {
  GENERAL: "일반",
  TOGETHER_VERIFICATION: "함께하기 인증",
  TOGETHER_NOTICE: "함께하기 공지",
};

const PAGE_SIZE = 20;

export default function FeedList() {
  const [page, setPage] = useState(0);
  const [visibility, setVisibility] = useState<string>("ALL");
  const [authorIdInput, setAuthorIdInput] = useState("");
  const [authorIdFilter, setAuthorIdFilter] = useState<number | undefined>(undefined);
  const [reportedOnly, setReportedOnly] = useState(false);

  const { data, isPending, isError } = useAdminFeeds({
    visibility,
    authorId: authorIdFilter,
    reportedOnly,
    page,
    size: PAGE_SIZE,
  });

  const content = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "feeds", "list"] });
  };

  const deleteMutation = useMutation({
    mutationFn: (feedId: number) => deleteAdminFeed(feedId),
    onSuccess: () => {
      invalidate();
      Swal.fire("완료", "피드가 강제 삭제되었습니다.", "success");
    },
    onError: () => Swal.fire("실패", "삭제에 실패했습니다.", "error"),
  });

  const privateMutation = useMutation({
    mutationFn: (feedId: number) => putAdminFeedPrivate(feedId),
    onSuccess: () => {
      invalidate();
      Swal.fire("완료", "비공개 처리되었습니다.", "success");
    },
    onError: () => Swal.fire("실패", "비공개 처리에 실패했습니다.", "error"),
  });

  const handleDelete = (feedId: number) => {
    Swal.fire({
      text: "이 피드를 강제 삭제하시겠습니까?",
      icon: "warning",
      confirmButtonColor: "var(--color-mainred)",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((res) => {
      if (res.isConfirmed) deleteMutation.mutate(feedId);
    });
  };

  const handlePrivate = (feedId: number) => {
    Swal.fire({
      text: "이 피드를 비공개 처리하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "비공개",
      confirmButtonColor: "var(--color-mainblue)",
      cancelButtonText: "취소",
    }).then((res) => {
      if (res.isConfirmed) privateMutation.mutate(feedId);
    });
  };

  const applyAuthorIdFilter = () => {
    const trimmed = authorIdInput.trim();
    if (!trimmed) {
      setAuthorIdFilter(undefined);
      setPage(0);
      return;
    }
    const parsed = Number(trimmed);
    if (Number.isNaN(parsed) || parsed <= 0) {
      Swal.fire("입력 오류", "올바른 작성자 ID(숫자)를 입력하세요.", "warning");
      return;
    }
    setAuthorIdFilter(parsed);
    setPage(0);
  };

  if (isPending) {
    return (
      <div className="rounded-lg border border-pastelblue-border p-4">
        <p className="text-gray-500">피드 목록을 불러오는 중...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-pastelred-border bg-pastelred p-4 text-mainred">
        피드 목록을 불러오는데 실패했습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">공개 범위:</label>
          <select
            value={visibility}
            onChange={(e) => {
              const nextVisibility = e.target.value;
              setPage(0);
              setVisibility(nextVisibility);
              // 공개 범위를 바꾸면 작성자 ID 필터도 함께 초기화
              setAuthorIdInput("");
              setAuthorIdFilter(undefined);
            }}
            className="rounded-lg border border-pastelblue-border bg-pastelblue px-3 py-2 text-sm"
          >
            {VISIBILITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">작성자 ID:</label>
          <input
            type="text"
            autoComplete="off"
            value={authorIdInput}
            onChange={(e) => {
              setAuthorIdInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                applyAuthorIdFilter();
              }
            }}
            placeholder="작성자 ID"
            className="rounded-lg border border-pastelblue-border px-3 py-2 w-36 text-sm"
          />
          <Button size="sm" color="skyblue" onClick={applyAuthorIdFilter}>
            적용
          </Button>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={reportedOnly}
            onChange={(e) => {
              setPage(0);
              setReportedOnly(e.target.checked);
            }}
          />
          신고된 피드만 보기
        </label>
      </div>

      <div className="rounded-lg border border-pastelblue-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-pastelblue border-b border-pastelblue-border">
              <tr>
                <th className="p-3 font-semibold">ID</th>
                <th className="p-3 font-semibold">유형</th>
                <th className="p-3 font-semibold">공개</th>
                <th className="p-3 font-semibold">작성자</th>
                <th className="p-3 font-semibold">내용</th>
                <th className="p-3 font-semibold">좋아요</th>
                <th className="p-3 font-semibold">댓글</th>
                <th className="p-3 font-semibold">북마크</th>
                <th className="p-3 font-semibold">신고</th>
                <th className="p-3 font-semibold">상태</th>
                <th className="p-3 font-semibold">작성일</th>
                <th className="p-3 font-semibold">관리</th>
              </tr>
            </thead>
            <tbody>
              {content.length === 0 ? (
                <tr>
                  <td colSpan={12} className="p-4 text-center text-gray-500">
                    피드가 없습니다.
                  </td>
                </tr>
              ) : (
                content.map((f) => (
                  <tr key={f.id} className="border-b border-gray-100 hover:bg-pastelblue/30">
                    <td className="p-3">{f.id}</td>
                    <td className="p-3">
                      {FEED_TYPE_LABELS[f.feedType] ?? f.feedType}
                    </td>
                    <td className="p-3">
                      {VISIBILITY_LABELS[f.visibility] ?? f.visibility}
                    </td>
                    <td className="p-3">
                      {f.authorNickname} ({f.authorId})
                    </td>
                    <td className="p-3 max-w-[220px] truncate">
                      {f.contentPreview}
                    </td>
                    <td className="p-3">{f.reactionCount}</td>
                    <td className="p-3">{f.commentCount}</td>
                    <td className="p-3">{f.bookmarkCount}</td>
                    <td className="p-3">{f.reportCount}</td>
                    <td className="p-3">
                      <span
                        className={tw(
                          "text-xs font-semibold px-2 py-1 rounded-full",
                          f.isDeleted
                            ? "bg-pastelred border border-pastelred-border text-mainred"
                            : "bg-pastelblue border border-pastelblue-border text-mainblue"
                        )}
                      >
                        {f.isDeleted
                          ? f.deletedAt
                            ? `삭제 (${new Date(f.deletedAt).toLocaleDateString("ko-KR")})`
                            : "삭제"
                          : "활성"}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">
                      {new Date(f.createdAt).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        <Button
                          size="sm"
                          color="red"
                          onClick={() => handleDelete(f.id)}
                          disabled={deleteMutation.isPending}
                        >
                          삭제
                        </Button>
                        {!f.isDeleted && f.visibility !== "PRIVATE" && (
                          <Button
                            size="sm"
                            color="skyblue"
                            onClick={() => handlePrivate(f.id)}
                            disabled={privateMutation.isPending}
                          >
                            비공개
                          </Button>
                        )}
                      </div>
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

