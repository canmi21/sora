/* src/components/footer/dynamic.tsx */

"use client";

import { useValueContext } from "~/contexts/value-client";
import { ToggleTheme } from "../shared/toggle-theme";

/**
 * A Client Component that renders the dynamic and interactive parts of the footer.
 * It uses the `useValueContext` hook to access data fetched by a parent Server Component.
 */
export function FooterDynamicContent() {
	const values = useValueContext();
	const ownerQuote =
		(values.get("owner.quote") as string) ||
		"The server is busy dreaming of code.";

	return (
		<>
			{/* This renders the dynamic quote value, including its preceding separator */}
			<span className="hidden sm:inline text-xs text-[var(--footer-subtext-color)]">
				|
			</span>
			<span className="mt-1 sm:mt-0">{ownerQuote}</span>

			{/* This renders the interactive theme toggle button */}
			<div className="absolute bottom-6 right-6">
				<ToggleTheme
					trackColor="var(--footer-toggle-track-color)"
					puckColor="var(--footer-toggle-puck-color)"
				/>
			</div>
		</>
	);
}
