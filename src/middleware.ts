/* src/middleware.ts */

import { NextRequest, NextResponse } from "next/server";
import { i18nMiddleware } from "./middlewares/i18n";

export const config = {
	matcher: [
		// Exclude Next.js internals
		"/((?!_next).*)",
		// Exclude i18n API
		"/((?!i18n).*)",
		// Exclude static assets in /public
		"/((?!favicon.ico).*)",
		"/((?!favicon.svg).*)",
		"/((?!favicon-96x96.png).*)",
		"/((?!apple-touch-icon.png).*)",
		"/((?!site.webmanifest).*)",
		"/((?!web-app-manifest-192x192.png).*)",
		"/((?!web-app-manifest-512x512.png).*)",
	],
};

export function middleware(request: NextRequest) {
	// Call the dedicated i18n middleware.
	const i18nResponse = i18nMiddleware(request);

	// If the i18n middleware decided to redirect, return its response.
	if (i18nResponse) {
		return i18nResponse;
	}

	return NextResponse.next();
}
