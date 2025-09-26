/* src/components/footer/footer.tsx */

import { ValueProvider } from "~/contexts/value";
import { FooterNavigation } from "./navigation";
import { FooterDynamicContent } from "./dynamic";
import { IcpList } from "./icp";
import { Copyright } from "./copyright";

/**
 * The main footer component.
 * It fetches all required data and composes the layout by passing the dynamic
 * client components into their designated props on the static layout component.
 */
export default function Footer() {
	// The server retrieves the year to avoid errors in the wayback machine.
	const current_year = new Date().getFullYear();

	return (
		<ValueProvider
			keysToFetch={["owner.quote", "site.icp", "owner.name", "site.inception"]}
		>
			<footer className="site-footer w-full border-t border-[var(--footer-border-color)] bg-[var(--footer-background)]">
				<div className="max-w-7xl mx-auto px-18 relative py-6.5">
					<FooterNavigation
						copyrightContent={<Copyright currentYear={current_year} />}
						dynamicContent={<FooterDynamicContent />}
						icpContent={<IcpList />}
					/>
				</div>
			</footer>
		</ValueProvider>
	);
}
