/* src/providers/i18n-server.ts */

import { headers, cookies } from "next/headers";
import path from "path";
import fs from "fs";
import {
	SupportedLocale,
	DEFAULT_LOCALE,
	SUPPORTED_LOCALES,
	TranslationNamespace,
	TranslationValue,
	getLocaleKey,
} from "./i18n";

// Cache for loaded translation files
const translationCache = new Map<string, TranslationNamespace>();

/**
 * Load translation namespace from JSON file
 */
function loadNamespace(namespace: string): TranslationNamespace | null {
	try {
		// Check cache first
		if (translationCache.has(namespace)) {
			return translationCache.get(namespace)!;
		}

		// Load from file system
		const filePath = path.join(
			process.cwd(),
			"src/locales",
			`${namespace}.json`
		);

		if (!fs.existsSync(filePath)) {
			console.warn(`Translation file not found: ${namespace}.json`);
			return null;
		}

		const fileContent = fs.readFileSync(filePath, "utf-8");
		const translations = JSON.parse(fileContent) as TranslationNamespace;

		// Cache the loaded translations
		translationCache.set(namespace, translations);

		return translations;
	} catch (error) {
		console.error(`Error loading translation namespace "${namespace}":`, error);
		return null;
	}
}

/**
 * Get nested value from object using dot notation
 */
function getNestedValue(
	obj: any,
	path: string[]
): TranslationValue | undefined {
	let current = obj;

	for (const key of path) {
		if (current && typeof current === "object" && key in current) {
			current = current[key];
		} else {
			return undefined;
		}
	}

	return current;
}

/**
 * Detect locale from headers and cookies
 */
export async function detectServerLocale(): Promise<SupportedLocale> {
	try {
		const cookieStore = await cookies();
		const headersList = await headers();

		// First check for explicit cookie preference
		const cookieLocale = cookieStore.get("locale")?.value as SupportedLocale;
		if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
			return cookieLocale;
		}

		// Then check Accept-Language header
		const acceptLanguage = headersList.get("accept-language");
		if (acceptLanguage) {
			// Parse Accept-Language header and find best match
			const languages = acceptLanguage
				.split(",")
				.map((lang: string) => lang.trim().split(";")[0])
				.map((lang: string) => lang.replace("_", "-"));

			for (const lang of languages) {
				// Exact match
				if (SUPPORTED_LOCALES.includes(lang as SupportedLocale)) {
					return lang as SupportedLocale;
				}

				// Partial match (e.g., 'en' matches 'en-US')
				const partialMatch = SUPPORTED_LOCALES.find((supported) =>
					supported.startsWith(lang.split("-")[0])
				);
				if (partialMatch) {
					return partialMatch;
				}
			}
		}

		return DEFAULT_LOCALE;
	} catch (error) {
		console.error("Error detecting server locale:", error);
		return DEFAULT_LOCALE;
	}
}

/**
 * Create translation function for server components
 */
export async function createServerTranslator(): Promise<
	(key: string) => string
> {
	const locale = await detectServerLocale();
	const localeKey = getLocaleKey(locale);

	return function t(key: string): string {
		try {
			// Parse the key: namespace.path.to.value
			const parts = key.split(".");
			if (parts.length < 2) {
				console.warn(
					`Invalid translation key format: "${key}". Expected "namespace.path.to.value"`
				);
				return key;
			}

			const namespace = parts[0];
			const valuePath = parts.slice(1);

			// Load the namespace
			const translations = loadNamespace(namespace);
			if (!translations) {
				return key;
			}

			// Get the nested translation value
			const translationValue = getNestedValue(translations, valuePath);
			if (!translationValue || typeof translationValue !== "object") {
				return key;
			}

			// Fallback logic: current locale -> en_US -> raw -> key itself
			const value =
				translationValue[localeKey] ||
				translationValue.en_US ||
				translationValue.raw ||
				key;

			return value;
		} catch (error) {
			console.error(`Error translating key "${key}":`, error);
			return key;
		}
	};
}

/**
 * Get current server locale (for use in layout.tsx)
 */
export async function getServerLocale(): Promise<SupportedLocale> {
	return await detectServerLocale();
}
