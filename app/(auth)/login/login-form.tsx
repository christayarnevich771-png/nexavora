"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { loginAction, type AuthActionState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionState = {};

export function LoginForm() {
  const [state, action] = useFormState(loginAction, initialState);
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const callbackError = searchParams.get("error") === "auth_callback";

  return (
    <form action={action} className="mt-8 space-y-5">
      <input type="hidden" name="next" value={next} />
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">
            Forgot password?
          </Link>
        </div>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>

      {(state.error || callbackError) && (
        <p className="text-sm text-destructive" role="alert">
          {state.error ?? "The authentication link could not be completed. Please sign in again."}
        </p>
      )}

      <Button type="submit" className="w-full" size="lg">
        <SubmitLabel pending="Signing in…">Sign in</SubmitLabel>
      </Button>
    </form>
  );
}

function SubmitLabel({ pending, children }: { pending: string; children: ReactNode }) {
  const { pending: isPending } = useFormStatus();
  return <>{isPending ? pending : children}</>;
}
