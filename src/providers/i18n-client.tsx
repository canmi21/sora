/* src/providers/i18n-client.tsx */

"use client";

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
	useCallback,
} from "react";
import {
	SupportedLocale,
	I18nContextType,
	TranslationNamespace,
	TranslationValue,
	getLocaleKey,
} from "./i18n";
import { setLocaleInStorage } from "./i18n-local";

// --- Module-level state and caches (shared across all hook instances) ---
const clientTranslationCache = new Map<string, TranslationNamespace>();
const namespaceLoadingState = new Map<string, boolean>();
const loadingCallbacks = new Map<string, (() => void)[]>();

// Create the i18n context
const I18nContext = createContext<I18nContextType | undefined>(undefined);

/**
 * Loads a translation namespace from the API endpoint.
 * This function should ONLY run in the browser.
 */
async function loadClientNamespace(
	namespace: string
): Promise<TranslationNamespace | null> {
	// Guard against being called on the server.
	if (typeof window === "undefined") {
		return null;
	}
	if (clientTranslationCache.has(namespace)) {
		return clientTranslationCache.get(namespace)!;
	}
	if (namespaceLoadingState.get(namespace)) {
		return null; // A fetch is already in progress.
	}

	try {
		namespaceLoadingState.set(namespace, true);
		const response = await fetch(`/i18n/${namespace}`);
		if (!response.ok) {
			console.warn(`Translation API failed for namespace: ${namespace}`);
			namespaceLoadingState.set(namespace, false);
			return null;
		}
		const translations = (await response.json()) as TranslationNamespace;
		clientTranslationCache.set(namespace, translations);
		namespaceLoadingState.set(namespace, false);

		// Notify all subscribed components that the data is ready.
		const callbacks = loadingCallbacks.get(namespace) || [];
		callbacks.forEach((callback) => callback());
		loadingCallbacks.delete(namespace); // Clean up callbacks.

		return translations;
	} catch (error) {
		console.error(
			`Error loading client translation namespace "${namespace}":`,
			error
		);
		namespaceLoadingState.set(namespace, false);
		return null;
	}
}

/**
 * Retrieves a nested value from an object using a dot-separated path.
 */
function getNestedValue(
	obj: unknown,
	path: string[]
): TranslationValue | undefined {
	let current = obj;
	for (const key of path) {
		if (current && typeof current === "object" && key in current) {
			current = (current as Record<string, unknown>)[key];
		} else {
			return undefined;
		}
	}
	return current as TranslationValue;
}

/**
 * I18n Provider Component for the client side.
 */
interface I18nProviderProps {
	children: ReactNode;
	initialLocale: SupportedLocale;
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
	const [locale, setLocale] = useState<SupportedLocale>(initialLocale);

	useEffect(() => {
		setLocaleInStorage(initialLocale);
		if (locale !== initialLocale) {
			setLocale(initialLocale);
		}
	}, [initialLocale, locale]);

	// Pre-load common namespaces on initial client mount.
	useEffect(() => {
		loadClientNamespace("footer");
	}, []);

	const handleSetLocale = (newLocale: SupportedLocale) => {
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
 * Hook to access the i18n context.
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
	const [, forceUpdate] = useState({});

	// Create a stable callback function for re-rendering.
	const triggerUpdate = useCallback(() => forceUpdate({}), []);

	const t = async (key: string): Promise<string> => {
		try {
			const parts = key.split(".");
			if (parts.length < 2) return key;

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

			// If translations are already cached, return the value immediately.
			if (translations) {
				const translationValue = getNestedValue(translations, valuePath);
				if (!translationValue || typeof translationValue !== "object")
					return key;
				return (
					translationValue[localeKey] ||
					translationValue.en_US ||
					translationValue.raw ||
					key
				);
			}

			// --- SSR SAFETY GUARD ---
			// If we are on the server, the cache will be empty.
			// Return the key directly to avoid trying to fetch.
			if (typeof window === "undefined") {
				return key;
			}
			// --- END GUARD ---

			// Subscribe this component to re-render when the namespace is loaded.
			const callbacks = loadingCallbacks.get(namespace) || [];
			if (!callbacks.includes(triggerUpdate)) {
				callbacks.push(triggerUpdate);
				loadingCallbacks.set(namespace, callbacks);
			}

			// Trigger the namespace load if it's not already in progress.
			if (!namespaceLoadingState.get(namespace)) {
				loadClientNamespace(namespace);
			}

			// Return the key for the initial render to prevent UI flickering.
			return key;
		} catch {
			return key;
		}
	};

	return { t, tSync, locale };
}
