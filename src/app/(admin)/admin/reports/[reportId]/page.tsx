import Link from "next/link";
import ReportDetail from "@/domain/admin/components/ReportDetail";

export default async function AdminReportDetailPage({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  const { reportId } = await params;
  const id = Number(reportId);
  if (Number.isNaN(id)) {
    return (
      <div>
        <p className="text-mainred">잘못된 신고 ID입니다.</p>
        <Link href="/admin/reports" className="text-mainblue hover:underline">
          목록으로
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/admin/reports"
          className="text-mainblue hover:underline font-medium"
        >
          ← 신고 목록
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-black mb-6">신고 상세</h1>
      <ReportDetail reportId={id} />
    </div>
  );
}
