"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface OrderButtonProps {
  listing: {
    slug: string;
    title: string;
    priceCents: number;
    currency: string;
    deliveryTime: string;
    seller: {
      name: string;
    };
  };
}

export function OrderButton({ listing }: OrderButtonProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [method, setMethod] = React.useState<"usdt-bep20" | "usdt-trc20" | "sol">("usdt-bep20");
  const [notes, setNotes] = React.useState("");
  const supabase = React.useMemo(() => createClient(), []);

  async function handleCreateOrder(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        router.push(`/login?next=/listing/${listing.slug}`);
        return;
      }

      // We can generate a client order reference or redirect to payment-methods / orders
      // Redirecting user to orders flow
      setOpen(false);
      router.push(`/orders?new=true&slug=${listing.slug}&method=${method}`);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" variant="brand" className="w-full text-base font-semibold">
          <Lock className="h-4 w-4 mr-2" />
          Order with Escrow Protection
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Initiate Escrow Order</DialogTitle>
          <DialogDescription>
            Your payment is held safely in escrow and only released after you confirm delivery.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateOrder} className="mt-4 space-y-4">
          <div className="rounded-lg border border-border bg-card p-4 space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-muted-foreground">Item:</span>
              <span className="text-right line-clamp-1 max-w-[200px]">{listing.title}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Seller:</span>
              <span>{listing.seller.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery:</span>
              <span>{listing.deliveryTime}</span>
            </div>
            <div className="ledger-rule my-2" />
            <div className="flex justify-between items-center">
              <span className="font-medium text-foreground">Total to lock:</span>
              <span className="font-mono text-xl font-bold text-brand">
                {formatPrice(listing.priceCents, listing.currency)}
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
              Select Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod("usdt-bep20")}
                className={`rounded-md border p-2.5 text-center text-xs font-medium transition-all ${
                  method === "usdt-bep20"
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-border hover:border-border/80"
                }`}
              >
                USDT (BEP20)
              </button>
              <button
                type="button"
                onClick={() => setMethod("usdt-trc20")}
                className={`rounded-md border p-2.5 text-center text-xs font-medium transition-all ${
                  method === "usdt-trc20"
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-border hover:border-border/80"
                }`}
              >
                USDT (TRC20)
              </button>
              <button
                type="button"
                onClick={() => setMethod("sol")}
                className={`rounded-md border p-2.5 text-center text-xs font-medium transition-all ${
                  method === "sol"
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-border hover:border-border/80"
                }`}
              >
                SOL (Solana)
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
              Requirement / Order Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe your specific instructions or files for the seller..."
              className="w-full rounded-md border border-input bg-background p-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              rows={3}
            />
          </div>

          <div className="rounded-lg bg-secondary/50 p-3 text-xs text-muted-foreground flex gap-2.5">
            <ShieldCheck className="h-4 w-4 text-brand shrink-0 mt-0.5" />
            <span>NEXAVORA Escrow Guarantee: Sellers cannot withdraw until you verify and approve the delivered files.</span>
          </div>

          <Button type="submit" variant="brand" className="w-full" disabled={loading}>
            {loading ? "Processing..." : "Confirm & Proceed to Payment"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
