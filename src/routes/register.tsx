import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { useState, useRef, useEffect } from "react";
import { PageShell } from "@/components/page-shell";
import { UserPlus, ArrowLeft, CheckCircle2, Info, Sparkles } from "lucide-react";

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
  const hasCheckedRef = useRef(false);

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
      console.error("Registration insert failed:", insertError);
      setError("Registration failed. Please try again.");
      setProcessing(false);
      return;
    }

    setRegistrationSuccess(true);
    setProcessing(false);
  };

  // After OAuth redirect, if user is now authenticated, auto-check registration
  useEffect(() => {
    if (!loading && isAuthenticated && user && !hasCheckedRef.current) {
      hasCheckedRef.current = true;
      handleRegister();
    }
  }, [loading, isAuthenticated, user]);

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
      <PageShell>
        <div className="text-center">
          <div className="h-10 w-10 mx-auto animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </PageShell>
    );
  }

  if (processing) {
    return (
      <PageShell>
        <div className="text-center space-y-4">
          <div className="h-10 w-10 mx-auto animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Setting up your account…</p>
        </div>
      </PageShell>
    );
  }

  // Already registered message
  if (alreadyRegistered) {
    return (
      <PageShell>
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-border bg-card/70 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-10">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Info className="h-8 w-8 text-primary" />
            </div>
            <h1 className="bg-gradient-to-br from-foreground via-foreground to-muted-foreground bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
              Already Registered
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              You have already registered with us. Please use the Sign In button to access your account.
            </p>
            <button
              onClick={handleOkClick}
              className="mt-8 w-full rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              OK
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  // Registration success message
  if (registrationSuccess) {
    return (
      <PageShell>
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-border bg-card/70 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-10">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="bg-gradient-to-br from-foreground via-foreground to-muted-foreground bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
              Registration Successful!
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Your account has been created. Please use the Sign In button to log in.
            </p>
            <button
              onClick={handleSuccessOk}
              className="mt-8 w-full rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              OK
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  // Default: show registration form
  return (
    <PageShell>
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-3xl border border-border bg-card/70 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          <div className="text-center">
            <div className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>Get started in seconds</span>
            </div>
            <h1 className="bg-gradient-to-br from-foreground via-foreground to-muted-foreground bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign up with your Google account to get started.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              onClick={handleGoogleSignIn}
              disabled={signingIn}
              className="group flex w-full items-center justify-center gap-3 rounded-xl border border-input bg-background/80 px-4 py-3.5 text-sm font-medium text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0"
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

          <div className="mt-8 space-y-3 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <a href="/login" className="font-medium text-primary hover:underline">
                Sign in
              </a>
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to Welcome
            </a>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
