/* src/contexts/app.tsx */

import { ReactNode } from "react";
import { ColorProvider } from "~/contexts/color";
import { ThemeProvider } from "~/contexts/theme";

const THEME_NAMES = ["sky", "mint", "lavender", "blush", "lemon"];

export function AppProvider({ children }: { children: ReactNode }) {
	const random_index = Math.floor(Math.random() * THEME_NAMES.length);
	const initialTheme = THEME_NAMES[random_index];

	return (
		<ThemeProvider>
			<ColorProvider initialTheme={initialTheme}>{children}</ColorProvider>
		</ThemeProvider>
	);
}
