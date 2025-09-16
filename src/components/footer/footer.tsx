/* src/components/footer/footer.tsx */

export default function footer() {
  return (
    // We replace the generic '--color-tertiary' with our new, dedicated
    // '--footer-border-color' variable for a much more subtle effect.
    <footer
      className="site-footer w-full border-t border-[var(--footer-border-color)] bg-[var(--footer-background)]"
    >
      <div className="max-w-4xl mx-auto py-14 px-4">
        <p className="text-center text-sm text-[var(--color-subtext)]">
          sora © 2025. Built with Next.js and Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}