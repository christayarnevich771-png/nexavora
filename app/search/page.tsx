import Link from "next/link";
import { Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListingCard } from "@/components/marketplace/listing-card";
import { listings as placeholderListings, type Listing } from "@/lib/placeholder-data";
import { createClient } from "@/lib/supabase/server";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export const metadata = {
  title: "Search Results | NEXAVORA",
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  let filtered: Listing[] = [...placeholderListings];

  try {
    const supabase = await createClient();
    const { data: dbListings } = await supabase
      .from("listings")
      .select(`
        id,
        slug,
        title,
        description,
        price_cents,
        currency,
        delivery_time_days,
        category:categories(name, slug),
        seller:profiles!seller_id(username, display_name, is_verified)
      `)
      .eq("status", "active");

    if (dbListings && dbListings.length > 0) {
      const mapped: Listing[] = dbListings.map((item: any) => ({
        slug: item.slug,
        title: item.title,
        category: item.category?.name || "General",
        priceCents: item.price_cents,
        currency: item.currency || "USD",
        seller: {
          name: item.seller?.display_name || item.seller?.username || "Verified Seller",
          rating: 5.0,
          reviews: 1,
          verified: item.seller?.is_verified ?? true,
        },
        deliveryTime: item.delivery_time_days
          ? `${item.delivery_time_days} day delivery`
          : "Instant delivery",
        blurb: item.description?.slice(0, 100) + "..." || "Verified service.",
      }));
      filtered = [...mapped, ...placeholderListings];
    }
  } catch {
    //
  }

  if (query) {
    filtered = filtered.filter(
      (l) =>
        l.title.toLowerCase().includes(query.toLowerCase()) ||
        l.blurb.toLowerCase().includes(query.toLowerCase()) ||
        l.category.toLowerCase().includes(query.toLowerCase()) ||
        l.seller.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  return (
    <div className="container py-12">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/marketplace">
          <ArrowLeft className="h-4 w-4" /> Back to Marketplace
        </Link>
      </Button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Search Results
          </p>
          <h1 className="mt-1 font-display text-3xl">
            {query ? `Results for “${query}”` : "All Listings"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Found {filtered.length} listings matching your criteria.
          </p>
        </div>

        <form action="/search" className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input name="q" defaultValue={query} placeholder="Search anything…" className="pl-9" />
        </form>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((listing) => (
            <ListingCard key={listing.slug} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="mt-16 rounded-xl border border-dashed border-border p-12 text-center">
          <p className="font-display text-lg">No results found for &ldquo;{query}&rdquo;</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try checking spelling or searching for broader keywords.
          </p>
          <Button variant="outline" size="sm" className="mt-4" asChild>
            <Link href="/marketplace">Browse All Marketplace</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
