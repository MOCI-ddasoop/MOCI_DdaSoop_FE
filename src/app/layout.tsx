import localFont from "next/font/local";
import "@/src/shared/styles/globals.css";
import TanstackProvider from "../shared/providers/TanstackProvider";
import GTMInit from "@/src/shared/config/GTMInit";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  display: "swap", // 폰트로드방식(시스템폰트로 표시 후 폰트 로드 시 교체)
  weight: "45 920",
  variable: "--font-pretendard",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="ko-KR" className={pretendard.variable}>
      <body>
        <GTMInit />
        <TanstackProvider>{children}</TanstackProvider>
      </body>
    </html>
  );
}
