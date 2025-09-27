/* src/api/request.ts */

/**
 * The base URL for the API.
 * It attempts to read from the NEXT_PUBLIC_API environment variable.
 * If it's not set, it defaults to 'https://api.canmi.net'.
 */
const BASE_URL = process.env.NEXT_PUBLIC_API || "https://api.canmi.net";

// --- Type Definitions for Backend Responses ---

/**
 * Describes the structure of a successful response.
 */
interface BackendSuccessResponse<T> {
	status: "success";
	data: T;
}

/**
 * Describes the structure of an error response.
 */
interface BackendErrorResponse {
	status: "error";
	message: string;
}

/**
 * A union type representing any possible response from the backend.
 */
type BackendResponse<T> = BackendSuccessResponse<T> | BackendErrorResponse;

// --- Type Definitions for the Client-Side API Helper ---

/**
 * The shape of a successful response returned by our request functions.
 * It's easier to check `success: true` than to check for status codes.
 */
export interface ClientApiSuccessResponse<T> {
	success: true;
	httpStatus: number;
	data: T;
}

/**
 * The shape of a failed response returned by our request functions.
 */
export interface ClientApiErrorResponse {
	success: false;
	httpStatus: number;
	message: string;
}

/**
 * The unified response type that our `get`, `post`, etc. functions will return.
 * This allows for easy handling with a simple `if (response.success)` check.
 */
export type ClientApiResponse<T = any> =
	| ClientApiSuccessResponse<T>
	| ClientApiErrorResponse;

/**
 * A generic request function that handles fetch operations, timeouts,
 * and parsing of your specific backend response structure.
 *
 * @param path The API endpoint path.
 * @param options The options for the fetch request.
 * @returns A promise that resolves to a ClientApiResponse object.
 */
async function request<T>(
	path: string,
	options: RequestInit = {}
): Promise<ClientApiResponse<T>> {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

	try {
		const response = await fetch(`${BASE_URL}${path}`, {
			...options,
			signal: controller.signal,
			headers: {
				"Content-Type": "application/json",
				...options.headers,
			},
		});

		clearTimeout(timeoutId);
		const backendResponse = (await response.json()) as BackendResponse<T>;

		if (backendResponse.status === "success") {
			return {
				success: true,
				httpStatus: response.status,
				data: backendResponse.data,
			};
		} else {
			// This handles cases where status is 'error' or the format is unexpected.
			return {
				success: false,
				httpStatus: response.status,
				message: backendResponse.message || "An unknown error occurred.",
			};
		}
	} catch (error) {
		clearTimeout(timeoutId); // Ensure timeout is cleared on other errors too

		if (error instanceof Error && error.name === "AbortError") {
			return {
				success: false,
				httpStatus: 408, // Request Timeout
				message: "Request timed out after 10 seconds.",
			};
		}

		// Handle other errors like network failure, or if response.json() fails
		return {
			success: false,
			httpStatus: 0, // Indicates a client-side or network error
			message:
				error instanceof Error ? error.message : "A network error occurred.",
		};
	}
}

/**
 * Performs a GET request.
 * @param path The API endpoint path.
 * @returns A promise that resolves to a ClientApiResponse object.
 */
export function get<T>(path: string): Promise<ClientApiResponse<T>> {
	return request<T>(path, { method: "GET" });
}

/**
 * Performs a POST request.
 * @param path The API endpoint path.
 * @param json The JSON data to send in the request body.
 * @returns A promise that resolves to a ClientApiResponse object.
 */
export function post<T>(
	path: string,
	json?: any
): Promise<ClientApiResponse<T>> {
	return request<T>(path, {
		method: "POST",
		body: JSON.stringify(json),
	});
}

/**
 * Performs a PUT request.
 * @param path The API endpoint path.
 * @param json The JSON data to send in the request body.
 * @returns A promise that resolves to a ClientApiResponse object.
 */
export function put<T>(
	path: string,
	json?: any
): Promise<ClientApiResponse<T>> {
	return request<T>(path, {
		method: "PUT",
		body: JSON.stringify(json),
	});
}

/**
 * Performs a DELETE request.
 * @param path The API endpoint path.
 * @returns A promise that resolves to a ClientApiResponse object.
 */
export function del<T>(path: string): Promise<ClientApiResponse<T>> {
	return request<T>(path, {
		method: "DELETE",
	});
}

// Exporting 'delete' as 'del' because 'delete' is a reserved keyword.
export { del as delete };
