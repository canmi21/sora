/* src/components/navbar/navbar.tsx */

import React from "react";
import "~/styles/navbar.css";
import { ValueProvider } from "~/contexts/value";
import { NavbarDynamicContent } from "./dynamic";
import { NavLinks } from "./nav-links";
import { createServerTranslator } from "~/providers/i18n-server";

/**
 * The main Navbar component.
 * It acts as a Server Component to fetch data, translate text,
 * and then pass it to client components for rendering.
 */
export default async function Navbar() {
	const t = await createServerTranslator();

	// Pass serializable icon names (strings) instead of component functions.
	const navItems = [
		{
			href: "/timeline",
			icon: "history", // Pass string identifier
			text: t("navbar.link.timeline"), // Use 'navbar.*' namespace
		},
		{
			href: "/collections",
			icon: "album",
			text: t("navbar.link.collection"),
		},
		{ href: "/notes", icon: "scroll", text: t("navbar.link.notes") },
		{ href: "/plans", icon: "circle-dot", text: t("navbar.link.todo") },
		{ href: "/moments", icon: "loader-circle", text: t("navbar.link.more") },
	];

	return (
		<ValueProvider
			keysToFetch={["site.navbar.title", "site.navbar.description"]}
		>
			<nav className="navbar color w-full h-15 flex items-center justify-between px-12">
				<NavbarDynamicContent />
				<NavLinks navItems={navItems} />
			</nav>
		</ValueProvider>
	);
}
