/* src/components/footer/footer.tsx */

import { ValueProvider } from "~/contexts/value";
import { FooterNavigation } from "./navigation";
import { FooterDynamicContent } from "./dynamic";
import { IcpList } from "./icp"; // Import our new ICP component

/**
 * The main footer component.
 * It fetches all required data and composes the layout by passing the dynamic
 * client components into their designated props on the static layout component.
 */
export default function Footer() {
  return (
    // Add "site.icp" to the list of keys to fetch on the server.
    <ValueProvider keysToFetch={["owner.quote", "site.icp"]}>
      <footer className="site-footer w-full border-t border-[var(--footer-border-color)] bg-[var(--footer-background)]">
        <div className="max-w-7xl mx-auto px-18 relative py-6.5">
          {/*
            The composition is now even more powerful:
            1. The quote component goes into the 'dynamicContent' prop.
            2. The new ICP list component goes into the 'icpContent' prop.
          */}
          <FooterNavigation
            dynamicContent={<FooterDynamicContent />}
            icpContent={<IcpList />}
          />
        </div>
      </footer>
    </ValueProvider>
  );
}
