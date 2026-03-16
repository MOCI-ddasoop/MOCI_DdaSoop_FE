"use client";

import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useAdminComments } from "../api/useAdminComments";
import Pagination from "@/shared/components/Pagination";
import Button from "@/shared/components/Button";
import tw from "@/shared/utils/tw";
import { deleteAdminComment } from "../api/deleteAdminComment";
import Swal from "sweetalert2";

const COMMENT_TYPE_OPTIONS = [
  { value: "ALL", label: "전체" },
  { value: "FEED", label: "피드" },
  { value: "TOGETHER", label: "함께하기" },
  { value: "DONATION", label: "기부" },
] as const;

const COMMENT_TYPE_LABELS: Record<string, string> = {
  FEED: "피드",
  TOGETHER: "함께하기",
  DONATION: "기부",
};

const PAGE_SIZE = 20;

export default function CommentList() {
  const [page, setPage] = useState(0);
  const [commentType, setCommentType] = useState<string>("ALL");
  const [authorIdInput, setAuthorIdInput] = useState("");
  const [authorIdFilter, setAuthorIdFilter] = useState<number | undefined>(undefined);
  const [reportedOnly, setReportedOnly] = useState(false);

  const { data, isPending, isError } = useAdminComments({
    commentType,
    authorId: authorIdFilter,
    reportedOnly,
    page,
    size: PAGE_SIZE,
  });

  const content = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "comments", "list"] });
  };

  const deleteMutation = useMutation({
    mutationFn: (commentId: number) => deleteAdminComment(commentId),
    onSuccess: () => {
      invalidate();
      Swal.fire("완료", "댓글이 강제 삭제되었습니다.", "success");
    },
    onError: () => Swal.fire("실패", "삭제에 실패했습니다.", "error"),
  });

  const handleDelete = (commentId: number) => {
    Swal.fire({
      text: "이 댓글을 강제 삭제하시겠습니까?",
      icon: "warning",
      confirmButtonColor: "var(--color-mainred)",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((res) => {
      if (res.isConfirmed) deleteMutation.mutate(commentId);
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
        <p className="text-gray-500">댓글 목록을 불러오는 중...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-pastelred-border bg-pastelred p-4 text-mainred">
        댓글 목록을 불러오는데 실패했습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">댓글 타입:</label>
          <select
            value={commentType}
            onChange={(e) => {
              const nextType = e.target.value;
              setPage(0);
              setCommentType(nextType);
              // 타입을 바꾸면 작성자 ID 필터도 함께 초기화
              setAuthorIdInput("");
              setAuthorIdFilter(undefined);
            }}
            className="rounded-lg border border-pastelblue-border bg-pastelblue px-3 py-2 text-sm"
          >
            {COMMENT_TYPE_OPTIONS.map((opt) => (
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
          신고된 댓글만 보기
        </label>
      </div>

      <div className="rounded-lg border border-pastelblue-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-pastelblue border-b border-pastelblue-border">
              <tr>
                <th className="p-3 font-semibold">ID</th>
                <th className="p-3 font-semibold">타입</th>
                <th className="p-3 font-semibold">대상ID</th>
                <th className="p-3 font-semibold">작성자</th>
                <th className="p-3 font-semibold">내용</th>
                <th className="p-3 font-semibold">좋아요</th>
                <th className="p-3 font-semibold">신고</th>
                <th className="p-3 font-semibold">상태</th>
                <th className="p-3 font-semibold">작성일</th>
                <th className="p-3 font-semibold">관리</th>
              </tr>
            </thead>
            <tbody>
              {content.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-4 text-center text-gray-500">
                    댓글이 없습니다.
                  </td>
                </tr>
              ) : (
                content.map((c) => (
                  <tr key={c.id} className="border-b border-gray-100 hover:bg-pastelblue/30">
                    <td className="p-3">{c.id}</td>
                    <td className="p-3">
                      {COMMENT_TYPE_LABELS[c.commentType] ?? c.commentType}
                    </td>
                    <td className="p-3">{c.targetId}</td>
                    <td className="p-3">
                      {c.authorNickname} ({c.authorId})
                    </td>
                    <td className="p-3 max-w-[220px] truncate">
                      {c.contentPreview}
                    </td>
                    <td className="p-3">{c.reactionCount}</td>
                    <td className="p-3">{c.reportCount}</td>
                    <td className="p-3">
                      <span
                        className={tw(
                          "text-xs font-semibold px-2 py-1 rounded-full",
                          c.isDeleted
                            ? "bg-pastelred border border-pastelred-border text-mainred"
                            : "bg-pastelblue border border-pastelblue-border text-mainblue"
                        )}
                      >
                        {c.isDeleted
                          ? c.deletedAt
                            ? `삭제 (${new Date(c.deletedAt).toLocaleDateString("ko-KR")})`
                            : "삭제"
                          : "활성"}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">
                      {new Date(c.createdAt).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="p-3">
                      <Button
                        size="sm"
                        color="red"
                        onClick={() => handleDelete(c.id)}
                        disabled={deleteMutation.isPending}
                      >
                        삭제
                      </Button>
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

