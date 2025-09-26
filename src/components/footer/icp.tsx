/* src/components/footer/icp.tsx */

"use client";

import { useValueContext } from "~/contexts/value-client";
import { Fragment } from "react";

// Define a type for the expected ICP data structure for better type safety.
type IcpItem = {
	text: string;
	url: string;
};

/**
 * A Client Component that renders the dynamic list of ICP records.
 * It gracefully handles cases where the data is missing or not an array.
 */
export function IcpList() {
	const values = useValueContext();
	const icpData = values.get("site.icp");

	// Type guard to ensure the data is a non-empty array before we try to render it.
	if (!Array.isArray(icpData) || icpData.length === 0) {
		// As requested, fallback to rendering nothing if data is missing or invalid.
		return null;
	}

	// If we are rendering the list, wrap everything in a Fragment.
	return (
		<>
			<span className="text-xs text-[var(--footer-subtext-color)]">|</span>

			{(icpData as IcpItem[]).map((icp, index) => (
				<Fragment key={icp.text}>
					{index > 0 && (
						<span className="text-xs text-[var(--footer-subtext-color)]">
							|
						</span>
					)}
					<a
						href={icp.url}
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-[var(--footer-subtext-color)] transition-colors"
					>
						{icp.text}
					</a>
				</Fragment>
			))}
		</>
	);
}
