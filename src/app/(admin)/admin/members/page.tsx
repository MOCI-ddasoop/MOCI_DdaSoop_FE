import MemberList from "@/domain/admin/components/MemberList";

export default function AdminMembersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-black mb-6">회원 관리</h1>
      <p className="text-gray-600 mb-6">
        회원 목록 조회, 상세, 역할 변경, 탈퇴 처리, 복구를 할 수 있습니다.
      </p>
      <MemberList />
    </div>
  );
}
