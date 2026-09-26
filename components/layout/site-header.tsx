"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const primaryNav = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/category/all", label: "Categories" },
  { href: "/messages", label: "Messages" },
  { href: "/orders", label: "Orders" },
  { href: "/payment-methods", label: "Payment methods" },
];

type HeaderProfile = {
  username: string;
  display_name: string | null;
  avatar_url: string | null;
};

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = React.useState<{ id: string; email?: string } | null>(null);
  const [profile, setProfile] = React.useState<HeaderProfile | null>(null);
  const supabase = React.useMemo(() => createClient(), []);

  React.useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(data.user ? { id: data.user.id, email: data.user.email } : null);

      if (data.user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("username, display_name, avatar_url")
          .eq("id", data.user.id)
          .maybeSingle();
        if (mounted) setProfile(profileData);
      } else {
        setProfile(null);
      }
    };

    void loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
      if (!session?.user) setProfile(null);
      else void loadSession();
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.push("/");
    router.refresh();
  }

  const isSignedIn = Boolean(user);
  const displayName = profile?.display_name || profile?.username || user?.email || "Account";
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "NX";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2" aria-label="NEXAVORA home">
            <Logomark />
            <span className="font-display text-lg tracking-tight">NEXAVORA</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {primaryNav.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
                    active && "text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden flex-1 items-center justify-center px-6 md:flex">
          <form action="/search" className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input name="q" placeholder="Search listings, sellers, categories…" className="h-9 pl-9" aria-label="Search" />
          </form>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            <ThemeToggle />
            {isSignedIn ? (
              <UserMenu displayName={displayName} initials={initials} onSignOut={signOut} />
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild><Link href="/login">Sign in</Link></Button>
                <Button variant="brand" size="sm" asChild><Link href="/register">Register</Link></Button>
              </>
            )}
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu"><Menu className="h-5 w-5" /></Button>
            </DialogTrigger>
            <DialogContent>
              <nav className="mt-10 flex flex-col gap-1">
                {primaryNav.map((item) => (
                  <DialogClose asChild key={item.href}>
                    <Link href={item.href} className="rounded-md px-3 py-2.5 text-base hover:bg-accent">{item.label}</Link>
                  </DialogClose>
                ))}
                <div className="my-3 h-px bg-border" />
                {isSignedIn ? (
                  <>
                    <DialogClose asChild><Link href="/profile" className="rounded-md px-3 py-2.5 text-base hover:bg-accent">Profile</Link></DialogClose>
                    <DialogClose asChild><Link href="/dashboard" className="rounded-md px-3 py-2.5 text-base hover:bg-accent">Dashboard</Link></DialogClose>
                    <DialogClose asChild><button type="button" onClick={signOut} className="rounded-md px-3 py-2.5 text-left text-base hover:bg-accent">Sign out</button></DialogClose>
                  </>
                ) : (
                  <>
                    <DialogClose asChild><Link href="/login" className="rounded-md px-3 py-2.5 text-base hover:bg-accent">Sign in</Link></DialogClose>
                    <DialogClose asChild><Link href="/register" className="rounded-md px-3 py-2.5 text-base font-medium text-brand hover:bg-accent">Register</Link></DialogClose>
                  </>
                )}
                <div className="mt-4 flex items-center justify-between px-3">
                  <span className="text-sm text-muted-foreground">Appearance</span>
                  <ThemeToggle />
                </div>
              </nav>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}

function UserMenu({ displayName, initials, onSignOut }: { displayName: string; initials: string; onSignOut: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label={`${displayName} account menu`}>
          <Avatar className="h-8 w-8"><AvatarFallback>{initials}</AvatarFallback></Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{displayName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><Link href="/profile">Profile</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link href="/dashboard">Seller dashboard</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link href="/orders">Orders</Link></DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={(event) => { event.preventDefault(); void onSignOut(); }}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Logomark() {
  // Original NEXAVORA mark: a hexagonal network node framing a geometric
  // N + V monogram. N (white/ink) and V (brand red) sit side by side,
  // reading as two parties meeting at a single exchange point.
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <path
        d="M13 1.5 24 7.75v10.5L13 24.5 2 18.25V7.75L13 1.5Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 18.5V7.5L11 18.5V7.5"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 7.5L18.5 18.5L22.5 7.5"
        stroke="hsl(var(--brand))"
        strokeWidth="2.1"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    </svg>
  );
}
