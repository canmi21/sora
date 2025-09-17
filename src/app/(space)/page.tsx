/* src/app/(space)/page.tsx */

export default function home() {
  return (
    // We replace 'h-full' with 'flex-grow'.
    // Now this div will grow to fill the available space inside its new flex-parent, <main>.
    // The centering logic remains the same and will now work correctly.
    <div className="flex-grow flex items-center justify-center">
      <h1 className="text-4xl font-semibold text-[var(--color-text)]">
        Hello World
      </h1>
    </div>
  );
}
