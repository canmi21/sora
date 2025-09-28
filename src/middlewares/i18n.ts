/* src/middlewares/i18n.ts */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SUPPORTED_LOCALES, SupportedLocale } from "~/providers/i18n";

/**
 * A map to convert simplified or alternative language codes
 * to the canonical locales used in the application.
 */
const localeMapping: Record<string, SupportedLocale> = {
	en: "en-US", // Default English to en-US
	zh: "zh-CN", // Default Chinese to zh-CN
	es: "es-ES",
	fr: "fr-FR",
	ja: "ja-JP",
	raw: "und",
	default: "und",
	original: "und",
	"en-us": "en-US",
	"en-gb": "en-GB",
	"zh-cn": "zh-CN",
	"zh-hk": "zh-HK",
	"zh-tw": "zh-HK", // Map Traditional Chinese (Taiwan) to Hong Kong locale
	"es-es": "es-ES",
	"fr-fr": "fr-FR",
	"ja-jp": "ja-JP",
};

/**
 * The i18n middleware.
 * It checks for a `lang` query parameter to override the current locale.
 * It supports both canonical locales (e.g., "en-US") and simplified aliases (e.g., "en").
 */
export function i18nMiddleware(request: NextRequest): NextResponse | null {
	const { nextUrl } = request;
	const langParam = nextUrl.searchParams.get("lang");

	if (!langParam) {
		// If no 'lang' parameter exists, do nothing.
		return null;
	}

	// Normalize the lang parameter to lower case for case-insensitive matching.
	const normalizedLang = langParam.toLowerCase();

	// Determine the final locale to set.
	let targetLocale: SupportedLocale | null = null;

	// 1. Check if the parameter is a direct, supported locale (e.g., "en-US").
	if (SUPPORTED_LOCALES.includes(normalizedLang as SupportedLocale)) {
		targetLocale = normalizedLang as SupportedLocale;
	}
	// 2. If not, check if it's a simplified alias in our mapping (e.g., "en").
	else if (localeMapping[normalizedLang]) {
		targetLocale = localeMapping[normalizedLang];
	}

	// If a valid locale was determined (either direct or mapped).
	if (targetLocale) {
		const redirectUrl = new URL(request.nextUrl);
		redirectUrl.searchParams.delete("lang");

		const response = NextResponse.redirect(redirectUrl, 307);

		// Set the cookie with the canonical, supported locale.
		response.cookies.set("locale", targetLocale, {
			path: "/",
			maxAge: 31536000, // 1 year
			sameSite: "strict",
		});

		return response;
	}

	// If the 'lang' parameter is invalid and not in our mapping, we can simply
	// redirect to the clean URL without setting a new cookie.
	const redirectUrl = new URL(request.nextUrl);
	redirectUrl.searchParams.delete("lang");
	return NextResponse.redirect(redirectUrl, 307);
}
