"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Lock,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

type MockOrder = {
  id: string;
  orderNumber: string;
  title: string;
  seller: string;
  buyer: string;
  amountCents: number;
  currency: string;
  status:
    | "pending_payment"
    | "paid"
    | "in_progress"
    | "delivered"
    | "completed"
    | "disputed";
  createdAt: string;
  deliveryTime: string;
  paymentMethod: string;
};

const initialOrders: MockOrder[] = [
  {
    id: "ord-101",
    orderNumber: "NX-8F32A910",
    title: "Complete brand identity package: logo, palette, type system",
    seller: "Marlowe Studio",
    buyer: "You",
    amountCents: 42000,
    currency: "USD",
    status: "in_progress",
    createdAt: "2026-09-26T14:30:00Z",
    deliveryTime: "5 day delivery",
    paymentMethod: "USDT (BEP20)",
  },
  {
    id: "ord-102",
    orderNumber: "NX-7C11D450",
    title: "Accessible React component library, themeable",
    seller: "Castellan UI",
    buyer: "You",
    amountCents: 9900,
    currency: "USD",
    status: "completed",
    createdAt: "2026-09-20T10:15:00Z",
    deliveryTime: "Instant delivery",
    paymentMethod: "SOL (Solana)",
  },
  {
    id: "ord-103",
    orderNumber: "NX-3E90F214",
    title: "Shopify theme customization and speed optimization",
    seller: "Renn Dev Co.",
    buyer: "You",
    amountCents: 65000,
    currency: "USD",
    status: "pending_payment",
    createdAt: "2026-09-27T02:00:00Z",
    deliveryTime: "7 day delivery",
    paymentMethod: "USDT (TRC20)",
  },
];

export default function OrdersPage() {
  return (
    <React.Suspense fallback={<div className="container py-12 text-center text-sm text-muted-foreground">Loading orders...</div>}>
      <OrdersContent />
    </React.Suspense>
  );
}

function OrdersContent() {
  const searchParams = useSearchParams();
  const [filter, setFilter] = React.useState<string>("all");
  const [orders, setOrders] = React.useState<MockOrder[]>(initialOrders);

  const isNew = searchParams.get("new");
  const newSlug = searchParams.get("slug");
  const newMethod = searchParams.get("method");

  React.useEffect(() => {
    if (isNew && newSlug) {
      const newOrder: MockOrder = {
        id: `ord-${Date.now()}`,
        orderNumber: `NX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        title: newSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        seller: "Verified Seller",
        buyer: "You",
        amountCents: 28000,
        currency: "USD",
        status: "pending_payment",
        createdAt: new Date().toISOString(),
        deliveryTime: "3 day delivery",
        paymentMethod: newMethod ? newMethod.toUpperCase() : "USDT (BEP20)",
      };

      setOrders((prev) => [newOrder, ...prev]);
    }
  }, [isNew, newSlug, newMethod]);

  const filteredOrders = orders.filter((ord) => {
    if (filter === "all") return true;
    if (filter === "active")
      return ["pending_payment", "paid", "in_progress", "delivered"].includes(
        ord.status
      );
    if (filter === "completed") return ord.status === "completed";
    if (filter === "disputed") return ord.status === "disputed";
    return true;
  });

  return (
    <div className="container py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Order Escrow Management
          </p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl">Your Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track active trades, verify payments, and approve completed deliveries.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/payment-methods">View Deposit Addresses</Link>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="mt-8 flex gap-2 border-b border-border pb-4">
        {[
          { id: "all", label: "All Orders" },
          { id: "active", label: "In Progress / Escrow" },
          { id: "completed", label: "Completed" },
          { id: "disputed", label: "Disputed" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
              filter === tab.id
                ? "bg-brand text-brand-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="mt-6 space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="group flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand/50 sm:flex-row sm:items-center"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-muted-foreground">
                    {order.orderNumber}
                  </span>
                  <OrderStatusBadge status={order.status} />
                  <span className="text-xs text-muted-foreground">
                    · {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-display text-lg leading-snug">{order.title}</h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span>Seller: <strong className="text-foreground">{order.seller}</strong></span>
                  <span>·</span>
                  <span>Payment: <strong className="text-foreground">{order.paymentMethod}</strong></span>
                  <span>·</span>
                  <span>{order.deliveryTime}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-6 border-t border-border pt-4 sm:border-0 sm:pt-0">
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Escrow Amount
                  </p>
                  <p className="font-mono text-xl font-bold text-foreground">
                    {formatPrice(order.amountCents, order.currency)}
                  </p>
                </div>
                <Button size="sm" variant="brand" asChild>
                  <Link href={`/orders/${order.id}`}>
                    Manage Order <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 font-display text-lg">No orders in this category</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse the marketplace to order verified services with escrow protection.
            </p>
            <Button variant="brand" size="sm" className="mt-4" asChild>
              <Link href="/marketplace">Explore Marketplace</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function OrderStatusBadge({ status }: { status: MockOrder["status"] }) {
  switch (status) {
    case "pending_payment":
      return (
        <Badge variant="outline" className="border-warning/50 text-warning bg-warning/10">
          Pending Deposit
        </Badge>
      );
    case "paid":
    case "in_progress":
      return (
        <Badge variant="brand" className="gap-1">
          <Lock className="h-3 w-3" /> Escrow Locked
        </Badge>
      );
    case "delivered":
      return (
        <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 bg-cyan-500/10">
          Delivered - Reviewing
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10 gap-1">
          <CheckCircle2 className="h-3 w-3" /> Completed
        </Badge>
      );
    case "disputed":
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="h-3 w-3" /> Disputed
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}
