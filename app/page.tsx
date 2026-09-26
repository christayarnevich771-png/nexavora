import Link from "next/link";
import { ArrowRight, Handshake, Lock, ScrollText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/marketplace/listing-card";
import { categories, listings, stats } from "@/lib/placeholder-data";

export default function HomePage() {
  const featured = listings.slice(0, 6);

  return (
    <>
      <section className="border-b border-border">
        <div className="container grid gap-10 py-16 md:grid-cols-[1.2fr_1fr] md:py-24">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              Buy. Sell. Trade. Securely.
            </p>
            <h1 className="text-balance font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
              Trade digital work with the paperwork already done for you.
            </h1>
            <p className="mt-5 max-w-[46ch] text-muted-foreground">
              NEXAVORA holds every payment until the buyer confirms delivery,
              verifies sellers before they list, and keeps a full record of
              every order from offer to completion.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" variant="brand" asChild>
                <Link href="/marketplace">
                  Browse the marketplace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/create-listing">Start selling</Link>
              </Button>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border self-start">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-card p-5">
                <dt className="text-xs text-muted-foreground">{stat.label}</dt>
                <dd className="mt-1.5 font-mono text-xl tabular-nums">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-b border-border bg-secondary/40">
        <div className="container grid gap-8 py-12 sm:grid-cols-3">
          <TrustPoint
            icon={<Lock className="h-4 w-4" />}
            title="Held payments"
            body="Funds release to the seller only once you confirm delivery."
          />
          <TrustPoint
            icon={<Handshake className="h-4 w-4" />}
            title="Verified sellers"
            body="Every seller who takes payment passes an identity check."
          />
          <TrustPoint
            icon={<ScrollText className="h-4 w-4" />}
            title="A record for every order"
            body="Offers, messages, and delivery are logged from start to finish."
          />
        </div>
      </section>

      <section className="container py-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl">Browse by category</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Six categories, one standard for every listing.
            </p>
          </div>
          <Link
            href="/category/all"
            className="hidden text-sm text-muted-foreground hover:text-foreground sm:block"
          >
            View all
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-brand/50"
            >
              <p className="text-sm">{cat.name}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {cat.count} listings
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container pb-20">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl">Recently listed</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A sample of what sellers are offering this week.
            </p>
          </div>
          <Link
            href="/marketplace"
            className="hidden text-sm text-muted-foreground hover:text-foreground sm:block"
          >
            View all
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((listing) => (
            <ListingCard key={listing.slug} listing={listing} />
          ))}
        </div>
      </section>
    </>
  );
}

function TrustPoint({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}
