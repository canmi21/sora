/* src/components/footer/navigation.tsx */

import type { ReactNode } from "react";

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
			{/* --- Group 1: About Links (remains unchanged) --- */}
			<div className="flex items-center gap-x-2.5">
				<span>About &gt;</span>
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
					This Site
				</a>
				<a
					href="#"
					className="hover:text-[var(--footer-subtext-color)] transition-colors"
				>
					This Project
				</a>
				<span>More &gt;</span>
				<span>Repos</span>
				<span>OpenSource</span>
				<span>Sponsor</span>
				<span>Contact &gt;</span>
				<span>Github</span>
				<span>Email</span>
				<span>Status</span>
			</div>

			{/* --- Group 2: Site Status, Copyright, and Legal --- */}
			<div className="flex flex-col items-start gap-y-2">
				{/* --- Row 2 (MODIFIED) --- */}
				<div className="flex flex-wrap justify-start items-center gap-x-1.5 gap-y-1">
					{/* We now render the copyright component passed via props. */}
					{copyrightContent}
					<span className="hidden sm:inline text-xs text-[var(--footer-subtext-color)]">
						|
					</span>
					<a
						href="#"
						className="hover:text-[var(--footer-subtext-color)] transition-colors"
					>
						RSS
					</a>
					<span className="hidden sm:inline text-xs text-[var(--footer-subtext-color)]">
						|
					</span>
					<a
						href="#"
						className="hover:text-[var(--footer-subtext-color)] transition-colors"
					>
						Sitemap
					</a>
					<span className="hidden sm:inline text-xs text-[var(--footer-subtext-color)]">
						|
					</span>
					<a
						href="#"
						className="hover:text-[var(--footer-subtext-color)] transition-colors"
					>
						Subscribe
					</a>
					{dynamicContent}
				</div>

				{/* --- Row 3 (remains unchanged) --- */}
				<div className="flex flex-wrap justify-start items-center gap-x-1.5">
					<span>Powered by Sora & Cloudfaro.</span>
					{icpContent}
				</div>
			</div>
		</div>
	);
}
