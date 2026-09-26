import Link from "next/link";
import type { Metadata } from "next";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = { title: "Create an account" };

export default function RegisterPage() {
  return (
    <div>
      <h1 className="font-display text-2xl">Create your account</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Already have one?{" "}
        <Link href="/login" className="text-foreground underline underline-offset-4">Sign in</Link>
      </p>
      <RegisterForm />
    </div>
  );
}
