import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AuthError } from "@supabase/supabase-js";
import { PasswordInput, EmailInput, AuthButton, GoogleSignInButton } from "@/components/AuthForm";
import getUser from "@/action/getUser";
import LeftAuth from "@/components/LeftAuth";
import { revalidatePath } from "next/cache";

export const metadata: Metadata = {
  title: "The #1 AI Photo Generator",
  description: "Login to access your AI-powered professional headshots.",
};

interface LoginProps {
  searchParams: { message: string };
}

const handleRedirectBasedOnWorkStatus = (user: any): never => {
  console.log('🔍 Checking user payment and work status:', {
    paymentStatus: user.paymentStatus,
    workStatus: user.workStatus,
    userId: user.id
  });

  // Check if payment is completed
  const paymentSuccessful = user.paymentStatus && 
    ['SUCCESS', 'paid', 'completed', 'success'].includes(user.paymentStatus.toLowerCase());

  if (!paymentSuccessful) {
    console.log('❌ Payment not completed, redirecting to forms');
    return redirect("/forms");
  }

  console.log('✅ Payment completed, checking work status');

  const workStatus = (user.workStatus || "").toLowerCase();
  switch (workStatus) {
    case "":
    case "null":
    case null:
    case undefined:
      console.log('📝 No work status, redirecting to upload intro');
      return redirect("/upload/intro");
    case "ongoing":
      console.log('⏳ Work in progress, redirecting to wait page');
      return redirect("/wait");
    case "completed":
    case "complete":
      console.log('🎉 Work completed, redirecting to dashboard');
      return redirect("/dashboard");
    default:
      console.log('❓ Unknown work status, redirecting to forms');
      return redirect("/forms");
  }
};

export default async function Login({ searchParams }: LoginProps) {
  // Check if user is logged in
  const userData: any = await getUser();
  const user = userData?.[0];

  // Only redirect if a user is found
  if (user) {
    return handleRedirectBasedOnWorkStatus(user);
  }

  // If no user is found, continue with the login page rendering

  const signIn = async (formData: FormData): Promise<never> => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(
        "error name: ",
        error.name,
        "error code: ",
        error.code,
        "error message: ",
        error.message
      );

      let errorMessage = "Could not authenticate user";

      if (error instanceof AuthError) {
        switch (error.code) {
          case "invalid_login_credentials":
            errorMessage = "Invalid email or password. Please try again.";
            break;
          case "invalid_email":
            errorMessage = "Please enter a valid email address.";
            break;
          case "too_many_requests":
            errorMessage = "Too many login attempts. Please try again later.";
            break;
          default:
            errorMessage = error.message;
        }
      } else {
        errorMessage = `Unexpected error: ${error}`;
      }

      return redirect(`/login?message=${encodeURIComponent(errorMessage)}`);
    } else {
      revalidatePath("/login", "layout");
      
      // After successful login, check payment status and redirect accordingly
      const userData: any = await getUser();
      const user = userData?.[0];
      
      if (user) {
        return handleRedirectBasedOnWorkStatus(user);
      } else {
        // If no user data found, redirect to forms to create profile
        return redirect("/forms");
      }
    }
  };

  const signInWithGoogle = async () => {
    "use server";
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // Use env value if available, otherwise default to localhost for dev
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/callback`,
      },
    });

    if (error) {
      return redirect(`/login?message=Could not authenticate with Google`);
    }

    return redirect(data.url);
  };

  return (
    <div className="flex h-screen">
      <LeftAuth />
      <div className="w-full md:w-1/2 bg-mainWhite flex items-center justify-center p-4 md:p-12">
        <div className="w-full max-w-md">
          <div className="bg-[#FCFBF7] p-8 rounded-lg border border-gray-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
            <h2 className="text-3xl font-bold text-mainBlack mb-2 text-center">
              Welcome back!
            </h2>
            <p className="text-gray-600 mb-8 text-center">
              Sign in to your account
            </p>

            <form
              action={signIn}
              className="animate-in flex-1 flex flex-col w-full justify-center gap-3 text-mainBlack"
            >
              <EmailInput
                label="Email"
                name="email"
                placeholder="you@example.com"
                type="email"
                required
              />
              <PasswordInput
                label="Password"
                name="password"
                placeholder="••••••••"
                type="password"
                required
              />
              <AuthButton pendingText="Signing In...">Sign In</AuthButton>

              {searchParams?.message && (
                <p className="mt-4 p-4 bg-red-50 text-red-600 text-center rounded-md border border-red-100">
                  {searchParams.message}
                </p>
              )}
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-[#FCFBF7] px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="w-full">
              <GoogleSignInButton formAction={signInWithGoogle} pendingText="Signing in with Google...">
                Continue with Google
              </GoogleSignInButton>
            </div>

            <p className="text-sm text-gray-600 text-center mt-4">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-mainBlack font-semibold hover:text-gray-700 transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
