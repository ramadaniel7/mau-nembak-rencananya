import type { ReactNode } from 'react';

/** Full-screen scrollable layer that centres its content (mobile-first). */
export default function Stage({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className="absolute inset-0 overflow-y-auto overflow-x-hidden">
      <div
        className={`mx-auto flex min-h-[100dvh] w-full flex-col items-center justify-center px-5 py-20 sm:py-16 ${className}`}
        style={{ paddingTop: 'max(5rem, calc(env(safe-area-inset-top) + 4rem))' }}
      >
        {children}
      </div>
    </section>
  );
}
