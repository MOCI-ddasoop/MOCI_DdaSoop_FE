import AdminNav from "@/domain/admin/components/AdminNav";
import AdminGuard from "@/domain/admin/components/AdminGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="pt-[60px] px-15 md:px-25 lg:px-30 xl:px-35">
        <div className="w-[1000px] max-w-full mx-auto">
          <div
            className="py-3 px-4 mb-4 rounded-r-lg border-l-4 border-mainblue bg-pastelblue/40 text-mainblue font-semibold text-base"
            aria-label="관리자 영역"
          >
            관리자
          </div>
          <AdminNav />
          {children}
        </div>
      </div>
    </AdminGuard>
  );
}
