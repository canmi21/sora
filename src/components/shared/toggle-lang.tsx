/* src/components/shared/toggle-lang.tsx */

"use client";

import { useState, useEffect } from "react";
import { useI18n } from "~/providers/i18n-client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, Check, ChevronUp, ChevronDown } from "lucide-react";
import { SUPPORTED_LOCALES, SupportedLocale } from "~/providers/i18n";

const FULL_LOCALE_NAMES: Record<SupportedLocale, string> = {
	und: "Original Language",
	"en-US": "English (United States)",
	"en-GB": "English (United Kingdom)",
	"zh-CN": "Simplified Chinese",
	"zh-HK": "Traditional Chinese",
	"es-ES": "Español (Spain)",
	"fr-FR": "Français (France)",
	"ja-JP": "日本語 (Japan)",
};

interface NativeLocaleName {
	main: string;
	region?: string;
}

const NATIVE_LOCALE_NAMES: Record<SupportedLocale, NativeLocaleName> = {
	und: { main: "Original", region: "Global" },
	"en-US": { main: "English", region: "US" },
	"en-GB": { main: "English", region: "UK" },
	"zh-CN": { main: "简体中文", region: "中国大陆" },
	"zh-HK": { main: "繁體中文" },
	"es-ES": { main: "Español", region: "España" },
	"fr-FR": { main: "Français", region: "France" },
	"ja-JP": { main: "日本語" },
};

const LOCALE_DISPLAY_ORDER: SupportedLocale[] = [
	"und",
	"en-US",
	"en-GB",
	"zh-CN",
	"zh-HK",
	"es-ES",
	"fr-FR",
	"ja-JP",
];

interface ToggleLangProps {
	menuBackgroundColor?: string;
	menuBorderColor?: string;
	menuItemHoverColor?: string;
	triggerColor?: string;
	triggerBackgroundColor?: string;
}

export function ToggleLang({
	menuBackgroundColor,
	menuBorderColor,
	menuItemHoverColor,
	triggerColor,
	triggerBackgroundColor,
}: ToggleLangProps) {
	const [is_mounted, set_is_mounted] = useState(false);
	const [is_open, set_is_open] = useState(false);
	const { locale, setLocale } = useI18n();

	useEffect(() => {
		set_is_mounted(true);
	}, []);

	const handle_lang_change = (new_lang: SupportedLocale) => {
		if (new_lang && new_lang !== locale) {
			setLocale(new_lang);
		}
	};

	if (!is_mounted) {
		return <div className="h-9 w-56 rounded-full" />;
	}

	return (
		<DropdownMenu.Root open={is_open} onOpenChange={set_is_open}>
			<DropdownMenu.Trigger asChild>
				<button
					className="flex h-9 items-center gap-x-1.5 rounded-full px-3 text-sm transition-colors duration-300 focus:outline-none"
					aria-label="Language toggle"
					style={{
						color: triggerColor || "var(--color-subtext)",
						backgroundColor: triggerBackgroundColor,
					}}
				>
					<Globe className="h-4 w-4" />
					<span className="flex-grow text-left whitespace-nowrap">
						{FULL_LOCALE_NAMES[locale]}
					</span>
					{is_open ? (
						<ChevronUp className="h-4 w-4" />
					) : (
						<ChevronDown className="h-4 w-4" />
					)}
				</button>
			</DropdownMenu.Trigger>

			<AnimatePresence>
				{is_open && (
					<DropdownMenu.Portal forceMount>
						<DropdownMenu.Content
							asChild
							side="top"
							align="end"
							sideOffset={8}
							className="z-50 overflow-hidden rounded-lg p-1 shadow-lg focus:outline-none"
							style={
								{
									backgroundColor: menuBackgroundColor,
									border: menuBorderColor
										? `1px solid ${menuBorderColor}`
										: undefined,
									"--menu-item-hover-bg":
										menuItemHoverColor || "var(--color-bg)",
									minWidth: "var(--radix-dropdown-menu-trigger-width)",
								} as React.CSSProperties
							}
						>
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 10 }}
								transition={{ duration: 0.2 }}
							>
								{SUPPORTED_LOCALES.slice()
									.sort(
										(a, b) =>
											LOCALE_DISPLAY_ORDER.indexOf(a) -
											LOCALE_DISPLAY_ORDER.indexOf(b)
									)
									.map((lang_option) => {
										const name = NATIVE_LOCALE_NAMES[lang_option];
										// 安全检查，防止因数据不匹配导致渲染崩溃
										if (!name) {
											return null;
										}
										return (
											<DropdownMenu.Item
												key={lang_option}
												onSelect={() => handle_lang_change(lang_option)}
												className="relative flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm outline-none transition-colors hover:bg-[--menu-item-hover-bg] data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
											>
												{locale === lang_option && (
													<Check className="absolute left-2 h-4 w-4" />
												)}
												<span
													className="pl-6 flex items-baseline gap-x-1.5"
													style={{ color: "var(--color-text)" }}
												>
													<span>{name.main}</span>
													{name.region && (
														<span
															className="text-xs"
															style={{
																color: "var(--color-subtext)",
															}}
														>
															({name.region})
														</span>
													)}
												</span>
											</DropdownMenu.Item>
										);
									})}
							</motion.div>
						</DropdownMenu.Content>
					</DropdownMenu.Portal>
				)}
			</AnimatePresence>
		</DropdownMenu.Root>
	);
}
