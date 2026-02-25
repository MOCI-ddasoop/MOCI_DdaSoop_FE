import ReportStatsSection from "@/domain/admin/components/ReportStatsSection";
import ReportList from "@/domain/admin/components/ReportList";

export default function AdminReportsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-black mb-6">신고 관리</h1>
      <p className="text-gray-600 mb-6">
        신고 목록·상세, 승인·기각, 검토 시작, 통계를 확인할 수 있습니다.
      </p>
      <ReportStatsSection />
      <ReportList />
    </div>
  );
}
