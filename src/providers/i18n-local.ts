/* src/providers/i18n-local.ts */

import { SupportedLocale, SUPPORTED_LOCALES, DEFAULT_LOCALE } from "./i18n";
import { getItemWithDefault, setItem } from "~/lib/localstorage";

export const LOCAL_STORAGE_KEY = "@sora/locale";

/**
 * Gets the preferred locale from localStorage using the generic helper.
 * Returns null if no valid locale is found.
 */
function getLocaleFromStorage(): SupportedLocale | null {
	// Use the generic `getItemWithDefault`. It safely handles SSR and parsing.
	// We provide `null` as the default, so if nothing is stored, we get null back.
	const storedLocale = getItemWithDefault<SupportedLocale | null>(
		LOCAL_STORAGE_KEY,
		null
	);

	// Perform the i18n-specific validation.
	if (storedLocale && SUPPORTED_LOCALES.includes(storedLocale)) {
		return storedLocale;
	}

	return null;
}

/**
 * Sets the preferred locale in localStorage using the generic helper.
 */
export function setLocaleInStorage(locale: SupportedLocale): void {
	// Use the generic `setItem`. It safely handles SSR and JSON stringifying.
	setItem(LOCAL_STORAGE_KEY, locale);
}

/**
 * Detects the initial locale for a first-time user.
 * The order of detection is:
 * 1. Browser's `navigator.language` (full or partial match).
 * 2. The default locale.
 */
function detectInitialBrowserLocale(): SupportedLocale {
	try {
		const browserLang = navigator.language.replace("_", "-");

		if (SUPPORTED_LOCALES.includes(browserLang as SupportedLocale)) {
			return browserLang as SupportedLocale;
		}

		const partialMatch = SUPPORTED_LOCALES.find((supported) =>
			supported.startsWith(browserLang.split("-")[0])
		);
		if (partialMatch) {
			return partialMatch;
		}

		return DEFAULT_LOCALE;
	} catch (error) {
		console.error("Error detecting browser locale:", error);
		return DEFAULT_LOCALE;
	}
}

/**
 * Initializes the locale in localStorage on the client.
 * If no locale is set, it detects the best one from the browser and stores it.
 * It then syncs this value to a cookie to keep the server informed.
 */
export function initializeAndSyncLocale(): SupportedLocale {
	// This high-level orchestration logic remains the same,
	// but it now calls the refactored, safer functions.
	let currentLocale = getLocaleFromStorage();

	if (!currentLocale) {
		currentLocale = detectInitialBrowserLocale();
		setLocaleInStorage(currentLocale);
	}

	document.cookie = `locale=${currentLocale}; path=/; max-age=31536000; SameSite=Strict`;

	return currentLocale;
}
