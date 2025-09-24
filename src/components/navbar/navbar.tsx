/* src/components/navbar/navbar.tsx */

import React from "react";
import "~/styles/navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar w-full h-15 flex items-center justify-between px-8">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">
          月かげ空
        </h1>
      </div>
      <div className="flex items-center space-x-6">
        <a
          href="#"
          className="text-[var(--color-text)] hover:text-[var(--color-subtext)] transition-colors"
        >
          Home
        </a>
        <a
          href="#"
          className="text-[var(--color-text)] hover:text-[var(--color-subtext)] transition-colors"
        >
          About
        </a>
        <a
          href="#"
          className="text-[var(--color-text)] hover:text-[var(--color-subtext)] transition-colors"
        >
          Projects
        </a>
        <a
          href="#"
          className="text-[var(--color-text)] hover:text-[var(--color-subtext)] transition-colors"
        >
          Contact
        </a>
      </div>
    </nav>
  );
}
