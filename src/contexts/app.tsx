/* src/contexts/app.tsx */

"use client";

import type { ReactNode } from "react";
import { Color_provider, use_color_context } from "./color";
import { Theme_provider } from "./theme";

function App_layout({ children }: { children: ReactNode }) {
  const { theme_color } = use_color_context();

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

export function App_provider({ children }: { children: ReactNode }) {
  return (
    <Theme_provider>
      <Color_provider>
        <App_layout>{children}</App_layout>
      </Color_provider>
    </Theme_provider>
  );
}
