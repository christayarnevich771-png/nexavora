import Link from "next/link";

const columns = [
  {
    title: "Marketplace",
    links: [
      { href: "/marketplace", label: "Browse listings" },
      { href: "/category/all", label: "Categories" },
      { href: "/create-listing", label: "Start selling" },
      { href: "/search", label: "Search" },
    ],
  },
  {
    title: "Trust & safety",
    links: [
      { href: "/how-it-works", label: "How escrow works" },
      { href: "/disputes", label: "Dispute resolution" },
      { href: "/reports", label: "Report a listing" },
      { href: "/policies/prohibited-items", label: "Prohibited items" },
    ],
  },
  {
    title: "Payments",
    links: [
      { href: "/payment-methods", label: "Payment methods" },
      { href: "/payment-methods#usdt-bep20", label: "USDT (BEP20)" },
      { href: "/payment-methods#usdt-trc20", label: "USDT (TRC20)" },
      { href: "/payment-methods#sol", label: "SOL (Solana)" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About NEXAVORA" },
      { href: "/policies/terms", label: "Terms of service" },
      { href: "/policies/privacy", label: "Privacy policy" },
      { href: "/contact", label: "Contact support" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container grid grid-cols-2 gap-10 py-14 md:grid-cols-5">
        <div className="col-span-2 md:col-span-1">
          <span className="font-display text-lg">NEXAVORA</span>
          <p className="mt-2 text-xs font-medium uppercase tracking-wide text-brand">
            Buy. Sell. Trade. Securely.
          </p>
          <p className="mt-3 max-w-[24ch] text-sm text-muted-foreground">
            A marketplace for digital products and services, built around clear order
            records and transparent support.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-medium">{col.title}</h3>
            <ul className="mt-3 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-3 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} NEXAVORA. All rights reserved.</p>
          <p>Orders and payment instructions are recorded clearly for buyers and sellers.</p>
        </div>
      </div>
    </footer>
  );
}
