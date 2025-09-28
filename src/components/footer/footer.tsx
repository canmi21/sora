/* src/components/footer/footer.tsx */

import { ValueProvider } from "~/contexts/value";
import { FooterNavigation } from "./navigation";
import { FooterDynamicContent } from "./dynamic";
import { IcpList } from "./icp";
import { Copyright } from "./copyright";
import { LinkGroup, type LinkGroupTranslations } from "./link-group";
import { createServerTranslator } from "~/providers/i18n-server";

/**
 * The main footer component. Fetches all data and translations on the server,
 * then assembles the layout by passing data down to child components.
 */
export default async function Footer() {
	// Make the component async
	const current_year = new Date().getFullYear();

	// Create the server-side translator instance.
	const t = await createServerTranslator();

	// Fetch all required translations in a structured object.
	const linkTranslations: LinkGroupTranslations = {
		about: t("footer.link.about"),
		me: t("footer.link.me"),
		site: t("footer.link.site"),
		project: t("footer.link.project"),
		more: t("footer.link.more"),
		repos: t("footer.link.repos"),
		opensource: t("footer.link.opensource"),
		sponsor: t("footer.link.sponsor"),
		contact: t("footer.link.contact"),
		github: t("footer.link.github"),
		email: t("footer.link.email"),
		status: t("footer.link.status"),
	};

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
						// Pass the pre-translated object as a prop to the client component.
						linkGroupContent={<LinkGroup translations={linkTranslations} />}
						copyrightContent={<Copyright currentYear={current_year} />}
						dynamicContent={<FooterDynamicContent />}
						icpContent={<IcpList />}
					/>
				</div>
			</footer>
		</ValueProvider>
	);
}
