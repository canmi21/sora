/* src/app/(space)/layout.tsx */

import "~/styles/footer.css";
import type { ReactNode } from "react";
import Footer from "~/components/footer/footer";

export default function space_layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <main className="min-h-[100dvh] flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}
