/* src/app/layout.tsx */

import "~/styles/tailwindcss.css";
import "~/styles/transitions.css";
import "~/styles/colors.css";
import "~/styles/element.css";
import type { ReactNode } from "react";
import { site, site_viewport } from "~/metadata/meta";
import { App_provider } from "~/contexts/app";
import { cookies } from "next/headers";

export const metadata = site;
export const viewport = site_viewport;

// Change 1: Make the component an 'async function'.
export default async function root_layout({
  children,
}: {
  children: ReactNode;
}) {
  // Change 2: 'await' the cookies() call before trying to .get() from it.
  const theme_cookie = (await cookies()).get("@sora/theme");
  const theme = theme_cookie?.value || "system";

  return (
    // We still recommend keeping suppressHydrationWarning here to handle the
    // "system" theme edge case on a user's very first visit.
    <html
      lang="en"
      className={theme === "dark" ? "dark" : ""}
      suppressHydrationWarning
    >
      <head />
      <body className="bg-[var(--color-bg)] text-[var(--color-text)]">
        <App_provider>{children}</App_provider>
      </body>
    </html>
  );
}
