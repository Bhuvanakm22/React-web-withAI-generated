import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleGoogleSignIn = async () => {
    setError(null);
    setSigningIn(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/register",
      });
      if (result.error) {
        setError(result.error.message || "Sign in failed");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unexpected error occurred");
    } finally {
      setSigningIn(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      // Not authenticated yet — trigger Google sign-in
      await handleGoogleSignIn();
      return;
    }

    setProcessing(true);
    setError(null);

    // Check if already registered
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      setAlreadyRegistered(true);
      setProcessing(false);
      return;
    }

    // Insert new user
    const name = user.user_metadata?.full_name || user.user_metadata?.name || "User";
    const email = user.email || "";

    const { error: insertError } = await supabase.from("users").insert({
      user_id: user.id,
      name,
      email,
    });

    if (insertError) {
      if (insertError.code === "23505") {
        setAlreadyRegistered(true);
        setProcessing(false);
        return;
      }
      setError(insertError.message);
      setProcessing(false);
      return;
    }

    setRegistrationSuccess(true);
    setProcessing(false);
  };

  // After OAuth redirect, if user is now authenticated, auto-check registration
  // Only auto-trigger if this looks like an OAuth callback (hash contains tokens)
  const isOAuthCallback = typeof window !== 'undefined' && (window.location.hash.includes('access_token') || window.location.search.includes('code='));
  if (isOAuthCallback && isAuthenticated && user && !alreadyRegistered && !registrationSuccess && !processing && !error) {
    setTimeout(() => handleRegister(), 0);
  }

  const handleOkClick = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  const handleSuccessOk = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (processing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 mx-auto animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Setting up your account…</p>
        </div>
      </div>
    );
  }

  // Already registered message
  if (alreadyRegistered) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Already Registered
          </h1>
          <p className="text-muted-foreground">
            You have already registered with us. Please use the Sign In button to access your account.
          </p>
          <button
            onClick={handleOkClick}
            className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            OK
          </button>
        </div>
      </div>
    );
  }

  // Registration success message
  if (registrationSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
            <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Registration Successful!
          </h1>
          <p className="text-muted-foreground">
            Your account has been created. Please use the Sign In button to log in.
          </p>
          <button
            onClick={handleSuccessOk}
            className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            OK
          </button>
        </div>
      </div>
    );
  }

  // Default: show registration form
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign up with your Google account to get started
          </p>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={signingIn}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-input bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {signingIn ? "Signing up…" : "Sign up with Google"}
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="text-primary hover:underline">
            Sign in
          </a>
        </p>
        <p className="text-center text-sm text-muted-foreground">
          <a href="/" className="text-muted-foreground hover:text-foreground hover:underline">
            ← Back to Welcome
          </a>
        </p>
      </div>
    </div>
  );
}
