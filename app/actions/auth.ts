"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthActionState = {
  error?: string;
  success?: string;
};

function getFormData(
  prevStateOrFormData: AuthActionState | FormData,
  maybeFormData?: FormData
): FormData {
  return maybeFormData ?? (prevStateOrFormData as FormData);
}

export async function loginAction(
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect(next || "/");
}

export async function registerAction(
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const username = String(formData.get("username") ?? "").trim();

  const displayName = String(
    formData.get("display_name") ??
      formData.get("displayName") ??
      ""
  ).trim();

  if (!email || !password || !username) {
    return {
      error: "Email, password, and username are required.",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        display_name: displayName || username,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.session) {
    redirect("/");
  }

  return {
    success:
      "Registration successful. Please check your email to confirm your account.",
  };
}

export async function forgotPasswordAction(
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "Email is required." };
  }

  const supabase = await createClient();

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(
    email,
    {
      redirectTo: `${siteUrl}/auth/callback?next=/update-password`,
    }
  );

  if (error) {
    return { error: error.message };
  }

  return {
    success:
      "If an account exists for that email, a password reset link has been sent.",
  };
}

export async function updatePasswordAction(
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const password = String(formData.get("password") ?? "");

  if (!password) {
    return { error: "Password is required." };
  }

  if (password.length < 6) {
    return {
      error: "Password must be at least 6 characters.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/");
}

/*
 * Compatibility exports.
 * These keep any existing code that uses the older function names working.
 */

export async function signIn(formData: FormData) {
  return loginAction({}, formData);
}

export async function signUp(formData: FormData) {
  return registerAction({}, formData);
}

export async function resetPassword(formData: FormData) {
  return forgotPasswordAction({}, formData);
}

export async function updatePassword(formData: FormData) {
  return updatePasswordAction({}, formData);
}

export async function signOut() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect("/");
}