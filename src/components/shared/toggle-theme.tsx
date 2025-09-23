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

// Renamed to PascalCase as requested
export function ToggleTheme({ trackColor, puckColor }: ToggleThemeProps) {
  const [is_mounted, set_is_mounted] = useState(false);
  const { theme, setTheme } = useTheme();

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

  return (
    <ToggleGroup.Root
      type="single"
      value={theme}
      onValueChange={(new_theme) => {
        if (new_theme) setTheme(new_theme);
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
