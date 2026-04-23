import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { PageShell } from "@/components/page-shell";
import { LogIn, ArrowLeft, Sparkles } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  const [checking, setChecking] = useState(false);

  // After sign-in, update updated_at and redirect to home
  useEffect(() => {
    if (!loading && isAuthenticated && user && !checking) {
      setChecking(true);
      // First check if user exists in our database
      supabase
        .from("users")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(async ({ data, error: selectError }) => {
          if (selectError || !data) {
            // User not registered — sign out so they can retry or register
            await supabase.auth.signOut();
            setError("Account not found. Please register first.");
            setChecking(false);
            return;
          }
          // User exists — update updated_at and redirect
          await supabase
            .from("users")
            .update({ updated_at: new Date().toISOString() })
            .eq("user_id", user.id);
          navigate({ to: "/home" });
        });
    }
  }, [loading, isAuthenticated, user, navigate, checking]);

  const handleGoogleSignIn = async () => {
    setError(null);
    setSigningIn(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/login",
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

  if (loading || checking) {
    return (
      <PageShell>
        <div className="text-center space-y-4">
          <div className="h-10 w-10 mx-auto animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">
            {checking ? "Signing you in…" : "Loading…"}
          </p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-3xl border border-border bg-card/70 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          <div className="text-center">
            <div className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <LogIn className="h-6 w-6 text-primary" />
            </div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>Welcome back</span>
            </div>
            <h1 className="bg-gradient-to-br from-foreground via-foreground to-muted-foreground bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
              Sign in to continue
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Pick up exactly where you left off.
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
              {signingIn ? "Signing in…" : "Continue with Google"}
            </button>
          </div>

          <div className="mt-8 space-y-3 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <a href="/register" className="font-medium text-primary hover:underline">
                Register
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
