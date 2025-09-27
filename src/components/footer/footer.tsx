/* src/components/footer/footer.tsx */

import { ValueProvider } from "~/contexts/value";
import { FooterNavigation } from "./navigation";
import { FooterDynamicContent } from "./dynamic";
import { IcpList } from "./icp";
import { Copyright } from "./copyright";
import { LinkGroup } from "./link-group";

/**
 * The main footer component. Fetches all data and assembles the layout.
 */
export default function Footer() {
	const current_year = new Date().getFullYear();

	return (
		<ValueProvider
			keysToFetch={[
				"owner.quote",
				"site.icp",
				"owner.name",
				"site.inception",
				"site.link.me",
				"site.link.site",
				"site.link.project",
				"site.link.repos",
				"site.link.opensource",
				"site.link.sponsor",
				"site.link.git",
				"site.link.email",
				"site.link.status",
			]}
		>
			<footer className="site-footer w-full border-t border-[var(--footer-border-color)] bg-[var(--footer-background)]">
				<div className="max-w-7xl mx-auto px-18 relative py-6.5">
					<FooterNavigation
						linkGroupContent={<LinkGroup />}
						copyrightContent={<Copyright currentYear={current_year} />}
						dynamicContent={<FooterDynamicContent />}
						icpContent={<IcpList />}
					/>
				</div>
			</footer>
		</ValueProvider>
	);
}
