/* src/lib/localstorage.ts */

const isBrowser = typeof window !== "undefined";

/**
 * Retrieves an item from localStorage with a default value.
 * Safe for server-side rendering.
 * @param key The key of the item to retrieve.
 * @param defaultValue The default value to return if the item doesn't exist.
 * @returns The stored item or the default value.
 */
export function getItemWithDefault<T>(key: string, defaultValue: T): T {
	if (!isBrowser) {
		return defaultValue;
	}

	const stored = localStorage.getItem(key);
	if (stored !== null) {
		try {
			return JSON.parse(stored);
		} catch (e) {
			console.error("Error parsing JSON from localStorage", e);
			return defaultValue;
		}
	}

	localStorage.setItem(key, JSON.stringify(defaultValue));
	return defaultValue;
}

/**
 * Sets an item in localStorage.
 * Safe for server-side rendering.
 * @param key The key of the item to set.
 * @param value The value to store.
 */
export function setItem<T>(key: string, value: T): void {
	if (!isBrowser) {
		return;
	}

	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (e) {
		console.error("Error setting item in localStorage", e);
	}
}

/**
 * Removes an item from localStorage.
 * Safe for server-side rendering.
 * @param key The key of the item to remove.
 */
export function removeItem(key: string): void {
	if (!isBrowser) {
		return;
	}
	localStorage.removeItem(key);
}
