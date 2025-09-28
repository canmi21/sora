/* src/contexts/value.tsx */

import { ReactNode } from "react";
import { ValueClientProvider, ValueContextType } from "./value-client";

// --- Server-Side Only Functions and Logic ---
const BASE_URL = process.env.NEXT_PUBLIC_API || "https://api.canmi.net";

function keyToPath(key: string): string {
	return key.replace(/\./g, "/");
}

/**
 * This is a pure React Server Component responsible for fetching and caching the values.
 * It fetches all specified keys in parallel and provides them to the client-side context provider.
 */
export async function ValueProvider({
	children,
	keysToFetch,
}: {
	children: ReactNode;
	keysToFetch: string[];
}) {
	const valueMap: ValueContextType = new Map();

	// Fetch all keys in parallel for maximum performance.
	const promises = keysToFetch.map(async (key) => {
		try {
			const path = keyToPath(key);
			const url = `${BASE_URL}/v1/config/${path}`;

			// Use the Next.js extended fetch for server-side caching with a 60-second revalidation window.
			const res = await fetch(url, {
				next: {
					revalidate: 300,
				},
			});

			if (!res.ok) {
				console.error(
					`Failed to fetch key "${key}": HTTP status ${res.status}`
				);
				return null;
			}

			const jsonResponse = await res.json();

			if (jsonResponse.status === "success" && jsonResponse.data) {
				let finalValue = jsonResponse.data.value;
				if (jsonResponse.data.type === "base64") {
					try {
						// Use Buffer for safe base64 decoding on the server.
						finalValue = Buffer.from(
							jsonResponse.data.value,
							"base64"
						).toString("utf-8");
					} catch {
						console.error(`Failed to decode base64 for key "${key}"`);
						return null;
					}
				}
				return { key, value: finalValue };
			} else {
				console.error(
					`API error for key "${key}":`,
					jsonResponse.message || "Unknown error"
				);
				return null;
			}
		} catch (error) {
			console.error(`Network or parsing error for key "${key}":`, error);
			return null;
		}
	});

	const results = await Promise.all(promises);

	for (const result of results) {
		if (result) {
			valueMap.set(result.key, result.value);
		}
	}

	// Render the Client Provider, passing the server-fetched data as a prop.
	return <ValueClientProvider value={valueMap}>{children}</ValueClientProvider>;
}
