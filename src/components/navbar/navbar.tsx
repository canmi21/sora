/* src/components/navbar/navbar.tsx */

import React from "react";
import "~/styles/navbar.css";
import { ValueProvider } from "~/contexts/value";
import { NavbarDynamicContent } from "./dynamic";

/**
 * The main Navbar component.
 * It acts as a Server Component to fetch the site title and description,
 * then renders the dynamic and static parts of the navbar.
 */
export default function Navbar() {
	return (
		// Use ValueProvider to fetch the required keys for the navbar on the server.
		<ValueProvider keysToFetch={["site.navbar.title", "site.description"]}>
			<nav className="navbar w-full h-15 flex items-center justify-between px-12">
				{/* The hardcoded title has been replaced with our new dynamic component. */}
				<NavbarDynamicContent />

				{/* The static navigation links remain unchanged. */}
				<div className="flex items-center space-x-6">
					<a
						href="#"
						className="text-[var(--color-text)] hover:text-[var(--color-subtext)] transition-colors"
					>
						Home
					</a>
					<a
						href="#"
						className="text-[var(--color-text)] hover:text-[var(--color-subtext)] transition-colors"
					>
						About
					</a>
					<a
						href="#"
						className="text-[var(--color-text)] hover:text-[var(--color-subtext)] transition-colors"
					>
						Projects
					</a>
					<a
						href="#"
						className="text-[var(--color-text)] hover:text-[var(--color-subtext)] transition-colors"
					>
						Contact
					</a>
				</div>
			</nav>
		</ValueProvider>
	);
}
