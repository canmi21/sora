/* src/metadata/meta.ts */

import type { Metadata, Viewport } from "next";
import { getRawValue } from "~/api/server";

const STATIC_METADATA = {
	icons: {
		icon: [
			{ url: "/favicon.ico", sizes: "any" },
			{ url: "/favicon.svg", type: "image/svg+xml" },
			{ url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
		],
		apple: "/apple-touch-icon.png",
	},
	manifest: "/site.webmanifest",
	// OG later
};

export async function generateSiteMetadata(): Promise<Metadata> {
	const [title, description] = await Promise.all([
		getRawValue<string>("site.title", "此站点迷路了！"),
		getRawValue<string>("site.description", "致虚无，心を守。"),
	]);

	return {
		...STATIC_METADATA,
		title: `${title} - ${description}`,
		description: description,
	};
}

export const site_viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
		{ media: "(prefers-color-scheme: dark)", color: "#161616" },
	],
};
