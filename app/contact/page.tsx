import type { Metadata } from "next";
import { MessageCircle, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Contact support" };

// IMPORTANT: keep these exact values — do not invent other contact
// information.
const WHATSAPP_NUMBER_DISPLAY = "+63 970 653 6232";
const WHATSAPP_NUMBER_LINK = "639706536232"; // digits only, for the wa.me link
const TELEGRAM_HANDLE = "@ruoxi_mist";
const TELEGRAM_LINK = "https://t.me/ruoxi_mist";

export default function ContactPage() {
  return (
    <div className="container max-w-2xl py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
        Contact
      </p>
      <h1 className="mt-2 font-display text-3xl">Get in touch with NEXAVORA</h1>
      <p className="mt-3 max-w-prose text-sm text-muted-foreground">
        Reach the NEXAVORA support team directly on WhatsApp or Telegram.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex flex-col items-start gap-4 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/15 text-brand">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-medium">WhatsApp Support</h2>
              <p className="mt-1 font-mono text-sm text-muted-foreground">
                {WHATSAPP_NUMBER_DISPLAY}
              </p>
            </div>
            <Button asChild className="w-full">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER_LINK}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Message on WhatsApp
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-start gap-4 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/15 text-brand">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-medium">Telegram Support</h2>
              <p className="mt-1 font-mono text-sm text-muted-foreground">
                {TELEGRAM_HANDLE}
              </p>
            </div>
            <Button asChild className="w-full">
              <a href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer">
                Message on Telegram
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
