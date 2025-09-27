/* src/components/footer/link-group.tsx */

"use client";

import { useValueContext } from "~/contexts/value-client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

/**
 * A Client Component that renders the main group of footer links.
 * It fetches the link URLs dynamically from the ValueContext.
 */
export function LinkGroup() {
	const values = useValueContext();

	// Helper function to safely get a URL from the context
	const getLink = (key: string) => (values.get(key) as string) || "#";
	const getMailLink = (key: string) => `mailto:${values.get(key) as string}`;

	return (
		<div className="flex items-center gap-x-2.5">
			<span className="font-bold inline-flex items-center gap-x-1">
				About
				<ChevronRight className="w-4 h-4" />
			</span>
			<Link
				href={getLink("site.link.me")}
				className="hover:text-[var(--footer-subtext-color)] transition-colors"
			>
				Me
			</Link>
			<Link
				href={getLink("site.link.site")}
				className="hover:text-[var(--footer-subtext-color)] transition-colors"
			>
				The Site
			</Link>
			<Link
				href={getLink("site.link.project")}
				className="hover:text-[var(--footer-subtext-color)] transition-colors"
				target="_blank" // Open external links in a new tab
				rel="noopener noreferrer"
			>
				The Project
			</Link>

			<span className="font-bold inline-flex items-center gap-x-1">
				More
				<ChevronRight className="w-4 h-4" />
			</span>
			<Link
				href={getLink("site.link.repos")}
				className="hover:text-[var(--footer-subtext-color)] transition-colors"
				target="_blank"
				rel="noopener noreferrer"
			>
				Repos
			</Link>
			<Link
				href={getLink("site.link.opensource")}
				className="hover:text-[var(--footer-subtext-color)] transition-colors"
				target="_blank"
				rel="noopener noreferrer"
			>
				OpenSource
			</Link>
			<Link
				href={getLink("site.link.sponsor")}
				className="hover:text-[var(--footer-subtext-color)] transition-colors"
				target="_blank"
				rel="noopener noreferrer"
			>
				Sponsor
			</Link>

			<span className="font-bold inline-flex items-center gap-x-1">
				Contact
				<ChevronRight className="w-4 h-4" />
			</span>
			<Link
				href={getLink("site.link.git")}
				className="hover:text-[var(--footer-subtext-color)] transition-colors"
				target="_blank"
				rel="noopener noreferrer"
			>
				Github
			</Link>
			<a
				href={getMailLink("site.link.email")}
				className="hover:text-[var(--footer-subtext-color)] transition-colors"
			>
				Email
			</a>
			<Link
				href={getLink("site.link.status")}
				className="hover:text-[var(--footer-subtext-color)] transition-colors"
				target="_blank"
				rel="noopener noreferrer"
			>
				Status
			</Link>
		</div>
	);
}
