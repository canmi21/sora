/* src/components/shared/toggle-theme.tsx */

"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { motion } from "framer-motion";
import { Sun, LaptopMinimal, Moon } from "lucide-react";

const options = [
  { value: "light", icon: Sun },
  { value: "system", icon: LaptopMinimal },
  { value: "dark", icon: Moon },
];

interface ToggleThemeProps {
  trackColor?: string;
  puckColor?: string;
}

export function ToggleTheme({ trackColor, puckColor }: ToggleThemeProps) {
  const [is_mounted, set_is_mounted] = useState(false);
  // Get both the selected theme and the resolved theme from the hook.
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    set_is_mounted(true);
  }, []);

  if (!is_mounted || !theme) {
    return (
      <div
        className="h-9 w-[8.25rem] rounded-full p-1"
        style={{ backgroundColor: trackColor || "var(--color-bg-alt)" }}
      />
    );
  }

  // This is the new, more intelligent handler.
  const handle_theme_change = (new_theme: string) => {
    // 1. Predict what the next visual theme will be.
    // If 'system' is chosen, we check the OS preference to find the resolved theme.
    const next_resolved_theme =
      new_theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : new_theme;

    // 2. Compare the current visual theme with the next one.
    // If they are the same, skip the full-page animation.
    if (next_resolved_theme === resolvedTheme) {
      setTheme(new_theme);
      return;
    }

    // 3. If they are different, trigger the view transition.
    if (!document.startViewTransition) {
      setTheme(new_theme); // Fallback for older browsers
    } else {
      document.startViewTransition(() => {
        setTheme(new_theme);
      });
    }
  };

  return (
    <ToggleGroup.Root
      type="single"
      value={theme}
      onValueChange={(new_theme) => {
        if (new_theme) handle_theme_change(new_theme);
      }}
      className="relative flex h-9 items-center rounded-full p-1"
      aria-label="Theme toggle"
      style={{ backgroundColor: trackColor || "var(--color-bg-alt)" }}
    >
      {options.map((option) => (
        <ToggleGroup.Item
          key={option.value}
          value={option.value}
          className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-300 focus:outline-none"
          aria-label={option.value}
        >
          {theme === option.value && (
            <motion.div
              layoutId="theme-toggle-active-puck"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute inset-0 h-full w-full rounded-full bg-[var(--color-bg)] shadow-md"
              style={{ backgroundColor: puckColor || "var(--color-bg)" }}
            />
          )}
          <option.icon
            className="relative z-20 h-4 w-4"
            style={{
              color:
                theme === option.value
                  ? "var(--color-text)"
                  : "var(--color-subtext)",
            }}
          />
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
