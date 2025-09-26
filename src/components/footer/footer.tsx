/* src/components/footer/footer.tsx */

import { ValueProvider } from "~/contexts/value";
import { FooterNavigation } from "./navigation";
import { FooterDynamicContent } from "./dynamic";

/**
 * The main footer component.
 * It fetches data and composes the layout by passing the dynamic client component
 * into a prop on the static server component.
 */
export default function Footer() {
  return (
    <ValueProvider keysToFetch={["owner.quote"]}>
      <footer className="site-footer w-full border-t border-[var(--footer-border-color)] bg-[var(--footer-background)]">
        <div className="max-w-7xl mx-auto px-18 relative py-6.5">
          <FooterNavigation dynamicContent={<FooterDynamicContent />} />
        </div>
      </footer>
    </ValueProvider>
  );
}
