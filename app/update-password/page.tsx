"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { updatePasswordAction, type AuthActionState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionState = {};

export default function UpdatePasswordPage() {
  const [state, action] = useFormState(updatePasswordAction, initialState);

  return (
    <div className="container flex min-h-[calc(100vh-8rem)] max-w-md items-center py-12">
      <div className="w-full">
        <h1 className="font-display text-2xl">Choose a new password</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Set a new password for your NEXAVORA account.
        </p>

        <form action={action} className="mt-8 space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="password">New password</Label>
            <Input id="password" name="password" type="password" minLength={8} autoComplete="new-password" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmation">Confirm password</Label>
            <Input id="confirmation" name="confirmation" type="password" minLength={8} autoComplete="new-password" required />
          </div>

          {state.error && <p className="text-sm text-destructive" role="alert">{state.error}</p>}

          <Button type="submit" className="w-full" size="lg">
            <SubmitLabel pending="Updating…">Update password</SubmitLabel>
          </Button>
        </form>

        <Link href="/login" className="mt-5 block text-center text-sm text-muted-foreground hover:text-foreground">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}

function SubmitLabel({ pending, children }: { pending: string; children: ReactNode }) {
  const { pending: isPending } = useFormStatus();
  return <>{isPending ? pending : children}</>;
}
