import Link from "next/link";
import type { Metadata } from "next";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = { title: "Reset your password" };

export default function ForgotPasswordPage() {
  return (
    <div>
      <h1 className="font-display text-2xl">Reset your password</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        We&apos;ll send a reset link to your email.{" "}
        <Link href="/login" className="text-foreground underline underline-offset-4">Back to sign in</Link>
      </p>
      <ForgotPasswordForm />
    </div>
  );
}
