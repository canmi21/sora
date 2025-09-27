/* src/providers/i18n-client.tsx */

"use client";

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import {
	SupportedLocale,
	I18nContextType,
	TranslationNamespace,
	TranslationValue,
	getLocaleKey,
} from "./i18n";

import { setLocaleInStorage } from "./i18n-local";

// Client-side translation cache
const clientTranslationCache = new Map<string, TranslationNamespace>();

// Create the i18n context
const I18nContext = createContext<I18nContextType | undefined>(undefined);

/**
 * Loads a translation namespace from the API endpoint.
 * Caches the result to avoid redundant network requests.
 */
async function loadClientNamespace(
	namespace: string
): Promise<TranslationNamespace | null> {
	try {
		if (clientTranslationCache.has(namespace)) {
			return clientTranslationCache.get(namespace)!;
		}
		const response = await fetch(`/i18n/${namespace}`);
		if (!response.ok) {
			console.warn(`Translation API failed for namespace: ${namespace}`);
			return null;
		}
		const translations = (await response.json()) as TranslationNamespace;
		clientTranslationCache.set(namespace, translations);
		return translations;
	} catch (error) {
		console.error(
			`Error loading client translation namespace "${namespace}":`,
			error
		);
		return null;
	}
}

/**
 * Retrieves a nested value from an object using a dot-separated path.
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
 * I18n Provider Component for the client side.
 * It receives the server-detected locale and synchronizes it with client-side storage.
 */
interface I18nProviderProps {
	children: ReactNode;
	initialLocale: SupportedLocale;
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
	const [locale, setLocale] = useState<SupportedLocale>(initialLocale);

	// This effect runs whenever the server-provided locale changes.
	useEffect(() => {
		// The `initialLocale` from the server is the source of truth for this page load.
		// Our job on the client is to synchronize our persistent storage (localStorage)
		// and our React state to match this server-provided truth.

		// 1. Persist the server-determined locale to localStorage using the imported function.
		setLocaleInStorage(initialLocale);

		// 2. Ensure the React state also matches this server-determined locale.
		if (locale !== initialLocale) {
			setLocale(initialLocale);
		}
	}, [initialLocale, locale]);

	/**
	 * This function should be called by a UI element (e.g., a language switcher)
	 * to trigger a language change.
	 */
	const handleSetLocale = (newLocale: SupportedLocale) => {
		// To correctly change the language for the entire application, we reload
		// the page with the `?lang` parameter. The middleware handles the rest.
		const currentUrl = new URL(window.location.href);
		currentUrl.searchParams.set("lang", newLocale);
		window.location.href = currentUrl.href;
	};

	return (
		<I18nContext.Provider value={{ locale, setLocale: handleSetLocale }}>
			{children}
		</I18nContext.Provider>
	);
}

/**
 * Hook to access the i18n context (locale and setLocale function).
 */
export function useI18n(): I18nContextType {
	const context = useContext(I18nContext);
	if (!context) {
		throw new Error("useI18n must be used within an I18nProvider");
	}
	return context;
}

/**
 * Hook to get the translation functions (`t` and `tSync`).
 */
export function useTranslation() {
	const { locale } = useI18n();
	const localeKey = getLocaleKey(locale);

	const t = async (key: string): Promise<string> => {
		try {
			const parts = key.split(".");
			if (parts.length < 2) {
				console.warn(`Invalid translation key format: "${key}"`);
				return key;
			}
			const namespace = parts[0];
			const valuePath = parts.slice(1);
			const translations = await loadClientNamespace(namespace);
			if (!translations) return key;

			const translationValue = getNestedValue(translations, valuePath);
			if (!translationValue || typeof translationValue !== "object") return key;

			return (
				translationValue[localeKey] ||
				translationValue.en_US ||
				translationValue.raw ||
				key
			);
		} catch (error) {
			console.error(`Error translating key "${key}":`, error);
			return key;
		}
	};

	const tSync = (key: string): string => {
		try {
			const parts = key.split(".");
			if (parts.length < 2) return key;

			const namespace = parts[0];
			const valuePath = parts.slice(1);
			const translations = clientTranslationCache.get(namespace);
			if (!translations) return key;

			const translationValue = getNestedValue(translations, valuePath);
			if (!translationValue || typeof translationValue !== "object") return key;

			return (
				translationValue[localeKey] ||
				translationValue.en_US ||
				translationValue.raw ||
				key
			);
		} catch (error) {
			return key;
		}
	};

	return { t, tSync, locale };
}
