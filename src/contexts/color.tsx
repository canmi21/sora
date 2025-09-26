/* src/contexts/color.tsx */

"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
} from "react";

const THEME_NAMES = ["sky", "mint", "lavender", "blush", "lemon"];

interface Color_context_type {
	theme_color: string;
}

const ColorContext = createContext<Color_context_type>({
	theme_color: "sky", // Default value.
});

export function ColorProvider({ children }: { children: ReactNode }) {
	const [theme_color, set_theme_color] = useState("sky");

	useEffect(() => {
		const random_index = Math.floor(Math.random() * THEME_NAMES.length);
		set_theme_color(THEME_NAMES[random_index]);
	}, []);

	return (
		<ColorContext.Provider value={{ theme_color }}>
			{children}
		</ColorContext.Provider>
	);
}

export const use_color_context = () => useContext(ColorContext);
