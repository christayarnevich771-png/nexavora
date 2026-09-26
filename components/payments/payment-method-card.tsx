"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type PaymentMethod = {
  id: string;
  network: string;
  asset: string;
  address: string;
};

export function PaymentMethodCard({ method }: { method: PaymentMethod }) {
  const [copied, setCopied] = React.useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(method.address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — the address is still selectable/visible.
    }
  }

  return (
    <Card id={method.id} className="scroll-mt-24">
      <CardContent className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-medium">{method.asset}</p>
            <p className="text-xs text-muted-foreground">{method.network}</p>
          </div>
          <Button size="sm" variant="outline" onClick={handleCopy} className="gap-1.5">
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy address
              </>
            )}
          </Button>
        </div>

        <div className="ledger-rule mt-4" />

        <p
          className="mt-4 break-all rounded-md border border-border bg-muted px-3 py-2.5 font-mono text-sm"
          aria-label={`${method.asset} ${method.network} address`}
        >
          {method.address}
        </p>
      </CardContent>
    </Card>
  );
}
