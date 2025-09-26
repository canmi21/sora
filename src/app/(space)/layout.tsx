/* src/app/(space)/layout.tsx */

import "~/styles/footer.css";
import type { ReactNode } from "react";
import Footer from "~/components/footer/footer";
import Navbar from "~/components/navbar/navbar";

export default function SpaceLayout({ children }: { children: ReactNode }) {
	return (
		<div>
			<Navbar />
			<main className="min-h-[100dvh] flex flex-col pt-15">{children}</main>
			<Footer />
		</div>
	);
}
