import Link from "next/link";
import { MessageCircle, Send } from "lucide-react";

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
      { href: "/orders", label: "Escrow Orders" },
      { href: "/payment-methods", label: "Payment & Escrow" },
      { href: "/contact", label: "Dispute Support" },
      { href: "/contact", label: "Contact Us" },
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
    title: "Direct Support",
    links: [
      { href: "https://wa.me/639706536232", label: "WhatsApp: +63 970 653 6232" },
      { href: "https://t.me/ruoxi_mist", label: "Telegram: @ruoxi_mist" },
      { href: "/contact", label: "24/7 Support Desk" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container grid grid-cols-2 gap-10 py-14 md:grid-cols-5">
        <div className="col-span-2 md:col-span-1">
          <span className="font-display text-lg tracking-tight">NEXAVORA</span>
          <p className="mt-2 text-xs font-medium uppercase tracking-wide text-brand">
            Buy. Sell. Trade. Securely.
          </p>
          <p className="mt-3 max-w-[24ch] text-sm text-muted-foreground">
            A marketplace for digital products and services, built around clear order
            records and transparent escrow support.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <a
              href="https://wa.me/639706536232"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md bg-secondary/60 px-3 py-1.5 text-xs text-foreground hover:bg-secondary transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5 text-brand" />
              <span>WhatsApp: +63 970 653 6232</span>
            </a>
            <a
              href="https://t.me/ruoxi_mist"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md bg-secondary/60 px-3 py-1.5 text-xs text-foreground hover:bg-secondary transition-colors"
            >
              <Send className="h-3.5 w-3.5 text-brand" />
              <span>Telegram: @ruoxi_mist</span>
            </a>
          </div>
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
