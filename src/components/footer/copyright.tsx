/* src/components/footer/copyright.tsx */

"use client";

import Link from "next/link";
import { useValueContext } from "~/contexts/value-client";

/**
 * A Client Component to render the dynamic copyright notice.
 * It receives the current year as a prop to ensure it's calculated on the server.
 */
export function Copyright({ currentYear }: { currentYear: number }) {
	const values = useValueContext();

	// Get dynamic values from the context with sensible fallbacks.
	const inceptionYear = (values.get("site.inception") as number) || 2021;
	const ownerName = (values.get("owner.name") as string) || "Canmi";

	return (
		<span>
			© {inceptionYear}-{currentYear}{" "}
			<Link
				href="/about"
				className="hover:text-[var(--footer-subtext-color)] transition-colors"
			>
				{ownerName}.
			</Link>
		</span>
	);
}
