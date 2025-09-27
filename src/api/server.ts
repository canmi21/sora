/* src/api/server.ts */

// This file contains helper functions designed to run ONLY on the server.

const BASE_URL = process.env.NEXT_PUBLIC_API || "https://api.canmi.net";

/**
 * A server-side only function to fetch a raw key-value from the backend.
 * It's designed for use in server components and `generateMetadata`.
 * It handles the full API response structure and returns the direct value or a fallback.
 *
 * @param key The dot-separated key to fetch (e.g., "site.title").
 * @param fallback A default value to return if the fetch fails.
 * @returns The fetched value or the fallback.
 */
export async function getRawValue<T>(key: string, fallback: T): Promise<T> {
	try {
		const path = key.replace(/\./g, "/");
		const url = `${BASE_URL}/v1/config/${path}`;

		// Use native fetch, which is automatically cached and deduped by Next.js
		const res = await fetch(url, { next: { revalidate: 1800 } });

		if (!res.ok) {
			return fallback;
		}

		const jsonResponse = await res.json();

		if (jsonResponse.status === "success" && jsonResponse.data?.value) {
			return jsonResponse.data.value;
		}

		return fallback;
	} catch (error) {
		// If any error occurs (network, parsing, etc.), return the fallback.
		return fallback;
	}
}
