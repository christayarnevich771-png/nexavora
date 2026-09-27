import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/marketplace/listing-card";
import { categories, listings as placeholderListings } from "@/lib/placeholder-data";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (slug === "all") {
    return { title: "All Categories | NEXAVORA" };
  }
  return {
    title: category ? `${category.name} | NEXAVORA` : "Category | NEXAVORA",
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  if (slug === "all") {
    return (
      <div className="container py-12">
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/marketplace">
              <ArrowLeft className="h-4 w-4" /> Back to Marketplace
            </Link>
          </Button>
          <h1 className="font-display text-3xl">All Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore services and assets categorized by industry and discipline.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const count = placeholderListings.filter(
              (l) => l.category.toLowerCase() === cat.name.toLowerCase()
            ).length;
            return (
              <Link
                key={cat.slug}
                href={`/marketplace?category=${cat.slug}`}
                className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-brand/60"
              >
                <h2 className="font-display text-xl group-hover:text-brand">
                  {cat.name}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  High-demand digital assets and verified custom services.
                </p>
                <div className="mt-4 flex items-center justify-between font-mono text-xs text-muted-foreground">
                  <span>{cat.count} listings available</span>
                  <span className="text-brand">Browse →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  const category = categories.find((c) => c.slug === slug);
  if (!category) {
    notFound();
  }

  const filtered = placeholderListings.filter(
    (l) => l.category.toLowerCase() === category.name.toLowerCase()
  );

  return (
    <div className="container py-12">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/marketplace">
          <ArrowLeft className="h-4 w-4" /> Back to Marketplace
        </Link>
      </Button>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Category
          </p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl">{category.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} active listings verified for quality and security.
          </p>
        </div>
        <Button variant="brand" asChild>
          <Link href="/create-listing">Post in {category.name}</Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((listing) => (
          <ListingCard key={listing.slug} listing={listing} />
        ))}
      </div>
    </div>
  );
}
