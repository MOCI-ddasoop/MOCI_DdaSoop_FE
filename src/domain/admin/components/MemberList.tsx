"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdminMembers } from "../api/useAdminMembers";
import Pagination from "@/shared/components/Pagination";
import tw from "@/shared/utils/tw";

const PAGE_SIZE = 20;

export default function MemberList() {
  const [page, setPage] = useState(0);
  const { data, isPending, isError } = useAdminMembers(page, PAGE_SIZE);

  if (isPending) {
    return (
      <div className="rounded-lg border border-pastelblue-border p-4">
        <p className="text-gray-500">회원 목록을 불러오는 중...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-pastelred-border bg-pastelred p-4 text-mainred">
        회원 목록을 불러오는데 실패했습니다.
      </div>
    );
  }

  const content = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="rounded-lg border border-pastelblue-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-pastelblue border-b border-pastelblue-border">
            <tr>
              <th className="p-3 font-semibold">회원ID</th>
              <th className="p-3 font-semibold">닉네임</th>
              <th className="p-3 font-semibold">이메일</th>
              <th className="p-3 font-semibold">역할</th>
              <th className="p-3 font-semibold">가입일</th>
              <th className="p-3 font-semibold">상태</th>
              <th className="p-3 font-semibold">관리</th>
            </tr>
          </thead>
          <tbody>
            {content.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  회원이 없습니다.
                </td>
              </tr>
            ) : (
              content.map((m, index) => {
                const memberId = m.memberId ?? m.id;
                return (
                  <tr
                    key={memberId != null ? `member-${memberId}` : `member-fallback-${index}`}
                    className="border-b border-gray-100 hover:bg-pastelblue/30"
                  >
                    <td className="p-3">{memberId ?? "-"}</td>
                    <td className="p-3">{m.nickname ?? "-"}</td>
                    <td className="p-3">{m.email ?? "-"}</td>
                    <td className="p-3">
                      <span
                        className={tw(
                          "font-medium",
                          m.role?.toUpperCase() === "ADMIN" || m.role?.toUpperCase()?.includes("ADMIN")
                            ? "text-mainred"
                            : "text-mainblue"
                        )}
                      >
                        {m.role ?? "-"}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">
                      {m.createdAt
                        ? new Date(m.createdAt).toLocaleDateString("ko-KR")
                        : "-"}
                    </td>
                    <td className="p-3">
                      {m.deletedAt ? (
                        <span className="text-mainred">탈퇴</span>
                      ) : (
                        <span className="text-mainblue">활성</span>
                      )}
                    </td>
                    <td className="p-3">
                      {memberId != null && (
                        <Link
                          href={`/admin/members/${memberId}`}
                          className="text-mainblue hover:underline font-medium"
                        >
                          상세
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })
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
  );
}
