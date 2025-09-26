/* src/contexts/theme.tsx */

"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

// This component is perfect as is.
// `next-themes` automatically handles cookie synchronization alongside localStorage
// when it runs on the client, which is what allows the server to pick it up on the next request.
export function ThemeProvider({ children }: { children: ReactNode }) {
	return (
		<NextThemesProvider
			attribute="class"
			storageKey="@sora/theme"
			defaultTheme="system"
			enableSystem
		>
			{children}
		</NextThemesProvider>
	);
}
