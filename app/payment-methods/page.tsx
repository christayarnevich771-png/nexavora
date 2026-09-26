import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";

import {
  PaymentMethodCard,
  type PaymentMethod,
} from "@/components/payments/payment-method-card";

export const metadata: Metadata = { title: "Payment methods" };

// IMPORTANT: these addresses are copied verbatim from the brand brief.
// Do not reformat, shorten, or otherwise alter them.
const paymentMethods: PaymentMethod[] = [
  {
    id: "usdt-bep20",
    network: "BEP20 (BNB Smart Chain)",
    asset: "USDT",
    address: "0xc55b66fef8b19730d2208084c47fce226c3587aa",
  },
  {
    id: "usdt-trc20",
    network: "TRC20 (TRON)",
    asset: "USDT",
    address: "TCbxC5nXUoFsPgoa9FvSUqSN2qnmvxkUDU",
  },
  {
    id: "sol",
    network: "Solana",
    asset: "SOL",
    address: "E9B1KMumRSoLB1x13uhavQdyJjzqhnFVCKLsCnTSmxYP",
  },
];

export default function PaymentMethodsPage() {
  return (
    <div className="container max-w-3xl py-12">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
          Payment methods
        </p>
        <h1 className="mt-2 font-display text-3xl">Send payment on NEXAVORA</h1>
        <p className="mt-3 max-w-prose text-sm text-muted-foreground">
          NEXAVORA currently accepts manual crypto transfers to the wallet
          addresses below. Automatic payment verification is not yet
          available — after sending funds, confirm the transaction with the
          seller or support so your order can be marked as paid.
        </p>
      </div>

      <div className="mt-6 flex gap-3 rounded-lg border border-warning/40 bg-warning/10 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
        <p className="text-sm text-foreground">
          Always verify the network and wallet address before sending funds.
          Sending funds through the wrong network may result in permanent
          loss.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {paymentMethods.map((method) => (
          <PaymentMethodCard key={method.id} method={method} />
        ))}
      </div>
    </div>
  );
}
