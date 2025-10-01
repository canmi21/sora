/* src/contexts/color.tsx */

"use client";

import React, {
	createContext,
	useContext,
	useMemo,
	type ReactNode,
} from "react";

const LIGHT_PALETTES: Record<string, string> = {
	sky: "#d7ebff",
	mint: "#b0e0d6",
	lavender: "#858bc2",
	blush: "#e89bab",
	lemon: "#f5d155",
};

const DARK_PALETTES: Record<string, string> = {
	sky: "#3a4a5a",
	mint: "#2e4d46",
	lavender: "#3f4469",
	blush: "#6a3d48",
	lemon: "#6b5e20",
};

interface ColorContextType {
	theme_color: string;
}

const ColorContext = createContext<ColorContextType>({
	theme_color: "sky",
});

// === Utils ===
function hexToRgb(hex: string): [number, number, number] {
	const h = hex.replace("#", "");
	const full =
		h.length === 3
			? h
					.split("")
					.map((c) => c + c)
					.join("")
			: h;
	const r = parseInt(full.slice(0, 2), 16);
	const g = parseInt(full.slice(2, 4), 16);
	const b = parseInt(full.slice(4, 6), 16);
	return [r, g, b];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
	r /= 255;
	g /= 255;
	b /= 255;
	const max = Math.max(r, g, b),
		min = Math.min(r, g, b);
	let h = 0,
		s = 0;
	const l = (max + min) / 2;
	if (max !== min) {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			default:
				h = (r - g) / d + 4;
				break;
		}
		h *= 60;
	}
	return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
	s /= 100;
	l /= 100;
	if (s === 0) {
		const v = Math.round(l * 255);
		return [v, v, v];
	}
	const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	const p = 2 * l - q;
	const hue2rgb = (p: number, q: number, t: number) => {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1 / 6) return p + (q - p) * 6 * t;
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
		return p;
	};
	const hk = h / 360;
	const r = hue2rgb(p, q, hk + 1 / 3);
	const g = hue2rgb(p, q, hk);
	const b = hue2rgb(p, q, hk - 1 / 3);
	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHex(r: number, g: number, b: number): string {
	const toHex = (n: number) => n.toString(16).padStart(2, "0");
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function makeIndicator(hex: string, opts?: { dark?: boolean }): string {
	const [r, g, b] = hexToRgb(hex);
	const [h, s, l] = rgbToHsl(r, g, b);
	const dark = !!opts?.dark;
	let newS = s;
	let newL = l;
	if (dark) {
		// Dark mode: brighten the color for visibility on dark background
		if (l < 30) {
			newL = Math.min(92, l + 36);
			newS = Math.min(100, Math.round(s * 1.22));
		} else if (l < 60) {
			newL = Math.min(92, l + 24);
			newS = Math.min(100, Math.round(s * 1.08));
		} else {
			newL = Math.min(96, l + 10);
			newS = Math.min(100, Math.round(s * 1.03));
		}
	} else {
		// Light mode: darken the color for visibility on light background
		if (l > 70) {
			newL = Math.max(8, l - 30);
			newS = Math.min(100, Math.round(s * 1.35));
		} else if (l > 40) {
			newL = Math.max(6, l - 16);
			newS = Math.min(100, Math.round(s * 1.12));
		} else {
			newL = Math.max(4, l - 8);
			newS = Math.min(100, Math.round(s * 1.03));
		}
	}
	if (s < 10) newS = Math.max(newS, 28);
	const [rr, gg, bb] = hslToRgb(h, Math.round(newS), Math.round(newL));
	return rgbToHex(rr, gg, bb);
}

// === Provider ===
export function ColorProvider({
	children,
	initialTheme,
}: {
	children: ReactNode;
	initialTheme: string;
}) {
	const theme_color = initialTheme;

	// Pre-compute all 4 colors (light + dark for both base and indicator)
	const colors = useMemo(() => {
		const lightHex = LIGHT_PALETTES[theme_color] ?? LIGHT_PALETTES["sky"];
		const darkHex = DARK_PALETTES[theme_color] ?? DARK_PALETTES["sky"];

		const lightIndicator = makeIndicator(lightHex, { dark: false });
		const darkIndicator = makeIndicator(darkHex, { dark: true });

		return {
			light: lightHex,
			dark: darkHex,
			lightIndicator,
			darkIndicator,
		};
	}, [theme_color]);

	// Generate style tag with both light and dark mode CSS
	const styleContent = `
		.color {
			--theme-color: ${colors.light};
			--theme-color-indicator: ${colors.lightIndicator};
		}
		.dark .color {
			--theme-color: ${colors.dark};
			--theme-color-indicator: ${colors.darkIndicator};
		}
	`;

	return (
		<ColorContext.Provider value={{ theme_color }}>
			<style dangerouslySetInnerHTML={{ __html: styleContent }} />
			<div className="color">{children}</div>
		</ColorContext.Provider>
	);
}

export const useColorContext = () => useContext(ColorContext);
