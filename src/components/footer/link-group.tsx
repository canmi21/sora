/* src/components/footer/link-group.tsx */

"use client";

import { useValueContext } from "~/contexts/value-client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

/**
 * Defines the shape of the pre-translated text passed from the server.
 */
export interface LinkGroupTranslations {
	about: string;
	me: string;
	site: string;
	project: string;
	more: string;
	repos: string;
	opensource: string;
	sponsor: string;
	contact: string;
	github: string;
	email: string;
	status: string;
}

/**
 * A "dumb" Client Component that renders the main group of footer links.
 * It receives all link URLs from context and all translated text via props from its parent Server Component.
 */
export function LinkGroup({
	translations,
}: {
	translations: LinkGroupTranslations;
}) {
	const values = useValueContext();

	const getLink = (key: string) => (values.get(key) as string) || "#";
	const getMailLink = (key: string) => `mailto:${values.get(key) as string}`;

	return (
		<div className="flex items-center gap-x-2.5">
			<span className="font-bold inline-flex items-center gap-x-1">
				{translations.about}
				<ChevronRight className="w-4 h-4" />
			</span>
			<Link
				href={getLink("site.link.me")}
				className="hover:text-[var(--footer-subtext-color)] transition-colors"
			>
				{translations.me}
			</Link>
			<Link
				href={getLink("site.link.site")}
				className="hover:text-[var(--footer-subtext-color)] transition-colors"
			>
				{translations.site}
			</Link>
			<Link
				href={getLink("site.link.project")}
				className="hover:text-[var(--footer-subtext-color)] transition-colors"
				target="_blank"
				rel="noopener noreferrer"
			>
				{translations.project}
			</Link>

			<span className="font-bold inline-flex items-center gap-x-1">
				{translations.more}
				<ChevronRight className="w-4 h-4" />
			</span>
			<Link
				href={getLink("site.link.repos")}
				className="hover:text-[var(--footer-subtext-color)] transition-colors"
				target="_blank"
				rel="noopener noreferrer"
			>
				{translations.repos}
			</Link>
			<Link
				href={getLink("site.link.opensource")}
				className="hover:text-[var(--footer-subtext-color)] transition-colors"
				target="_blank"
				rel="noopener noreferrer"
			>
				{translations.opensource}
			</Link>
			<Link
				href={getLink("site.link.sponsor")}
				className="hover:text-[var(--footer-subtext-color)] transition-colors"
				target="_blank"
				rel="noopener noreferrer"
			>
				{translations.sponsor}
			</Link>

			<span className="font-bold inline-flex items-center gap-x-1">
				{translations.contact}
				<ChevronRight className="w-4 h-4" />
			</span>
			<Link
				href={getLink("site.link.git")}
				className="hover:text-[var(--footer-subtext-color)] transition-colors"
				target="_blank"
				rel="noopener noreferrer"
			>
				{translations.github}
			</Link>
			<a
				href={getMailLink("site.link.email")}
				className="hover:text-[var(--footer-subtext-color)] transition-colors"
			>
				{translations.email}
			</a>
			<Link
				href={getLink("site.link.status")}
				className="hover:text-[var(--footer-subtext-color)] transition-colors"
				target="_blank"
				rel="noopener noreferrer"
			>
				{translations.status}
			</Link>
		</div>
	);
}
