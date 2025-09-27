/* src/components/footer/link-group.tsx */

"use client";

import { useValueContext } from "~/contexts/value-client";
import { useTranslation } from "~/providers/i18n-client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

/**
 * A Client Component that renders the main group of footer links.
 * It fetches link URLs dynamically from the ValueContext and
 * link text from the i18n context.
 */
export function LinkGroup() {
	const values = useValueContext();
	const { tSync, t } = useTranslation();

	// Preload footer translations on component mount
	useEffect(() => {
		// Preload the footer namespace by calling t() once
		t("footer.link.about");
	}, [t]);

	// These helpers will now work correctly on the `values` Map.
	const getLink = (key: string) => (values.get(key) as string) || "#";
	const getMailLink = (key: string) => `mailto:${values.get(key) as string}`;

	return (
		<div className="flex items-center gap-x-2.5">
			<span className="font-bold inline-flex items-center gap-x-1">
				{tSync("footer.link.about")}
				<ChevronRight className="w-4 h-4" />
			</span>
			<Link
				href={getLink("site.link.me")}
				className="hover:text-[var(--footer-subtext-color)] transition-colors"
			>
				{tSync("footer.link.me")}
			</Link>
			<Link
				href={getLink("site.link.site")}
				className="hover:text-[var(--footer-subtext-color)] transition-colors"
			>
				{tSync("footer.link.site")}
			</Link>
			<Link
				href={getLink("site.link.project")}
				className="hover:text-[var(--footer-subtext-color)] transition-colors"
				target="_blank"
				rel="noopener noreferrer"
			>
				{tSync("footer.link.project")}
			</Link>

			<span className="font-bold inline-flex items-center gap-x-1 ml-2.5">
				{tSync("footer.link.more")}
				<ChevronRight className="w-4 h-4" />
			</span>
			<Link
				href={getLink("site.link.repos")}
				className="hover:text-[var(--footer-subtext-color)] transition-colors"
				target="_blank"
				rel="noopener noreferrer"
			>
				{tSync("footer.link.repos")}
			</Link>
			<Link
				href={getLink("site.link.opensource")}
				className="hover:text-[var(--footer-subtext-color)] transition-colors"
				target="_blank"
				rel="noopener noreferrer"
			>
				{tSync("footer.link.opensource")}
			</Link>
			<Link
				href={getLink("site.link.sponsor")}
				className="hover:text-[var(--footer-subtext-color)] transition-colors"
				target="_blank"
				rel="noopener noreferrer"
			>
				{tSync("footer.link.sponsor")}
			</Link>

			<span className="font-bold inline-flex items-center gap-x-1 ml-2.5">
				{tSync("footer.link.contact")}
				<ChevronRight className="w-4 h-4" />
			</span>
			<Link
				href={getLink("site.link.git")}
				className="hover:text-[var(--footer-subtext-color)] transition-colors"
				target="_blank"
				rel="noopener noreferrer"
			>
				{tSync("footer.link.github")}
			</Link>
			<a
				href={getMailLink("site.link.email")}
				className="hover:text-[var(--footer-subtext-color)] transition-colors"
			>
				{tSync("footer.link.email")}
			</a>
			<Link
				href={getLink("site.link.status")}
				className="hover:text-[var(--footer-subtext-color)] transition-colors"
				target="_blank"
				rel="noopener noreferrer"
			>
				{tSync("footer.link.status")}
			</Link>
		</div>
	);
}
