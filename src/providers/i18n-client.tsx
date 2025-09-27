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
import { initializeAndSyncLocale } from "./i18n-local";

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
 * It receives the server-detected locale and synchronizes with localStorage.
 */
interface I18nProviderProps {
	children: ReactNode;
	initialLocale: SupportedLocale; // This prop is now mandatory and comes from the server.
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
	const [locale, setLocale] = useState<SupportedLocale>(initialLocale);

	// On the very first client-side mount, this effect runs.
	// It initializes localStorage if it's a first-time user, or it reads the
	// existing value from localStorage and ensures the cookie is up-to-date.
	useEffect(() => {
		const clientPreferredLocale = initializeAndSyncLocale();
		// If the localStorage locale is different from the server-rendered one
		// (e.g., user changed language on another tab), update the state.
		if (clientPreferredLocale !== locale) {
			setLocale(clientPreferredLocale);
		}
	}, []); // Empty dependency array ensures this runs only once on mount.

	// This function will be called by a language switcher UI to change the locale.
	const handleSetLocale = (newLocale: SupportedLocale) => {
		setLocale(newLocale);
		// Update both localStorage and the cookie when the user makes a change.
		// Note: The page will need a reload to get new server-rendered content in the new language.
		// A language switcher can handle this by doing `window.location.reload()`.
		localStorage.setItem("@sora/locale", newLocale);
		document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=Strict`;
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
