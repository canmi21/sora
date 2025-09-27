/* src/providers/i18n-local.ts */

import { SupportedLocale, SUPPORTED_LOCALES, DEFAULT_LOCALE } from "./i18n";

const LOCAL_STORAGE_KEY = "@sora/locale";

/**
 * Gets the preferred locale from localStorage.
 * Returns null if no valid locale is found.
 */
function getLocaleFromStorage(): SupportedLocale | null {
	try {
		const storedLocale = window.localStorage.getItem(
			LOCAL_STORAGE_KEY
		) as SupportedLocale;
		if (storedLocale && SUPPORTED_LOCALES.includes(storedLocale)) {
			return storedLocale;
		}
		return null;
	} catch (error) {
		console.error("Error reading locale from localStorage:", error);
		return null;
	}
}

/**
 * Sets the preferred locale in localStorage.
 */
function setLocaleInStorage(locale: SupportedLocale): void {
	try {
		window.localStorage.setItem(LOCAL_STORAGE_KEY, locale);
	} catch (error) {
		console.error("Error setting locale in localStorage:", error);
	}
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

		// Check for an exact match (e.g., 'en-US' === 'en-US')
		if (SUPPORTED_LOCALES.includes(browserLang as SupportedLocale)) {
			return browserLang as SupportedLocale;
		}

		// Check for a partial match (e.g., 'en' matches 'en-US')
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
	let currentLocale = getLocaleFromStorage();

	// If it's a user's first visit (no locale in storage), detect from browser.
	if (!currentLocale) {
		currentLocale = detectInitialBrowserLocale();
		setLocaleInStorage(currentLocale);
	}

	// Always ensure the cookie is up-to-date with the localStorage value and refresh its expiry.
	document.cookie = `locale=${currentLocale}; path=/; max-age=31536000; SameSite=Strict`; // 1 year

	return currentLocale;
}
