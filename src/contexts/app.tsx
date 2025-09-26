/* src/contexts/app.tsx */

"use client";

import type { ReactNode } from "react";
import { ColorProvider, use_color_context } from "./color";
import { ThemeProvider } from "./theme";

function AppLayout({ children }: { children: ReactNode }) {
	const { theme_color } = use_color_context();

	return (
		<div
			className="color"
			style={
				{
					"--theme-color": `var(--theme-color-${theme_color})`,
				} as React.CSSProperties
			}
		>
			{children}
		</div>
	);
}

export function AppProvider({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider>
			<ColorProvider>
				<AppLayout>{children}</AppLayout>
			</ColorProvider>
		</ThemeProvider>
	);
}
