import localFont from "next/font/local";
import TanstackProvider from "../shared/providers/TanstackProvider";
import Header from "@/shared/components/Header";
import "@/shared/styles/globals.css";
import ClarityInit from "@/shared/utils/clarityInit";
import ReportModal from "@/domain/report/ReportModal";
import AuthInit from "@/shared/providers/AuthInit";
import FeedModalRoot from "@/domain/feed/components/ModalRoot";
import { Suspense } from "react";

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
		<html lang="ko" className={pretendard.variable} suppressHydrationWarning>
			<body>
				<AuthInit />
				<Header />
				<ReportModal />
				<ClarityInit />
				<TanstackProvider>
					{children}
					<Suspense fallback={<div className="loader"></div>}>
						<FeedModalRoot />
					</Suspense>
				</TanstackProvider>
			</body>
		</html>
	);
}
