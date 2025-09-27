/* src/components/footer/navigation.tsx */

import type { ReactNode } from "react";
import { Rss, Map, Send, ChevronRight } from "lucide-react";

/**
 * A pure Server Component that renders the static parts of the footer layout.
 * It accepts props to slot in dynamic elements.
 */
export function FooterNavigation({
	copyrightContent,
	dynamicContent,
	icpContent,
}: {
	copyrightContent: ReactNode;
	dynamicContent: ReactNode;
	icpContent: ReactNode;
}) {
	return (
		<div className="flex flex-col items-start gap-y-4 text-sm text-[var(--footer-text-color)]">
			{/* --- Group 1: About Links (Category titles are now bold with icons) --- */}
			<div className="flex items-center gap-x-2.5">
				<span className="font-bold inline-flex items-center gap-x-1">
					About
					<ChevronRight className="w-4 h-4" />
				</span>
				<a
					href="#"
					className="hover:text-[var(--footer-subtext-color)] transition-colors"
				>
					Me
				</a>
				<a
					href="#"
					className="hover:text-[var(--footer-subtext-color)] transition-colors"
				>
					The Site
				</a>
				<a
					href="#"
					className="hover:text-[var(--footer-subtext-color)] transition-colors"
				>
					The Project
				</a>
				<span className="font-bold inline-flex items-center gap-x-1">
					More
					<ChevronRight className="w-4 h-4" />
				</span>
				<span>Repos</span>
				<span>OpenSource</span>
				<span>Sponsor</span>
				<span className="font-bold inline-flex items-center gap-x-1">
					Contact
					<ChevronRight className="w-4 h-4" />
				</span>
				<span>Github</span>
				<span>Email</span>
				<span>Status</span>
			</div>

			{/* --- Group 2: Site Status, Copyright, and Legal --- */}
			<div className="flex flex-col items-start gap-y-2">
				{/* --- Row 2 (MODIFIED) --- */}
				<div className="flex flex-wrap justify-start items-center gap-x-1.5 gap-y-1">
					{copyrightContent}
					<span className="hidden sm-inline text-xs text-[var(--footer-subtext-color)]">
						|
					</span>
					<a
						href="/feed.xml"
						className="inline-flex items-center gap-x-1 hover:text-[var(--footer-subtext-color)] transition-colors"
					>
						<Rss className="w-3 h-3" />
						<span>RSS</span>
					</a>
					<span className="hidden sm-inline text-xs text-[var(--footer-subtext-color)]">
						|
					</span>
					<a
						href="/sitemap.xml"
						className="inline-flex items-center gap-x-1 hover:text-[var(--footer-subtext-color)] transition-colors"
					>
						<Map className="w-3 h-3" />
						<span>Sitemap</span>
					</a>
					<span className="hidden sm-inline text-xs text-[var(--footer-subtext-color)]">
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

				{/* --- Row 3 (remains unchanged) --- */}
				<div className="flex flex-wrap justify-start items-center gap-x-1.5">
					<span>Powered by Sora & Shadow.</span>
					{icpContent}
				</div>
			</div>
		</div>
	);
}
