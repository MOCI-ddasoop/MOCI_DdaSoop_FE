//메인페이지,후원하기,함께하기,마이페이지에서 사용되는 레이아웃

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <main className="max-w-7xl mx-auto pt-[60px] px-15 md:px-25 lg:px-30 xl:px-35">
        {children}
      </main>
    </div>
  );
}
