/* src/components/footer/icp.tsx */

"use client";

import { useValueContext } from "~/contexts/value-client";
import { useI18n } from "~/providers/i18n-client";
import type { SupportedLocale } from "~/providers/i18n";
import { Fragment } from "react";

/**
 * Defines the shape of the ICP data from the backend, now including the 'visible' array.
 */
type IcpItem = {
	text: string;
	url: string;
	visible: SupportedLocale[];
};

/**
 * A Client Component that renders a locale-aware list of ICP records.
 * It filters the list based on the current language before displaying it.
 */
export function IcpList() {
	const values = useValueContext();
	const { locale } = useI18n(); // Get the current locale (e.g., 'zh-CN', 'en-US')
	const allIcpData = values.get("site.icp");

	// First, perform the basic type guard.
	if (!Array.isArray(allIcpData) || allIcpData.length === 0) {
		return null;
	}

	// Filter the data based on the current locale
	const visibleIcpData = (allIcpData as IcpItem[]).filter((item) =>
		item.visible.includes(locale)
	);

	// If, after filtering, there are no items to display for the current locale, render nothing.
	if (visibleIcpData.length === 0) {
		return null;
	}

	// If we have items to render, proceed as before but with the filtered list.
	return (
		<>
			<span className="text-xs text-[var(--footer-subtext-color)]">|</span>

			{visibleIcpData.map((icp, index) => (
				<Fragment key={icp.text}>
					{/* Add a separator before every item except the first one. */}
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
