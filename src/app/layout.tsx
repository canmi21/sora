/* src/app/layout.tsx */

import "~/styles/tailwindcss.css";
import "~/styles/transitions.css";
import "~/styles/colors.css";
import type { ReactNode } from "react";
import { site } from "~/metadata/meta";

export const metadata = site;

export default function root_layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Theme color for light mode */}
        <meta name="theme-color" content="#ffffff" />
        {/* Theme color for dark mode */}
        <meta
          name="theme-color"
          content="#161616"
          media="(prefers-color-scheme: dark)"
        />
      </head>
      {/*
        Apply the background and base text color directly to the body.
        This ensures the entire page canvas, including the overscroll area,
        has the correct background color.
      */}
      <body className="bg-[var(--color-bg)] text-[var(--color-text)]">
        {children}
      </body>
    </html>
  );
}