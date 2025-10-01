/* src/components/navbar/nav-links.tsx */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import type { ComponentType } from "react";
import { History, Album, Scroll, CircleDot, LoaderCircle } from "lucide-react";

// Define the shape of the props received from the server.
interface NavItem {
	href: string;
	icon: string;
	text: string;
}

interface NavLinksProps {
	navItems: NavItem[];
}

// Map the string identifiers to the actual imported icon components.
const iconMap: Record<string, ComponentType<{ className?: string }>> = {
	history: History,
	album: Album,
	scroll: Scroll,
	"circle-dot": CircleDot,
	"loader-circle": LoaderCircle,
};

export function NavLinks({ navItems }: NavLinksProps) {
	const pathname = usePathname();
	const [isHovering, setIsHovering] = useState(false);

	return (
		<div
			className="flex items-center space-x-6"
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
		>
			{navItems.map(({ href, icon, text }) => {
				const isActive = pathname.startsWith(href);
				const IconComponent = iconMap[icon];

				if (!IconComponent) return null;

				return (
					<Link
						key={href}
						href={href}
						className="group relative flex flex-col items-center py-2"
					>
						<div
							className={`flex items-center space-x-2 group-hover:text-[var(--color-subtext)] transition-colors ${
								isActive
									? "text-[var(--theme-color-indicator)]"
									: "text-[var(--color-text)]"
							}`}
						>
							<IconComponent className="h-4 w-4" />
							<span>{text}</span>
						</div>

						{isActive && (
							<motion.div
								layoutId="active-nav-indicator"
								className={`
									absolute bottom-0
									${
										isHovering
											? "w-full h-0.5 rounded-none bg-[var(--navbar-indicator-color)]"
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
		</div>
	);
}
