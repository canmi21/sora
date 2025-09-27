/* src/components/footer/navigation.tsx */

import type { ReactNode } from "react";
// Heart icon is already imported
import { Rss, Map, Send, Heart } from "lucide-react";

/**
 * A pure Server Component that renders the static parts of the footer layout.
 * It accepts props to slot in all dynamic elements.
 */
export function FooterNavigation({
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
						<span>Sitemap</span>
					</a>
					<span className="hidden sm:inline text-xs text-[var(--footer-subtext-color)]">
						|
					</span>
					<a
						href="#"
						className="inline-flex items-center gap-x-1 hover:text-[var(--footer-subtext-color)] transition-colors"
					>
						<Send className="w-3 h-3" />
						<span>Subscribe</span>
					</a>
					{dynamicContent}
				</div>

				{/* --- Row 3 (MODIFIED) --- */}
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
							Shadow
						</a>
						.
					</span>
					{icpContent}
				</div>
			</div>
		</div>
	);
}
