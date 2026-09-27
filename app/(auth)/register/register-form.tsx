"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { registerAction, type AuthActionState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionState = {};

export function RegisterForm() {
  const [state, action] = useFormState(registerAction, initialState);

  return (
    <form action={action} className="mt-8 space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          placeholder="Choose a username"
          minLength={3}
          maxLength={30}
          required
        />
        <p className="text-xs text-muted-foreground">
          3–30 characters. This will be your public username.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="displayName">Display name</Label>
        <Input
          id="displayName"
          name="displayName"
          autoComplete="name"
          maxLength={80}
          placeholder="Your display name"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <p className="text-xs text-muted-foreground">
          At least 8 characters.
        </p>
      </div>

      <label className="flex items-start gap-2 text-xs text-muted-foreground">
        <input
          type="checkbox"
          name="agree"
          required
          className="mt-0.5"
        />
        <span>
          I agree to the{" "}
          <Link
            href="/policies/terms"
            className="underline underline-offset-4"
          >
            Terms of service
          </Link>{" "}
          and confirm I will only list products or services I have the right
          to sell.
        </span>
      </label>

      {state.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      {state.success && (
        <p className="text-sm text-emerald-500" role="status">
          {state.success}
        </p>
      )}

      <Button type="submit" className="w-full" size="lg">
        <SubmitLabel pending="Creating account…">
          Create account
        </SubmitLabel>
      </Button>
    </form>
  );
}

function SubmitLabel({
  pending,
  children,
}: {
  pending: string;
  children: ReactNode;
}) {
  const { pending: isPending } = useFormStatus();

  return <>{isPending ? pending : children}</>;
}
