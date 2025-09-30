/* src/components/navbar/nav-links.tsx */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { History, Album, Scroll, CircleDot, LoaderCircle } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
	{ href: "/timeline", Icon: History, text: "Timeline" },
	{ href: "/collections", Icon: Album, text: "Collection" },
	{ href: "/notes", Icon: Scroll, text: "Notes" },
	{ href: "/plans", Icon: CircleDot, text: "Todo" },
];

export function NavLinks() {
	const pathname = usePathname();
	const [isHovering, setIsHovering] = useState(false);

	return (
		<div
			className="flex items-center space-x-6"
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
		>
			{navItems.map(({ href, Icon, text }) => {
				const isActive = pathname.startsWith(href);

				return (
					<Link
						key={href}
						href={href}
						className="group relative flex flex-col items-center py-2"
					>
						<div className="flex items-center space-x-2 text-[var(--color-text)] group-hover:text-[var(--color-subtext)] transition-colors">
							<Icon className="h-4 w-4" />
							<span>{text}</span>
						</div>

						{isActive && (
							<motion.div
								layoutId="active-nav-indicator"
								className={`
									absolute bottom-0
									${
										isHovering
											?
												"w-full h-0.5 rounded-none bg-[var(--navbar-indicator-color)]"
											: "w-1.5 h-1.5 rounded-full bg-[var(--color-subtext)]"
									}
								`}
								transition={{
									type: "spring",
									stiffness: 350,
									damping: 30,
								}}
							/>
						)}
					</Link>
				);
			})}

			<a
				href="#"
				className="flex items-center space-x-2 text-[var(--color-text)] hover:text-[var(--color-subtext)] transition-colors"
			>
				<LoaderCircle className="h-4 w-4" />
				<span>More</span>
			</a>
		</div>
	);
}
