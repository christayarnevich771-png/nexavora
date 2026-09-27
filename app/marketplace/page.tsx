import Link from "next/link";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListingCard } from "@/components/marketplace/listing-card";
import { categories, listings as placeholderListings, type Listing } from "@/lib/placeholder-data";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Marketplace | NEXAVORA",
  description: "Browse verified digital services and assets with secure escrow protection.",
};

interface MarketplacePageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    sort?: string;
  }>;
}

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
  const params = await searchParams;
  const currentCategory = params.category || "all";
  const searchQuery = params.q?.toLowerCase() || "";
  const sort = params.sort || "newest";

  let displayListings: Listing[] = [...placeholderListings];

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
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (dbListings && dbListings.length > 0) {
      const mappedDbListings: Listing[] = dbListings.map((item: any) => ({
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
        blurb: item.description?.slice(0, 100) + "..." || "Verified digital service.",
      }));

      // Merge db listings with placeholders for rich experience
      displayListings = [...mappedDbListings, ...placeholderListings];
    }
  } catch {
    // Fallback to placeholder listings
  }

  // Filter by category
  if (currentCategory !== "all") {
    displayListings = displayListings.filter((item) => {
      const catSlug = categories.find(
        (c) => c.name.toLowerCase() === item.category.toLowerCase()
      )?.slug;
      return catSlug === currentCategory || item.category.toLowerCase().includes(currentCategory);
    });
  }

  // Filter by search query
  if (searchQuery) {
    displayListings = displayListings.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery) ||
        item.blurb.toLowerCase().includes(searchQuery) ||
        item.category.toLowerCase().includes(searchQuery) ||
        item.seller.name.toLowerCase().includes(searchQuery)
    );
  }

  // Sort
  if (sort === "price-low") {
    displayListings.sort((a, b) => a.priceCents - b.priceCents);
  } else if (sort === "price-high") {
    displayListings.sort((a, b) => b.priceCents - a.priceCents);
  } else if (sort === "rating") {
    displayListings.sort((a, b) => b.seller.rating - a.seller.rating);
  }

  return (
    <div className="container py-10">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Verified Services & Assets
          </p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl">Marketplace</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore listings with automated escrow security and guaranteed delivery.
          </p>
        </div>
        <Button variant="brand" asChild>
          <Link href="/create-listing">
            <Plus className="h-4 w-4" />
            Create Listing
          </Link>
        </Button>
      </div>

      {/* Filter and search bar */}
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <form className="relative flex-1 max-w-lg">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={params.q || ""}
            placeholder="Search by keyword, skill, or seller…"
            className="pl-9"
          />
          {params.category && (
            <input type="hidden" name="category" value={params.category} />
          )}
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Sort:
          </span>
          <Button
            size="sm"
            variant={sort === "newest" ? "secondary" : "ghost"}
            asChild
          >
            <Link
              href={{
                pathname: "/marketplace",
                query: { ...params, sort: "newest" },
              }}
            >
              Newest
            </Link>
          </Button>
          <Button
            size="sm"
            variant={sort === "price-low" ? "secondary" : "ghost"}
            asChild
          >
            <Link
              href={{
                pathname: "/marketplace",
                query: { ...params, sort: "price-low" },
              }}
            >
              Price: Low
            </Link>
          </Button>
          <Button
            size="sm"
            variant={sort === "price-high" ? "secondary" : "ghost"}
            asChild
          >
            <Link
              href={{
                pathname: "/marketplace",
                query: { ...params, sort: "price-high" },
              }}
            >
              Price: High
            </Link>
          </Button>
          <Button
            size="sm"
            variant={sort === "rating" ? "secondary" : "ghost"}
            asChild
          >
            <Link
              href={{
                pathname: "/marketplace",
                query: { ...params, sort: "rating" },
              }}
            >
              Top Rated
            </Link>
          </Button>
        </div>
      </div>

      {/* Categories chips */}
      <div className="mt-6 flex flex-wrap gap-2 border-b border-border pb-6">
        <Link
          href="/marketplace"
          className={`rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
            currentCategory === "all"
              ? "bg-brand text-brand-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-accent"
          }`}
        >
          All Categories
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/marketplace?category=${cat.slug}`}
            className={`rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
              currentCategory === cat.slug
                ? "bg-brand text-brand-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Listings Grid */}
      {displayListings.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayListings.map((listing) => (
            <ListingCard key={listing.slug} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="mt-16 rounded-xl border border-dashed border-border p-12 text-center">
          <p className="font-display text-lg">No listings found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search query or removing category filters.
          </p>
          <Button variant="outline" size="sm" className="mt-4" asChild>
            <Link href="/marketplace">Clear Filters</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
