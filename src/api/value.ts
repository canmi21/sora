/* src/api/value.ts */

import { get, post, put, del as deleteRequest } from "./request";
import type { ClientApiResponse, ClientApiErrorResponse } from "./request";

// --- Type Definitions for the KV API ---

/**
 * The structure of the data returned when fetching a single value.
 * Corresponds to the response from `get_handler`.
 */
export interface GetValueResponse {
	key: string;
	value: any; // Can be a string, number, boolean, object, or array.
	type: "json" | "string" | "base64";
}

/**
 * The structure of the data returned after creating, updating, or deleting a value.
 * Corresponds to the responses from `create_handler`, `update_handler`, and `delete_handler`.
 */
export interface ModifyValueResponse {
	status: "created" | "updated" | "deleted";
	key: string;
}

// --- Helper Function ---

/**
 * Converts a dot-separated key into a URL-friendly path.
 * Example: "site.title" -> "site/title"
 * @param key The dot-separated configuration key.
 * @returns A URL path segment.
 */
function keyToPath(key: string): string {
	return key.replace(/\./g, "/");
}

// --- API Functions ---

/**
 * Fetches a configuration value from the server.
 * If the server returns a 'base64' encoded value, this function automatically decodes it.
 * Corresponds to: GET /v1/config/{*key}
 *
 * @param key The dot-separated key for the value to retrieve (e.g., "site.title").
 * @returns A promise that resolves to a ClientApiResponse containing the value's data.
 */
export async function getValue(
	key: string
): Promise<ClientApiResponse<GetValueResponse>> {
	const path = keyToPath(key);
	const response = await get<GetValueResponse>(`/v1/config/${path}`);

	// If the request was successful and the data was sent as base64, decode it.
	if (response.success && response.data.type === "base64") {
		try {
			// Decode the base64 string. The atob() function is globally available
			// in modern browsers and Node.js/Next.js environments.
			const decodedValue = atob(response.data.value);

			// Return a new response object with the decoded value.
			// We modify the 'type' to 'string' to reflect that the value is no longer encoded.
			return {
				...response,
				data: {
					...response.data,
					value: decodedValue,
					type: "string", // The data is now a decoded string.
				},
			};
		} catch (e) {
			console.error(`Failed to decode base64 value for key "${key}":`, e);
			// If decoding fails, return a structured error response.
			return {
				success: false,
				httpStatus: 500, // Represents an "Internal Client Error"
				message: `Failed to decode a malformed base64 value received from the server for key "${key}".`,
			} as ClientApiErrorResponse;
		}
	}

	// If the response was not successful or not base64, return it as-is.
	return response;
}

/**
 * Creates a new configuration value on the server.
 * Corresponds to: POST /v1/config/{*key}
 *
 * @param key The dot-separated key for the value to create (e.g., "site.new.feature").
 * @param value The data to store. Can be any JSON-serializable value.
 * @returns A promise that resolves to a ClientApiResponse confirming the creation.
 */
export function createValue(
	key: string,
	value: any
): Promise<ClientApiResponse<ModifyValueResponse>> {
	const path = keyToPath(key);
	return post<ModifyValueResponse>(`/v1/config/${path}`, value);
}

/**
 * Updates an existing configuration value on the server.
 * Corresponds to: PUT /v1/config/{*key}
 *
 * @param key The dot-separated key for the value to update (e.g., "site.title").
 * @param value The new data to store. Can be any JSON-serializable value.
 * @returns A promise that resolves to a ClientApiResponse confirming the update.
 */
export function updateValue(
	key: string,
	value: any
): Promise<ClientApiResponse<ModifyValueResponse>> {
	const path = keyToPath(key);
	return put<ModifyValueResponse>(`/v1/config/${path}`, value);
}

/**
 * Deletes a configuration value from the server.
 * Corresponds to: DELETE /v1/config/{*key}
 *
 * @param key The dot-separated key for the value to delete (e.g., "site.old.feature").
 * @returns A promise that resolves to a ClientApiResponse confirming the deletion.
 */
export function deleteValue(
	key: string
): Promise<ClientApiResponse<ModifyValueResponse>> {
	const path = keyToPath(key);
	return deleteRequest<ModifyValueResponse>(`/v1/config/${path}`);
}
