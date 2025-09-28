/* src/components/footer/navigation.tsx */

import type { ReactNode } from "react";
import { Rss, Map, Send, Heart } from "lucide-react";
import { createServerTranslator } from "~/providers/i18n-server";

/**
 * A pure Server Component that renders the static parts of the footer layout.
 * It now fetches its own translations for static text.
 */
export async function FooterNavigation({
	linkGroupContent,
	copyrightContent,
	dynamicContent,
	icpContent,
}: {
	linkGroupContent: ReactNode;
	copyrightContent: ReactNode;
	dynamicContent: ReactNode;
	icpContent: ReactNode;
}) {
	const t = await createServerTranslator();

	return (
		<div className="flex flex-col items-start gap-y-4 text-sm text-[var(--footer-text-color)]">
			{/* --- Group 1: This is now fully dynamic via props --- */}
			{linkGroupContent}

			{/* --- Group 2: Site Status, Copyright, and Legal --- */}
			<div className="flex flex-col items-start gap-y-2">
				{/* --- Row 2 --- */}
				<div className="flex flex-wrap justify-start items-center gap-x-1.5 gap-y-1">
					{copyrightContent}
					<span className="hidden sm:inline text-xs text-[var(--footer-subtext-color)]">
						|
					</span>
					<a
						href="/feed.xml"
						className="inline-flex items-center gap-x-1 hover:text-[var(--footer-subtext-color)] transition-colors"
					>
						<Rss className="w-3 h-3" />
						<span>RSS</span>
					</a>
					<span className="hidden sm:inline text-xs text-[var(--footer-subtext-color)]">
						|
					</span>
					<a
						href="/sitemap.xml"
						className="inline-flex items-center gap-x-1 hover:text-[var(--footer-subtext-color)] transition-colors"
					>
						<Map className="w-3 h-3" />
						<span>{t("footer.button.sitemap")}</span>
					</a>
					<span className="hidden sm:inline text-xs text-[var(--footer-subtext-color)]">
						|
					</span>
					<a
						href="#"
						className="inline-flex items-center gap-x-1 hover:text-[var(--footer-subtext-color)] transition-colors"
					>
						<Send className="w-3 h-3" />
						<span>{t("footer.button.subscribe")}</span>
					</a>
					{dynamicContent}
				</div>

				{/* --- Row 3 --- */}
				<div className="flex flex-wrap justify-start items-center gap-x-1.5">
					<span className="inline-flex items-center gap-x-1">
						Powered by{" "}
						<a
							href="https://github.com/canmi21/sora"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-[var(--footer-subtext-color)] transition-colors"
						>
							Sora
						</a>
						<Heart className="w-3 h-3" />
						<a
							href="https://github.com/canmi21/shadow"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-[var(--footer-subtext-color)] transition-colors"
						>
							Shadow.
						</a>
						All systems normal.
					</span>
					{icpContent}
				</div>
			</div>
		</div>
	);
}
