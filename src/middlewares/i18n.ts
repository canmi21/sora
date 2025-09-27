/* src/middlewares/i18n.ts */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SUPPORTED_LOCALES } from "~/providers/i18n";

/**
 * The i18n middleware.
 * It checks for a `lang` query parameter to override the current locale.
 * If a valid `lang` is found, it sets the `locale` cookie and redirects
 * to the same URL without the `lang` parameter for a clean user experience.
 */
export function i18nMiddleware(request: NextRequest): NextResponse | null {
	const { nextUrl } = request;
	const lang = nextUrl.searchParams.get("lang");

	// Check if a 'lang' parameter exists and is a supported locale.
	if (lang && SUPPORTED_LOCALES.includes(lang as any)) {
		// Create a response to set the cookie. We will redirect, so this can be a simple response.
		// Note: We don't need NextResponse.next() here; we can use the main response object for redirection.
		const redirectUrl = new URL(request.nextUrl);
		redirectUrl.searchParams.delete("lang");

		const response = NextResponse.redirect(redirectUrl, 307);

		// Set the locale cookie on the redirect response.
		response.cookies.set("locale", lang, {
			path: "/",
			maxAge: 31536000, // 1 year
			sameSite: "strict",
		});

		//Return the response which contains both the redirect and the cookie.
		return response;
	}

	// If no valid 'lang' parameter is found, do nothing and pass to the next middleware or request handler.
	return null;
}
