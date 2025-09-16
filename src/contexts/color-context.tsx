/* src/contexts/color-context.tsx */

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

// The logic for choosing a theme now lives here.
const THEME_NAMES = ["blue", "indigo", "yellow", "amber"];

// The specific shape of the data this context provides.
interface Color_context_type {
  theme_color: string;
}

// The context dedicated to color information.
const Color_context = createContext<Color_context_type>({
  theme_color: "blue", // Default value.
});

// The provider component for the color theme.
export function Color_provider({ children }: { children: ReactNode }) {
  const [theme_color, set_theme_color] = useState("blue");

  useEffect(() => {
    const random_index = Math.floor(Math.random() * THEME_NAMES.length);
    set_theme_color(THEME_NAMES[random_index]);
  }, []);

  // Its only job is to provide the 'theme_color' value to its children.
  return (
    <Color_context.Provider value={{ theme_color }}>
      {children}
    </Color_context.Provider>
  );
}

// The specific hook to access this color context.
export const use_color_context = () => useContext(Color_context);