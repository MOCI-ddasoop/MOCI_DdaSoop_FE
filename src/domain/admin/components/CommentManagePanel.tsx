"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCommentByIdForAdmin } from "../api/getCommentByIdForAdmin";
import { getCommentsByMemberIdForAdmin } from "../api/getCommentsByMemberIdForAdmin";
import { deleteAdminComment } from "../api/deleteAdminComment";
import { useMutation } from "@tanstack/react-query";
import Button from "@/shared/components/Button";
import Swal from "sweetalert2";

type SearchMode = "memberId" | "commentId";

export default function CommentManagePanel() {
  const [searchMode, setSearchMode] = useState<SearchMode>("commentId");
  const [commentIdInput, setCommentIdInput] = useState("");
  const [memberIdInput, setMemberIdInput] = useState("");
  const [commentId, setCommentId] = useState<number | null>(null);
  const [memberId, setMemberId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: comment, isPending: singlePending, isError: singleError } = useQuery({
    queryKey: ["admin", "comments", "single", commentId],
    queryFn: () => getCommentByIdForAdmin(commentId!),
    enabled: searchMode === "commentId" && commentId != null,
  });

  const { data: commentPage, isPending: listPending, isError: listError } = useQuery({
    queryKey: ["admin", "comments", "byMember", memberId],
    queryFn: () => getCommentsByMemberIdForAdmin(memberId!, { page: 0, size: 50 }),
    enabled: searchMode === "memberId" && memberId != null,
  });

  const invalidateSingle = (id: number) => {
    queryClient.invalidateQueries({ queryKey: ["admin", "comments", "single", id] });
    queryClient.invalidateQueries({ queryKey: ["admin", "comments", "byMember", memberId] });
  };

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAdminComment(id),
    onSuccess: (_, id) => {
      invalidateSingle(id);
      if (searchMode === "commentId" && commentId === id) {
        setCommentId(null);
        setCommentIdInput("");
      }
      Swal.fire("완료", "댓글이 강제 삭제되었습니다.", "success");
    },
    onError: () => Swal.fire("실패", "삭제에 실패했습니다.", "error"),
  });

  const handleLoadCommentId = () => {
    const id = Number(commentIdInput.trim());
    if (Number.isNaN(id) || id <= 0) {
      Swal.fire("입력 오류", "올바른 댓글 ID를 입력하세요.", "warning");
      return;
    }
    setCommentId(id);
  };

  const handleLoadMemberId = () => {
    const id = Number(memberIdInput.trim());
    if (Number.isNaN(id) || id <= 0) {
      Swal.fire("입력 오류", "올바른 작성자 ID(회원 ID)를 입력하세요.", "warning");
      return;
    }
    setMemberId(id);
  };

  const confirmDelete = (id: number) => {
    Swal.fire({
      text: "이 댓글을 강제 삭제하시겠습니까?",
      icon: "warning",
      confirmButtonColor: "var(--color-mainred)",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((res) => res.isConfirmed && deleteMutation.mutate(id));
  };

  const list = commentPage?.content ?? [];

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-pastelblue-border p-4">
        <p className="text-sm font-medium text-gray-700 mb-3">검색 방식</p>
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="commentSearchMode"
              checked={searchMode === "commentId"}
              onChange={() => setSearchMode("commentId")}
              className="text-mainblue"
            />
            <span>댓글 ID로 직접 조회</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="commentSearchMode"
              checked={searchMode === "memberId"}
              onChange={() => setSearchMode("memberId")}
              className="text-mainblue"
            />
            <span>작성자 ID로 목록 조회</span>
          </label>
        </div>

        {searchMode === "commentId" && (
          <div className="flex gap-2">
            <input
              type="text"
              autoComplete="off"
              value={commentIdInput}
              onChange={(e) => setCommentIdInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLoadCommentId()}
              placeholder="댓글 ID"
              className="rounded-lg border border-pastelblue-border px-3 py-2 w-40"
            />
            <Button size="sm" color="skyblue" onClick={handleLoadCommentId}>
              조회
            </Button>
          </div>
        )}

        {searchMode === "memberId" && (
          <div className="flex gap-2">
            <input
              type="text"
              autoComplete="off"
              value={memberIdInput}
              onChange={(e) => setMemberIdInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLoadMemberId()}
              placeholder="작성자 ID (회원 ID)"
              className="rounded-lg border border-pastelblue-border px-3 py-2 w-48"
            />
            <Button size="sm" color="skyblue" onClick={handleLoadMemberId}>
              조회
            </Button>
          </div>
        )}
      </div>

      {/* 댓글 ID로 단건 조회 결과 */}
      {searchMode === "commentId" && commentId != null && (
        <div className="rounded-lg border border-pastelblue-border overflow-hidden">
          {singlePending && <div className="p-4 text-gray-500">댓글 정보를 불러오는 중...</div>}
          {singleError && (
            <div className="p-4 text-mainred bg-pastelred">댓글을 찾을 수 없거나 조회에 실패했습니다.</div>
          )}
          {comment && (
            <>
              <div className="bg-pastelblue p-4">
                <h2 className="font-bold">댓글 #{comment.id}</h2>
                <p className="text-sm text-gray-600">
                  작성자: {comment.authorNickname ?? comment.authorName ?? "-"}
                  {comment.targetId != null && ` · 대상 ID: ${comment.targetId}`}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {comment.createdAt ? new Date(comment.createdAt).toLocaleString("ko-KR") : "-"}
                </p>
              </div>
              {comment.content && (
                <div className="p-4 border-t border-pastelblue-border">
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
              )}
              <div className="p-4 border-t border-pastelblue-border">
                <Button
                  size="sm"
                  color="red"
                  onClick={() => confirmDelete(commentId!)}
                  disabled={deleteMutation.isPending}
                >
                  강제 삭제
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* 작성자 ID로 목록 조회 결과 */}
      {searchMode === "memberId" && memberId != null && (
        <div className="rounded-lg border border-pastelblue-border overflow-hidden">
          {listPending && <div className="p-4 text-gray-500">댓글 목록을 불러오는 중...</div>}
          {listError && <div className="p-4 text-mainred bg-pastelred">목록 조회에 실패했습니다.</div>}
          {!listPending && !listError && (
            <>
              <div className="bg-pastelblue p-3 text-sm font-medium">
                작성자 ID {memberId} 댓글 {list.length}건
              </div>
              {list.length === 0 ? (
                <div className="p-4 text-gray-500">작성한 댓글이 없습니다.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100 border-b border-pastelblue-border">
                      <tr>
                        <th className="p-2 font-semibold">댓글 ID</th>
                        <th className="p-2 font-semibold">작성자</th>
                        <th className="p-2 font-semibold">내용</th>
                        <th className="p-2 font-semibold">작성일</th>
                        <th className="p-2 font-semibold">관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((c) => (
                        <tr key={c.id} className="border-b border-gray-100">
                          <td className="p-2">{c.id}</td>
                          <td className="p-2">{c.authorNickname ?? c.authorName ?? "-"}</td>
                          <td className="p-2 max-w-[200px] truncate">{c.content ?? "-"}</td>
                          <td className="p-2 text-gray-600">
                            {c.createdAt ? new Date(c.createdAt).toLocaleDateString("ko-KR") : "-"}
                          </td>
                          <td className="p-2">
                            <Button
                              size="sm"
                              color="red"
                              onClick={() => confirmDelete(c.id!)}
                              disabled={deleteMutation.isPending}
                            >
                              삭제
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
