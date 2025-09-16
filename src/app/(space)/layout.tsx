/* src/app/(space)/layout.tsx */

import type { ReactNode } from "react";
import Footer from "~/components/footer/footer";

export default function space_layout({ children }: { children: ReactNode }) {
  // We remove the layout constraints from the outer div.
  // Its only job is to be a container.
  return (
    <div className="bg-[var(--color-bg)]">
      {/*
        The key change is here:
        - We move min-h-[100dvh] directly onto the <main> element.
          This ensures the main content area itself is at least one full screen tall.
        - We keep 'flex flex-col' so that the child page (like page.tsx)
          can use flex-grow to fill this space.
      */}
      <main className="min-h-[100dvh] flex flex-col">{children}</main>

      <Footer />
    </div>
  );
}