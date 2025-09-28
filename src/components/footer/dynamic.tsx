/* src/components/footer/dynamic.tsx */

"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { useValueContext } from "~/contexts/value-client";
import { ToggleTheme } from "../shared/toggle-theme";
import { ToggleLang } from "../shared/toggle-lang";

function LanguageToggle() {
	const ref = useRef<HTMLDivElement>(null);
	const [menu_colors, set_menu_colors] = useState({
		background: "",
		border: "",
		hover: "",
		triggerBackground: "",
	});

	useEffect(() => {
		if (ref.current) {
			const computed_style = window.getComputedStyle(ref.current);
			set_menu_colors({
				background: computed_style
					.getPropertyValue("--footer-background")
					.trim(),
				border: computed_style.getPropertyValue("--footer-border-color").trim(),
				hover: computed_style
					.getPropertyValue("--footer-toggle-track-color")
					.trim(),
				triggerBackground: computed_style
					.getPropertyValue("--footer-toggle-track-color")
					.trim(),
			});
		}
	}, []);

	return (
		<div ref={ref}>
			{menu_colors.background && (
				<ToggleLang
					menuBackgroundColor={menu_colors.background}
					menuBorderColor={menu_colors.border}
					menuItemHoverColor={menu_colors.hover}
					triggerColor="var(--color-subtext)"
					triggerBackgroundColor={menu_colors.triggerBackground}
				/>
			)}
		</div>
	);
}

export function FooterDynamicContent() {
	const values = useValueContext();
	const ownerQuote =
		(values.get("owner.quote") as string) ||
		"The server is busy dreaming of code.";

	return (
		<>
			<span className="hidden sm:inline text-xs text-[var(--footer-subtext-color)]">
				|
			</span>
			<span className="mt-1 sm:mt-0">{ownerQuote}</span>

			<div className="absolute bottom-5.5 right-6 flex flex-col items-end gap-y-5">
				<Suspense
					fallback={
						<div className="h-9 w-48 rounded-full bg-[var(--footer-toggle-track-color)]" />
					}
				>
					<LanguageToggle />
				</Suspense>
				<ToggleTheme
					trackColor="var(--footer-toggle-track-color)"
					puckColor="var(--footer-toggle-puck-color)"
				/>
			</div>
		</>
	);
}
