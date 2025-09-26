/* next.config.ts */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	allowedDevOrigins: [
		"local-origin.dev",
		"*.local-origin.dev",
		"192.168.*.*",
		"172.*.*.*",
	],
	experimental: {
		viewTransition: true,
	},
	/* config options here */
};

export default nextConfig;
