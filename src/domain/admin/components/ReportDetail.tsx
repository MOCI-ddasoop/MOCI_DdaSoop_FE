"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useAdminReport } from "../api/useAdminReport";
import { putAdminReportProcess } from "../api/putAdminReportProcess";
import { putAdminReportReview } from "../api/putAdminReportReview";
import { useMutation } from "@tanstack/react-query";
import Button from "@/shared/components/Button";
import { ADMIN_REPORTS_QUERY_KEY } from "../api/useAdminReports";
import Swal from "sweetalert2";

type ReportDetailProps = {
  reportId: number;
};

export default function ReportDetail({ reportId }: ReportDetailProps) {
  const queryClient = useQueryClient();
  const { data: report, isPending, isError } = useAdminReport(reportId);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ADMIN_REPORTS_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: ["admin", "reports", reportId] });
  };

  const processMutation = useMutation({
    mutationFn: (body: {
      status: "APPROVED" | "REJECTED";
      adminComment: string;
    }) => putAdminReportProcess(reportId, body),
    onSuccess: () => {
      invalidate();
      Swal.fire("완료", "처리되었습니다.", "success");
    },
    onError: () => Swal.fire("실패", "처리에 실패했습니다.", "error"),
  });

  const reviewMutation = useMutation({
    mutationFn: () => putAdminReportReview(reportId),
    onSuccess: () => {
      invalidate();
      Swal.fire("완료", "검토 시작 처리되었습니다.", "success");
    },
    onError: () =>
      Swal.fire("실패", "검토 시작 처리에 실패했습니다.", "error"),
  });

  const handleProcess = (status: "APPROVED" | "REJECTED") => {
    Swal.fire({
      title: status === "APPROVED" ? "승인" : "기각",
      input: "textarea",
      inputLabel: "관리자 코멘트 (선택)",
      inputPlaceholder: "코멘트를 입력하세요",
      showCancelButton: true,
      confirmButtonText: "확인",
      confirmButtonColor: "var(--color-mainblue)",
      cancelButtonText: "취소",
    }).then((res) => {
      if (res.isConfirmed)
        processMutation.mutate({
          status,
          adminComment: res.value?.trim() ?? "",
        });
    });
  };

  const handleStartReview = () => {
    Swal.fire({
      text: "검토를 시작하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "시작",
      confirmButtonColor: "var(--color-mainblue)",
      cancelButtonText: "취소",
    }).then((res) => {
      if (res.isConfirmed) reviewMutation.mutate();
    });
  };

  if (isPending) {
    return (
      <div className="rounded-lg border border-pastelblue-border p-6">
        <p className="text-gray-500">신고 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="rounded-lg border border-pastelred-border bg-pastelred p-4 text-mainred">
        신고 정보를 불러오는데 실패했습니다.
      </div>
    );
  }

  const canProcess = report.status === "PENDING" || report.status === "REVIEWING";

  return (
    <div className="rounded-lg border border-pastelblue-border overflow-hidden">
      <div className="bg-pastelblue p-4">
        <h2 className="text-lg font-bold">
          신고 #{report.id} · {report.targetType} #{report.targetId}
        </h2>
        <p className="text-sm text-gray-600">
          상태: <span className="font-medium">{report.status}</span>
        </p>
      </div>
      <div className="p-4 space-y-2 text-sm">
        <p>
          <span className="text-gray-500">사유 유형:</span>{" "}
          {report.reasonType ?? "-"}
        </p>
        {report.reasonDetail && (
          <p>
            <span className="text-gray-500">상세:</span> {report.reasonDetail}
          </p>
        )}
        <p>
          <span className="text-gray-500">신고자:</span>{" "}
          {report.reporterNickname ?? "-"}
        </p>
        <p>
          <span className="text-gray-500">피신고자:</span>{" "}
          {report.reportedMemberNickname ?? "-"}
        </p>
        <p>
          <span className="text-gray-500">신고일:</span>{" "}
          {report.createdAt
            ? new Date(report.createdAt).toLocaleString("ko-KR")
            : "-"}
        </p>
        {report.processedAt && (
          <p>
            <span className="text-gray-500">처리일:</span>{" "}
            {new Date(report.processedAt).toLocaleString("ko-KR")}
          </p>
        )}
        {report.adminComment && (
          <p>
            <span className="text-gray-500">관리자 코멘트:</span>{" "}
            {report.adminComment}
          </p>
        )}
      </div>
      {canProcess && (
        <div className="p-4 border-t border-pastelblue-border flex flex-wrap gap-2">
          <Button
            size="sm"
            color="skyblue"
            onClick={handleStartReview}
            disabled={reviewMutation.isPending}
          >
            검토 시작
          </Button>
          <Button
            size="sm"
            color="skyblue"
            onClick={() => handleProcess("APPROVED")}
            disabled={processMutation.isPending}
          >
            승인
          </Button>
          <Button
            size="sm"
            color="red"
            onClick={() => handleProcess("REJECTED")}
            disabled={processMutation.isPending}
          >
            기각
          </Button>
        </div>
      )}
    </div>
  );
}
