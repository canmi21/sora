/* src/components/footer/footer.tsx */

import { ToggleTheme } from "../shared/toggle-theme";

export default function footer() {
  const current_year = new Date().getFullYear();

  return (
    // CHANGE 1: The py-6.5 has been REMOVED from the footer.
    // The footer is now only responsible for the background, border, etc.
    <footer className="site-footer w-full border-t border-[var(--footer-border-color)] bg-[var(--footer-background)]">
      {/*
        CHANGE 2: The py-6.5 has been MOVED to this div.
        This container now holds the padding AND is the 'relative' positioning context.
        This is the crucial fix that makes 'bottom-*' work as expected.
      */}
      <div className="max-w-7xl mx-auto px-18 relative py-6.5">
        <div className="flex flex-col items-start gap-y-4 text-sm text-[var(--footer-text-color)]">
          {/* --- Group 1: About Links --- */}
          <div className="flex items-center gap-x-2.5">
            <span>About &gt;</span>
            <a
              href="#"
              className="hover:text-[var(--footer-subtext-color)] transition-colors"
            >
              Me
            </a>
            <a
              href="#"
              className="hover:text-[var(--footer-subtext-color)] transition-colors"
            >
              This Site
            </a>
            <a
              href="#"
              className="hover:text-[var(--footer-subtext-color)] transition-colors"
            >
              This Project
            </a>
            <span>More &gt;</span>
            <span>Repos</span>
            <span>OpenSource</span>
            <span>Sponsor</span>
            <span>Contact &gt;</span>
            <span>Github</span>
            <span>Email</span>
            <span>Status</span>
          </div>

          {/* --- Group 2: Site Status, Copyright, and Legal --- */}
          <div className="flex flex-col items-start gap-y-2">
            {/* --- Row 2 --- */}
            <div className="flex flex-wrap justify-start items-center gap-x-1.5 gap-y-1">
              <span>© 2021-{current_year} Canmi.</span>
              <span className="hidden sm:inline text-xs text-[var(--footer-subtext-color)]">
                |
              </span>
              <a
                href="#"
                className="hover:text-[var(--footer-subtext-color)] transition-colors"
              >
                RSS
              </a>
              <span className="hidden sm:inline text-xs text-[var(--footer-subtext-color)]">
                |
              </span>
              <a
                href="#"
                className="hover:text-[var(--footer-subtext-color)] transition-colors"
              >
                Sitemap
              </a>
              <span className="hidden sm:inline text-xs text-[var(--footer-subtext-color)]">
                |
              </span>
              <a
                href="#"
                className="hover:text-[var(--footer-subtext-color)] transition-colors"
              >
                Subscribe
              </a>
              <span className="hidden sm:inline text-xs text-[var(--footer-subtext-color)]">
                |
              </span>
              <span className="mt-1 sm:mt-0">
                Time will take away everything that belongs to you.
              </span>
            </div>

            {/* --- Row 3 --- */}
            <div className="flex flex-wrap justify-start items-center gap-x-1.5">
              <span>Powered by Sora & Cloudfaro.</span>
              <span className="text-xs text-[var(--footer-subtext-color)]">
                |
              </span>
              <a
                href="https://beian.miit.gov.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--footer-subtext-color)] transition-colors"
              >
                沪ICP备2025141863号
              </a>
              <span className="text-xs text-[var(--footer-subtext-color)]">
                |
              </span>
              <span>萌ICP备202421033号</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 right-6">
          <ToggleTheme
            trackColor="var(--footer-toggle-track-color)"
            puckColor="var(--footer-toggle-puck-color)"
          />
        </div>
      </div>
    </footer>
  );
}
