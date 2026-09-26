import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-[calc(100vh-4rem-1px)] lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">{children}</div>
      </div>

      <div className="relative hidden overflow-hidden border-l border-border bg-primary text-primary-foreground lg:flex lg:flex-col lg:justify-between lg:p-10">
        <NexavoraPattern />
        <div className="relative">
          <p className="font-display text-2xl leading-snug">
            “The order timeline gave us a clear record of what happened, when it happened,
            and what needed attention next.”
          </p>
          <p className="mt-4 text-sm text-primary-foreground/70">
            Marlowe Studio — 312 completed orders
          </p>
        </div>
        <div className="relative flex items-center justify-between text-xs text-primary-foreground/60">
          <Link href="/policies/terms" className="hover:text-primary-foreground">
            Terms
          </Link>
          <Link href="/policies/privacy" className="hover:text-primary-foreground">
            Privacy
          </Link>
          <Link href="/contact" className="hover:text-primary-foreground">
            Support
          </Link>
        </div>
      </div>
    </div>
  );
}

function NexavoraPattern() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]"
      aria-hidden="true"
    >
      <pattern id="nexavora-grid" width="44" height="44" patternUnits="userSpaceOnUse">
        <path d="M0 22 L22 0 L44 22 L22 44 Z" fill="none" stroke="currentColor" strokeWidth="1" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#nexavora-grid)" />
    </svg>
  );
}
