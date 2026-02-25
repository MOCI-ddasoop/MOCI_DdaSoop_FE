import CommentManagePanel from "@/domain/admin/components/CommentManagePanel";

export default function AdminCommentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-black mb-6">댓글 관리</h1>
      <p className="text-gray-600 mb-6">
        댓글 ID로 조회 후 강제 삭제할 수 있습니다.
      </p>
      <CommentManagePanel />
    </div>
  );
}
