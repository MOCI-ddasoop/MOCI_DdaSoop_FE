import FeedManagePanel from "@/domain/admin/components/FeedManagePanel";

export default function AdminFeedsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-black mb-6">피드 관리</h1>
      <p className="text-gray-600 mb-6">
        피드 ID로 조회 후 강제 삭제 또는 비공개 처리할 수 있습니다.
      </p>
      <FeedManagePanel />
    </div>
  );
}
