import DashboardStats from "@/domain/admin/components/DashboardStats";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-black mb-6">대시보드</h1>
      <p className="text-gray-600 mb-6">
        회원·피드·댓글·함께하기·기부·신고 대기 통계를 확인할 수 있습니다.
      </p>
      <DashboardStats />
    </div>
  );
}
