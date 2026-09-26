import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div>
      <h1 className="font-display text-2xl">Sign in to NEXAVORA</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        New here?{" "}
        <Link
          href="/register"
          className="text-foreground underline underline-offset-4"
        >
          Create an account
        </Link>
      </p>

      <Suspense fallback={<div className="mt-6">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}