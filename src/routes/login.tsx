import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

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
      supabase
        .from("users")
        .update({ updated_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .then(async ({ error: updateError }) => {
          if (updateError) {
            // User not registered — sign out so they can retry or register
            await supabase.auth.signOut();
            setError("Account not found. Please register first.");
            setChecking(false);
            return;
          }
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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 mx-auto animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">
            {checking ? "Signing you in…" : "Loading…"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your account to continue
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
            {signingIn ? "Signing in…" : "Continue with Google"}
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a href="/register" className="text-primary hover:underline">
            Register
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
