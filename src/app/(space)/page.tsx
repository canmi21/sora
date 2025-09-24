/* src/app/(space)/page.tsx */

import FireFly from "~/components/shared/fire-fly";

export default function home() {
  return (
    <>
      <FireFly maxDots={30} />
      <div className="flex-grow flex items-center justify-center relative z-10">
        <h1 className="text-4xl font-semibold text-[var(--color-text)]">
          Empty
        </h1>
      </div>
    </>
  );
}
