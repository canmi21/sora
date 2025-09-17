/* src/contexts/app.tsx */

"use client";

import type { ReactNode } from "react";
// We import the specific provider and hook from our new color context file.
import { Color_provider, use_color_context } from "./color";

// This is an internal component that consumes the contexts and applies the necessary styles.
function App_layout({ children }: { children: ReactNode }) {
  // It uses the specific hook to get the theme color.
  const { theme_color } = use_color_context();

  // It returns the div that applies the dynamic styles.
  return (
    <div
      className="color"
      style={
        {
          "--footer-background": `var(--${theme_color}-dark)`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}

// This is your main App_provider, the single entry point for the root layout.
export function App_provider({ children }: { children: ReactNode }) {
  return (
    // It composes other providers. Right now, it's just Color_provider.
    // In the future, you could wrap this with <Auth_provider>, etc.
    <Color_provider>
      {/*
        The App_layout component sits inside the providers, so it can
        access the context values and apply them to its children.
      */}
      <App_layout>{children}</App_layout>
    </Color_provider>
  );
}
