/* src/app/i18n/[namespace]/route.ts */

import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { TranslationNamespace } from "~/providers/i18n";

/**
 * Creates a standardized JSON error response.
 *
 * @param message The error message.
 * @param status The HTTP status code.
 * @returns A NextResponse object.
 */
function createErrorResponse(message: string, status: number): NextResponse {
	return NextResponse.json(
		{
			status: "error",
			message: message,
		},
		{ status: status }
	);
}

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ namespace: string }> }
) {
	try {
		// Await params before accessing its properties
		const { namespace } = await params;

		// Validate namespace parameter
		if (!namespace || typeof namespace !== "string") {
			return createErrorResponse("Invalid namespace parameter", 400);
		}

		// Security: only allow alphanumeric characters and hyphens in namespace
		if (!/^[a-zA-Z0-9-_]+$/.test(namespace)) {
			return createErrorResponse("Invalid namespace format", 400);
		}

		// Load translation file
		const filePath = path.join(
			process.cwd(),
			"src/locales",
			`${namespace}.json`
		);

		if (!fs.existsSync(filePath)) {
			return createErrorResponse("Translation namespace not found", 404);
		}

		const fileContent = fs.readFileSync(filePath, "utf-8");
		const translations = JSON.parse(fileContent) as TranslationNamespace;

		// On success, return the raw translation object directly, as before.
		return NextResponse.json(translations, {
			headers: {
				"Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error(`Error serving translation namespace:`, error);
		// Use the helper for internal server errors as well.
		return createErrorResponse("Internal server error", 500);
	}
}
