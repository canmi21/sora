/* src/components/navbar/navbar.tsx */

import React from "react";
import "~/styles/navbar.css";
import { ValueProvider } from "~/contexts/value";
import { NavbarDynamicContent } from "./dynamic";
import { NavLinks } from "./nav-links";

/**
 * The main Navbar component.
 * It acts as a Server Component to fetch the site title and description,
 * then renders the dynamic and static parts of the navbar.
 */
export default function Navbar() {
	return (
		// Use ValueProvider to fetch the required keys for the navbar on the server.
		<ValueProvider
			keysToFetch={["site.navbar.title", "site.navbar.description"]}
		>
			<nav className="navbar w-full h-15 flex items-center justify-between px-12">
				<NavbarDynamicContent />
				<NavLinks />
			</nav>
		</ValueProvider>
	);
}
