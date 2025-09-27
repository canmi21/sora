/* src/app/i18n/[namespace]/route.ts */

import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { TranslationNamespace } from "~/providers/i18n";

export async function GET(
	request: NextRequest,
	{ params }: { params: { namespace: string } }
) {
	try {
		const { namespace } = params;

		// Validate namespace parameter
		if (!namespace || typeof namespace !== "string") {
			return NextResponse.json(
				{ error: "Invalid namespace parameter" },
				{ status: 400 }
			);
		}

		// Security: only allow alphanumeric characters and hyphens in namespace
		if (!/^[a-zA-Z0-9-_]+$/.test(namespace)) {
			return NextResponse.json(
				{ error: "Invalid namespace format" },
				{ status: 400 }
			);
		}

		// Load translation file
		const filePath = path.join(
			process.cwd(),
			"src/locales",
			`${namespace}.json`
		);

		if (!fs.existsSync(filePath)) {
			return NextResponse.json(
				{ error: "Translation namespace not found" },
				{ status: 404 }
			);
		}

		const fileContent = fs.readFileSync(filePath, "utf-8");
		const translations = JSON.parse(fileContent) as TranslationNamespace;

		// Set cache headers for better performance
		return NextResponse.json(translations, {
			headers: {
				"Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error(
			`Error serving translation namespace "${params.namespace}":`,
			error
		);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
