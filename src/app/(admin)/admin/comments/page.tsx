import CommentList from "@/domain/admin/components/CommentList";
import CommentManagePanel from "@/domain/admin/components/CommentManagePanel";

export default function AdminCommentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-black mb-6">댓글 관리</h1>
      <p className="text-gray-600 mb-6">
        전체 댓글 목록을 조회하고 필터링하여 문제 있는 댓글을 관리할 수 있습니다.
      </p>
      <CommentList />
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">고급 검색 (ID 기반)</h2>
        <p className="text-gray-500 mb-3">
          특정 댓글 ID 또는 작성자 ID로 바로 찾아서 관리하고 싶을 때 사용하세요.
        </p>
        <CommentManagePanel />
      </div>
    </div>
  );
}
