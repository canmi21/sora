/* src/components/shared/toggle-lang.tsx */

"use client";

import { useState, useEffect, useRef } from "react";
import { useI18n } from "~/providers/i18n-client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, Check, ChevronDown } from "lucide-react";
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
	trackColor?: string;
	menuBackgroundColor?: string;
	menuBorderColor?: string;
	menuItemHoverColor?: string;
	triggerColor?: string;
}

function AnimatedMenuItem({
	langOption,
	name,
	isSelected,
	onSelect,
	hoverColor,
}: {
	langOption: SupportedLocale;
	name: NativeLocaleName;
	isSelected: boolean;
	onSelect: () => void;
	hoverColor?: string;
}) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<DropdownMenu.Item
			onSelect={onSelect}
			className="lang-menu-item relative flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm outline-none overflow-hidden"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* 涟漪背景动画 - 使用内联 style */}
			<motion.div
				className="absolute inset-0 rounded-md"
				initial={{ opacity: 0 }}
				animate={{ opacity: isHovered ? 1 : 0 }}
				transition={{
					duration: 0.15,
					ease: "easeOut",
				}}
				style={{
					backgroundColor: hoverColor || "var(--footer-toggle-track-color)",
				}}
			/>

			{/* 内容 */}
			<div className="relative z-10 flex items-center w-full">
				{isSelected && (
					<motion.div
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ duration: 0.2 }}
						className="absolute left-0.5"
					>
						<Check className="h-4 w-4" style={{ color: "var(--color-text)" }} />
					</motion.div>
				)}
				<span
					className="pl-6 flex items-baseline gap-x-1.5"
					style={{ color: "var(--color-text)" }}
				>
					<span>{name.main}</span>
					{name.region && (
						<span className="text-xs" style={{ color: "var(--color-subtext)" }}>
							({name.region})
						</span>
					)}
				</span>
			</div>
		</DropdownMenu.Item>
	);
}

export function ToggleLang({
	trackColor,
	menuBackgroundColor,
	menuBorderColor,
	menuItemHoverColor,
	triggerColor,
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
		return (
			<div
				className="h-9 w-56 rounded-full"
				style={{ backgroundColor: trackColor || "var(--color-bg-alt)" }}
			/>
		);
	}

	return (
		<DropdownMenu.Root open={is_open} onOpenChange={set_is_open}>
			<DropdownMenu.Trigger asChild>
				<button
					className="lang-toggle-trigger flex h-9 items-center gap-x-1.5 rounded-full px-3 text-sm transition-colors duration-300 focus:outline-none"
					aria-label="Language toggle"
					style={{
						backgroundColor: trackColor || "var(--color-bg-alt)",
						color: triggerColor || "var(--color-subtext)",
					}}
				>
					<Globe className="h-4 w-4" />
					<span className="flex-grow text-left whitespace-nowrap">
						{FULL_LOCALE_NAMES[locale]}
					</span>
					<motion.div
						animate={{ rotate: is_open ? 180 : 0 }}
						transition={{ duration: 0.2, ease: "easeInOut" }}
					>
						<ChevronDown className="h-4 w-4" />
					</motion.div>
				</button>
			</DropdownMenu.Trigger>

			<AnimatePresence mode="wait">
				{is_open && (
					<DropdownMenu.Portal forceMount>
						<DropdownMenu.Content
							asChild
							side="top"
							align="end"
							sideOffset={8}
							className="lang-dropdown-content z-50 overflow-hidden rounded-lg p-1 shadow-lg focus:outline-none"
							style={{
								backgroundColor: menuBackgroundColor || "var(--color-bg)",
								border: menuBorderColor
									? `1px solid ${menuBorderColor}`
									: `1px solid var(--color-bg-alt)`,
								minWidth: "var(--radix-dropdown-menu-trigger-width)",
							}}
						>
							<motion.div
								initial={{ opacity: 0, y: 10, scale: 0.95 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: -10, scale: 0.95 }}
								transition={{
									duration: 0.2,
									ease: [0.4, 0, 0.2, 1],
								}}
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
											<AnimatedMenuItem
												key={lang_option}
												langOption={lang_option}
												name={name}
												isSelected={locale === lang_option}
												onSelect={() => handle_lang_change(lang_option)}
												hoverColor={menuItemHoverColor}
											/>
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
