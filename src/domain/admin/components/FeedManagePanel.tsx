"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getFeedByIdForAdmin } from "../api/getFeedByIdForAdmin";
import { getFeedsByMemberIdForAdmin } from "../api/getFeedsByMemberIdForAdmin";
import { deleteAdminFeed } from "../api/deleteAdminFeed";
import { putAdminFeedPrivate } from "../api/putAdminFeedPrivate";
import { useMutation } from "@tanstack/react-query";
import Button from "@/shared/components/Button";
import Swal from "sweetalert2";

type SearchMode = "memberId" | "feedId";

export default function FeedManagePanel() {
  const [searchMode, setSearchMode] = useState<SearchMode>("feedId");
  const [feedIdInput, setFeedIdInput] = useState("");
  const [memberIdInput, setMemberIdInput] = useState("");
  const [feedId, setFeedId] = useState<number | null>(null);
  const [memberId, setMemberId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: feed, isPending: feedPending, isError: feedError } = useQuery({
    queryKey: ["admin", "feeds", "single", feedId],
    queryFn: () => getFeedByIdForAdmin(feedId!),
    enabled: searchMode === "feedId" && feedId != null,
  });

  const { data: feedList, isPending: listPending, isError: listError } = useQuery({
    queryKey: ["admin", "feeds", "byMember", memberId],
    queryFn: () => getFeedsByMemberIdForAdmin(memberId!, { size: 50 }),
    enabled: searchMode === "memberId" && memberId != null,
  });

  const invalidateSingle = (id: number) => {
    queryClient.invalidateQueries({ queryKey: ["admin", "feeds", "single", id] });
    queryClient.invalidateQueries({ queryKey: ["admin", "feeds", "byMember", memberId] });
  };

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAdminFeed(id),
    onSuccess: (_, id) => {
      invalidateSingle(id);
      if (searchMode === "feedId" && feedId === id) {
        setFeedId(null);
        setFeedIdInput("");
      }
      Swal.fire("완료", "피드가 강제 삭제되었습니다.", "success");
    },
    onError: () => Swal.fire("실패", "삭제에 실패했습니다.", "error"),
  });

  const privateMutation = useMutation({
    mutationFn: (id: number) => putAdminFeedPrivate(id),
    onSuccess: (_, id) => {
      invalidateSingle(id);
      Swal.fire("완료", "비공개 처리되었습니다.", "success");
    },
    onError: () => Swal.fire("실패", "비공개 처리에 실패했습니다.", "error"),
  });

  const handleLoadFeedId = () => {
    const id = Number(feedIdInput.trim());
    if (Number.isNaN(id) || id <= 0) {
      Swal.fire("입력 오류", "올바른 피드 ID를 입력하세요.", "warning");
      return;
    }
    setFeedId(id);
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
      text: "이 피드를 강제 삭제하시겠습니까?",
      icon: "warning",
      confirmButtonColor: "var(--color-mainred)",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((res) => res.isConfirmed && deleteMutation.mutate(id));
  };

  const confirmPrivate = (id: number) => {
    Swal.fire({
      text: "이 피드를 비공개 처리하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "비공개",
      confirmButtonColor: "var(--color-mainblue)",
      cancelButtonText: "취소",
    }).then((res) => res.isConfirmed && privateMutation.mutate(id));
  };

  const list = feedList?.content ?? [];

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-pastelblue-border p-4">
        <p className="text-sm font-medium text-gray-700 mb-3">검색 방식</p>
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="feedSearchMode"
              checked={searchMode === "feedId"}
              onChange={() => setSearchMode("feedId")}
              className="text-mainblue"
            />
            <span>피드 ID로 직접 조회</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="feedSearchMode"
              checked={searchMode === "memberId"}
              onChange={() => setSearchMode("memberId")}
              className="text-mainblue"
            />
            <span>작성자 ID로 목록 조회</span>
          </label>
        </div>

        {searchMode === "feedId" && (
          <div className="flex gap-2">
            <input
              type="text"
              autoComplete="off"
              value={feedIdInput}
              onChange={(e) => setFeedIdInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLoadFeedId()}
              placeholder="피드 ID"
              className="rounded-lg border border-pastelblue-border px-3 py-2 w-40"
            />
            <Button size="sm" color="skyblue" onClick={handleLoadFeedId}>
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

      {/* 피드 ID로 단건 조회 결과 */}
      {searchMode === "feedId" && feedId != null && (
        <div className="rounded-lg border border-pastelblue-border overflow-hidden">
          {feedPending && <div className="p-4 text-gray-500">피드 정보를 불러오는 중...</div>}
          {feedError && (
            <div className="p-4 text-mainred bg-pastelred">피드를 찾을 수 없거나 조회에 실패했습니다.</div>
          )}
          {feed && (
            <>
              <div className="bg-pastelblue p-4">
                <h2 className="font-bold">피드 #{feed.id}</h2>
                <p className="text-sm text-gray-600">
                  작성자: {feed.authorNickname ?? feed.authorName ?? "-"} · {feed.visibility ?? "-"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {feed.createdAt ? new Date(feed.createdAt).toLocaleString("ko-KR") : "-"}
                </p>
              </div>
              {feed.content && (
                <div className="p-4 border-t border-pastelblue-border">
                  <p className="text-sm text-gray-700 line-clamp-3">{feed.content}</p>
                </div>
              )}
              <div className="p-4 border-t border-pastelblue-border flex flex-wrap gap-2">
                <Button
                  size="sm"
                  color="red"
                  onClick={() => confirmDelete(feedId!)}
                  disabled={deleteMutation.isPending}
                >
                  강제 삭제
                </Button>
                {feed.visibility !== "PRIVATE" && (
                  <Button
                    size="sm"
                    color="skyblue"
                    onClick={() => confirmPrivate(feedId!)}
                    disabled={privateMutation.isPending}
                  >
                    비공개 처리
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* 작성자 ID로 목록 조회 결과 */}
      {searchMode === "memberId" && memberId != null && (
        <div className="rounded-lg border border-pastelblue-border overflow-hidden">
          {listPending && <div className="p-4 text-gray-500">피드 목록을 불러오는 중...</div>}
          {listError && (
            <div className="p-4 text-mainred bg-pastelred">목록 조회에 실패했습니다.</div>
          )}
          {!listPending && !listError && (
            <>
              <div className="bg-pastelblue p-3 text-sm font-medium">
                작성자 ID {memberId} 피드 {list.length}건
              </div>
              {list.length === 0 ? (
                <div className="p-4 text-gray-500">작성한 피드가 없습니다.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100 border-b border-pastelblue-border">
                      <tr>
                        <th className="p-2 font-semibold">피드 ID</th>
                        <th className="p-2 font-semibold">작성자</th>
                        <th className="p-2 font-semibold">공개</th>
                        <th className="p-2 font-semibold">작성일</th>
                        <th className="p-2 font-semibold">관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((f) => (
                        <tr key={f.id} className="border-b border-gray-100">
                          <td className="p-2">{f.id}</td>
                          <td className="p-2">{f.authorNickname ?? f.authorName ?? "-"}</td>
                          <td className="p-2">{f.visibility ?? "-"}</td>
                          <td className="p-2 text-gray-600">
                            {f.createdAt ? new Date(f.createdAt).toLocaleDateString("ko-KR") : "-"}
                          </td>
                          <td className="p-2 flex flex-wrap gap-1">
                            <Button size="sm" color="red" onClick={() => confirmDelete(f.id!)} disabled={deleteMutation.isPending}>
                              삭제
                            </Button>
                            <Button size="sm" color="skyblue" onClick={() => confirmPrivate(f.id!)} disabled={privateMutation.isPending}>
                              비공개
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
