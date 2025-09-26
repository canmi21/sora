/* src/components/navbar/navbar.tsx */

import React from "react";
import "~/styles/navbar.css";

export default function Navbar() {
	return (
		<nav className="navbar w-full h-15 flex items-center justify-between px-12">
			<div className="flex flex-col items-start">
				<h1 className="text-lg font-bold text-[var(--color-text)]">
					觉授の貓窝
				</h1>
				<p className="text-xs text-[var(--color-subtext)] mt-0.5">
					致虚无，心を守。
				</p>
			</div>
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
	);
}
