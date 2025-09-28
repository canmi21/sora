/* src/components/footer/dynamic.tsx */

"use client";

import { Suspense, useRef, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useValueContext } from "~/contexts/value-client";
import { ToggleTheme } from "../shared/toggle-theme";
import { ToggleLang } from "../shared/toggle-lang";

function LanguageToggle() {
	const ref = useRef<HTMLDivElement>(null);
	const { resolvedTheme } = useTheme();
	const [colors, setColors] = useState({
		track: "",
		background: "",
		border: "",
		hover: "",
	});

	const updateColors = () => {
		if (ref.current) {
			const computed = window.getComputedStyle(ref.current);
			setColors({
				track: computed.getPropertyValue("--footer-toggle-track-color").trim(),
				background: computed.getPropertyValue("--footer-background").trim(),
				border: computed.getPropertyValue("--footer-border-color").trim(),
				hover: computed.getPropertyValue("--footer-toggle-track-color").trim(),
			});
		}
	};

	// 初始加载时获取颜色
	useEffect(() => {
		updateColors();
	}, []);

	// 监听主题变化，但需要延迟一下确保CSS变量已更新
	useEffect(() => {
		if (resolvedTheme) {
			// 使用 requestAnimationFrame 确保在下次重绘时获取颜色
			const timeoutId = setTimeout(() => {
				requestAnimationFrame(() => {
					updateColors();
				});
			}, 50); // 给CSS变量更新留一点时间

			return () => clearTimeout(timeoutId);
		}
	}, [resolvedTheme]);

	return (
		<div ref={ref} className="site-footer">
			{colors.background && (
				<ToggleLang
					trackColor={colors.track}
					menuBackgroundColor={colors.background}
					menuBorderColor={colors.border}
					menuItemHoverColor={colors.hover}
					triggerColor="var(--color-subtext)"
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
