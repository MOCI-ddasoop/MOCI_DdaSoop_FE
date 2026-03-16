import Link from "next/link";
import MemberDetail from "@/domain/admin/components/MemberDetail";

export default async function AdminMemberDetailPage({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  const { memberId } = await params;
  const id = Number(memberId);
  if (Number.isNaN(id)) {
    return (
      <div>
        <p className="text-mainred">잘못된 회원 ID입니다.</p>
        <Link href="/admin/members" className="text-mainblue hover:underline">
          목록으로
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/admin/members"
          className="text-mainblue hover:underline font-medium"
        >
          ← 회원 목록
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-black mb-6">회원 상세</h1>
      <MemberDetail memberId={id} />
    </div>
  );
}
