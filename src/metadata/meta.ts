/* src/metadata/meta.ts */

import type { Metadata, Viewport } from "next";

export const site: Metadata = {
  title: "月かげ空 - 致虚无，心を守。",
  description: "致虚无，心を守。",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  // OG later
};

export const site_viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#161616" },
  ],
};
