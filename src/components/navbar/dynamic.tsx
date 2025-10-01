/* src/components/navbar/dynamic.tsx */

"use client";

import Link from "next/link";
import { useValueContext } from "~/contexts/value-client";

/**
 * A Client Component that renders the dynamic title and description for the navbar.
 * It uses the `useValueContext` hook to access data fetched by its parent.
 */
export function NavbarDynamicContent() {
	const values = useValueContext();

	// Get the dynamic values from the context, providing the specified fallbacks.
	const title = (values.get("site.navbar.title") as string) || "貓窝";
	const description =
		(values.get("site.navbar.description") as string) || "服务器在睡大觉";

	return (
		<Link
			href="/"
			className="flex flex-col items-start hover:opacity-80 transition-opacity"
		>
			<h1 className="text-lg font-bold text-[var(--color-text)]">{title}</h1>
			<p className="text-xs text-[var(--color-subtext)] mt-0.5">
				{description}
			</p>
		</Link>
	);
}
