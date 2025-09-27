/* src/middleware.ts */

import { NextRequest, NextResponse } from "next/server";
import { i18nMiddleware } from "./middlewares/i18n";

// Define paths that should be excluded from the middleware.
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - i18n (your translation API route)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|i18n).*)",
	],
};

export function middleware(request: NextRequest) {
	// Call the dedicated i18n middleware.
	const i18nResponse = i18nMiddleware(request);

	// If the i18n middleware decided to redirect, return its response.
	if (i18nResponse) {
		return i18nResponse;
	}

	// Add other middlewares here in the future if needed.
	// const anotherMiddlewareResponse = anotherMiddleware(request);
	// if (anotherMiddlewareResponse) return anotherMiddlewareResponse;

	// If no middleware returned a response, continue to the request handler.
	return NextResponse.next();
}
