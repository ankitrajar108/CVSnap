'use server'

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AuthError } from "@supabase/supabase-js";
import { sendEmail } from "./sendEmail";

async function sendWelcomeEmail(email: string) {
  return await sendEmail({
    to: email,
    from: process.env.NOREPLY_EMAIL || 'noreply@cvsnap.app',
    templateId: 'd-def6b236e0a64721a3420e36b19cd379',
  });
}

export async function signUp(formData: FormData): Promise<never> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { data: signUpData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // After email confirmation, redirect back to our callback to exchange the code for a session
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/callback`,
    },
  });

  if (error) {
    let errorMessage = "An error occurred during signup.";
    if (error instanceof AuthError) {
      switch (error.status) {
        case 400:
          errorMessage = "Invalid email or password format.";
          break;
        case 422:
          errorMessage = "Email already in use.";
          break;
        default:
          errorMessage = error.message;
      }
    }
    return redirect(`/signup?message=${encodeURIComponent(errorMessage)}`);
  }

  // If email confirmations are enabled, Supabase will not create a session yet.
  // In that case, prompt the user to check their inbox and do not proceed further.
  if (!signUpData.session) {
    return redirect(
      `/login?message=${encodeURIComponent(
        "Check your email to confirm your account, then sign in."
      )}`
    );
  }

  // We have a session -> user is fully signed-in. Proceed with profile upsert and welcome email.
  const { error: updateError } = await supabase
    .from("userTable")
    .upsert({ id: signUpData.user?.id, email })
    .select();

  if (updateError) {
    console.error("Error updating userTable:", updateError);
  }

  // Send welcome email (disabled temporarily due to SendGrid config)
  // try {
  //   await sendWelcomeEmail(email);
  // } catch (e) {
  //   console.warn("Welcome email failed:", e);
  // }

  return redirect("/forms?signupCompleted");
} 