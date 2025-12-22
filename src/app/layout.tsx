import localFont from "next/font/local";
import TanstackProvider from "../shared/providers/TanstackProvider";
import Header from "@/shared/components/Header";
import "@/shared/styles/globals.css";
import "@/shared/utils/clarityInit";

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
    <html lang="ko-kr" className={pretendard.variable}>
      <body>
        <Header />
        <TanstackProvider>{children}</TanstackProvider>
        
      </body>
    </html>
  );
}
