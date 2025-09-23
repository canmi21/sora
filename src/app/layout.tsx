/* src/app/layout.tsx */

import "~/styles/tailwindcss.css";
import "~/styles/transitions.css";
import "~/styles/colors.css";
import "~/styles/element.css";
import type { ReactNode } from "react";
import { site, site_viewport } from "~/metadata/meta";
import { AppProvider } from "~/contexts/app";
import { cookies } from "next/headers";

export const metadata = site;
export const viewport = site_viewport;

export default async function root_layout({
  children,
}: {
  children: ReactNode;
}) {
  const theme_cookie = (await cookies()).get("@sora/theme");
  const theme = theme_cookie?.value || "system";

  return (
    <html
      lang="en"
      className={theme === "dark" ? "dark" : ""}
      suppressHydrationWarning
    >
      <head />
      <body className="bg-[var(--color-bg)] text-[var(--color-text)]">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
