/* src/app/layout.tsx */

import "~/styles/tailwindcss.css";
import "~/styles/transitions.css";
import "~/styles/colors.css";
import type { ReactNode } from "react";
import { site, site_viewport } from "~/metadata/meta";

export const metadata = site;
export const viewport = site_viewport;

export default function root_layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="bg-[var(--color-bg)] text-[var(--color-text)]">
        {children}
      </body>
    </html>
  );
}