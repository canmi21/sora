/* src/providers/i18n.ts */

export type SupportedLocale =
	| "und"
	| "en-US"
	| "en-GB"
	| "zh-CN"
	| "zh-HK"
	| "es-ES"
	| "fr-FR"
	| "ja-JP";

export const SUPPORTED_LOCALES: SupportedLocale[] = [
	"und", // Original/custom language
	"en-US", // English (US)
	"en-GB", // English (UK)
	"zh-CN", // Chinese (Simplified)
	"zh-HK", // Chinese (Hong Kong)
	"es-ES", // Spanish
	"fr-FR", // French
	"ja-JP", // Japanese
];

export const DEFAULT_LOCALE: SupportedLocale = "en-US";
export const ORIGINAL_LOCALE: SupportedLocale = "und";

// Locale key mapping for JSON files
export const LOCALE_KEYS = {
	und: "raw",
	"en-US": "en_US",
	"en-GB": "en_GB",
	"zh-CN": "zh_CN",
	"zh-HK": "zh_HK",
	"es-ES": "es_ES",
	"fr-FR": "fr_FR",
	"ja-JP": "ja_JP",
} as const;

// Translation value structure in JSON
export interface TranslationValue {
	raw?: string;
	en_US?: string;
	en_GB?: string;
	zh_CN?: string;
	zh_HK?: string;
	es_ES?: string;
	fr_FR?: string;
	ja_JP?: string;
}

// Generic translation namespace structure
export type TranslationNamespace = {
	[key: string]: TranslationValue | TranslationNamespace;
};

// Context for locale management
export interface I18nContextType {
	locale: SupportedLocale;
	setLocale: (locale: SupportedLocale) => void;
}

// Translation function type
export type TranslationFunction = (key: string) => string;

// Helper to get HTML lang attribute
export function getHtmlLang(locale: SupportedLocale): string {
	return locale === "und" ? "und" : locale;
}

// Helper to get locale key for JSON
export function getLocaleKey(locale: SupportedLocale): keyof TranslationValue {
	return LOCALE_KEYS[locale] as keyof TranslationValue;
}
