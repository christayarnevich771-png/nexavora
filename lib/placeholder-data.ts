export type Listing = {
  slug: string;
  title: string;
  category: string;
  priceCents: number;
  currency: string;
  seller: {
    name: string;
    rating: number;
    reviews: number;
    verified: boolean;
  };
  deliveryTime: string;
  blurb: string;
};

export const categories = [
  { slug: "design", name: "Design & creative", count: 214 },
  { slug: "development", name: "Development & tech", count: 341 },
  { slug: "marketing", name: "Marketing & growth", count: 156 },
  { slug: "writing", name: "Writing & translation", count: 98 },
  { slug: "templates", name: "Templates & assets", count: 267 },
  { slug: "consulting", name: "Consulting & coaching", count: 72 },
];

export const listings: Listing[] = [
  {
    slug: "brand-identity-package",
    title: "Complete brand identity package: logo, palette, type system",
    category: "Design & creative",
    priceCents: 42000,
    currency: "USD",
    seller: { name: "Marlowe Studio", rating: 4.9, reviews: 312, verified: true },
    deliveryTime: "5 day delivery",
    blurb: "Source files, usage guide, and three concept rounds.",
  },
  {
    slug: "shopify-theme-customization",
    title: "Shopify theme customization and speed optimization",
    category: "Development & tech",
    priceCents: 65000,
    currency: "USD",
    seller: { name: "Renn Dev Co.", rating: 4.8, reviews: 189, verified: true },
    deliveryTime: "7 day delivery",
    blurb: "Section-by-section rebuild with Core Web Vitals passing.",
  },
  {
    slug: "seo-technical-audit",
    title: "Technical SEO audit with a prioritized fix list",
    category: "Marketing & growth",
    priceCents: 28000,
    currency: "USD",
    seller: { name: "Northfield Analytics", rating: 4.7, reviews: 96, verified: true },
    deliveryTime: "3 day delivery",
    blurb: "Crawl, index coverage, and Core Web Vitals, explained plainly.",
  },
  {
    slug: "notion-operations-template",
    title: "Notion operating system for small teams",
    category: "Templates & assets",
    priceCents: 3900,
    currency: "USD",
    seller: { name: "Isla Park", rating: 5.0, reviews: 540, verified: true },
    deliveryTime: "Instant delivery",
    blurb: "Projects, CRM, and finances in one connected workspace.",
  },
  {
    slug: "procreate-brush-pack",
    title: "Procreate brush pack: 40 hand-built textures",
    category: "Design & creative",
    priceCents: 1800,
    currency: "USD",
    seller: { name: "Ada Ferro", rating: 4.9, reviews: 421, verified: false },
    deliveryTime: "Instant delivery",
    blurb: "Ink, gouache, and grain brushes for illustration work.",
  },
  {
    slug: "manuscript-copyedit",
    title: "Full manuscript copyedit, up to 90,000 words",
    category: "Writing & translation",
    priceCents: 55000,
    currency: "USD",
    seller: { name: "Wren Editorial", rating: 4.9, reviews: 84, verified: true },
    deliveryTime: "10 day delivery",
    blurb: "Line edits, continuity notes, and a style sheet.",
  },
  {
    slug: "startup-pitch-coaching",
    title: "Pitch deck teardown and one live coaching session",
    category: "Consulting & coaching",
    priceCents: 24000,
    currency: "USD",
    seller: { name: "Priya Nathan", rating: 4.8, reviews: 63, verified: true },
    deliveryTime: "2 day delivery",
    blurb: "Former seed-stage investor reviews narrative and numbers.",
  },
  {
    slug: "react-component-library",
    title: "Accessible React component library, themeable",
    category: "Development & tech",
    priceCents: 9900,
    currency: "USD",
    seller: { name: "Castellan UI", rating: 4.9, reviews: 275, verified: true },
    deliveryTime: "Instant delivery",
    blurb: "40 components, keyboard-tested, with Figma source.",
  },
];

export const currentProfile = {
  displayName: "Jordan Ashby",
  handle: "@jordan.ashby",
  bio: "Full-stack developer taking on component libraries and internal tools. Replies within a day.",
  memberSince: "March 2024",
  verified: true,
  rating: 4.9,
  reviews: 58,
  completedOrders: 61,
  responseTime: "Under 2 hours",
};

export const stats = [
  { label: "Active listings", value: "1,148" },
  { label: "Verified sellers", value: "612" },
  { label: "Orders held in escrow", value: "$284,900" },
  { label: "Median first response", value: "38 min" },
];
