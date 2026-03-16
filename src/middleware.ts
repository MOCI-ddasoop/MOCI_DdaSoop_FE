import { NextRequest, NextResponse } from "next/server";

// function toBase64Url(bytes: Uint8Array) {
//   const base64 = Buffer.from(bytes).toString("base64");
//   return base64.replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
// }

export function middleware(request: NextRequest) {
	// const nonceBytes = crypto.getRandomValues(new Uint8Array(16));
	// const nonce = toBase64Url(nonceBytes);

	// const csp = [
	//   "default-src 'self'",
	//   "base-uri 'self'",
	//   "object-src 'none'",

	//   `script-src 'self' 'unsafe-inline' https://www.clarity.ms https://scripts.clarity.ms https://js.tosspayments.com`,

	//   `style-src 'self' 'unsafe-inline' `,

	//   "img-src 'self' blob: data: https:  https: http://localhost:8000",

	//   "font-src 'self' data:",

	//   "connect-src 'self' https: https://api.tosspayments.com https://js.tosspayments.com",

	//   "frame-ancestors 'none'",

	//   "frame-src https://js.tosspayments.com https://payment-gateway-sandbox.tosspayments.com https://toss.im/ https://ui.teledit.com/",
	// ].join("; ");

	//TODO: nonce를 활용하여 inline script 허용하기 (현재는 'unsafe-inline'로 허용)

	//requestHeader에 함께 첨부
	// const requestHeaders = new Headers(req.headers);
	// requestHeaders.set("Content-Security-Policy", csp);
	// requestHeaders.set("x-nonce", nonce);

	// const response = NextResponse.next({
	//   request: {
	//     headers: requestHeaders,
	//   },
	// });

	//response에서도 확인
	//   response.headers.set("Content-Security-Policy", csp);
	//   response.headers.set("x-nonce", nonce);

	//   return response;
	// }

	// export const config = {
	//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
	// };

	const feedId = request.nextUrl.searchParams.get("feedId");
	const pathname = request.nextUrl.pathname;

	// 1. feedId가 있는데 정식 페이지(/feed/...)가 아닐 때만 개입
	if (feedId && !pathname.startsWith("/feed/")) {
		const referer = request.headers.get("referer");
		const host = request.headers.get("host");

		// 2. 외부 유입(리퍼러 없음 또는 타 도메인) 판단
		const isExternal = !referer || !referer.includes(host as string);

		if (isExternal) {
			// 3. 서버에서 즉시 다른 주소로 튕겨버림 (브라우저는 이 페이지를 그릴 기회조차 없음)
			const targetUrl = new URL(`/feed/${feedId}`, request.url);
			return NextResponse.redirect(targetUrl);
		}
	}

	return NextResponse.next();
}
