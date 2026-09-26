"use client";

import type { ReactNode } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { forgotPasswordAction, type AuthActionState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionState = {};

export function ForgotPasswordForm() {
  const [state, action] = useFormState(forgotPasswordAction, initialState);

  return (
    <form action={action} className="mt-8 space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      {state.error && <p className="text-sm text-destructive" role="alert">{state.error}</p>}
      {state.success && <p className="text-sm text-emerald-500" role="status">{state.success}</p>}
      <Button type="submit" className="w-full" size="lg">
        <SubmitLabel pending="Sending…">Send reset link</SubmitLabel>
      </Button>
    </form>
  );
}

function SubmitLabel({ pending, children }: { pending: string; children: ReactNode }) {
  const { pending: isPending } = useFormStatus();
  return <>{isPending ? pending : children}</>;
}
