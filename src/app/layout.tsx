/* src/app/layout.tsx */

import "~/styles/tailwindcss.css";
import "~/styles/transitions.css";
import "~/styles/colors.css";
import "~/styles/element.css";
import "~/styles/essential.css";
import type { ReactNode } from "react";
import { generateSiteMetadata, site_viewport } from "~/metadata/meta";
import { AppProvider } from "~/contexts/app";
import { cookies } from "next/headers";
import { getServerLocale } from "~/providers/i18n-server";
import { I18nProvider } from "~/providers/i18n-client";
import { getHtmlLang } from "~/providers/i18n";

export async function generateMetadata() {
	return generateSiteMetadata();
}

export const viewport = site_viewport;

export default async function RootLayout({
	children,
}: {
	children: ReactNode;
}) {
	// Detect the locale on the server for the initial page load (SSR).
	const serverLocale = await getServerLocale();

	// Get the theme from the cookie as before.
	const theme_cookie = (await cookies()).get("@sora/theme");
	const theme = theme_cookie?.value || "system";

	return (
		<html
			lang={getHtmlLang(serverLocale)}
			className={theme === "dark" ? "dark" : ""}
			suppressHydrationWarning
		>
			<head />
			<body className="bg-[var(--color-bg)] text-[var(--color-text)]">
				<I18nProvider initialLocale={serverLocale}>
					<AppProvider>{children}</AppProvider>
				</I18nProvider>
			</body>
		</html>
	);
}
