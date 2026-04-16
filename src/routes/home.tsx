import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/home")({
  component: HomePage,
});

interface UserProfile {
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

function HomePage() {
  const { user, loading, signOut, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      supabase
        .from("users")
        .select("name, email, created_at, updated_at")
        .eq("user_id", user.id)
        .single()
        .then(({ data, error }) => {
          if (error || !data) {
            setLoadingProfile(false);
            return;
          }
          setProfile(data);
          setLoadingProfile(false);
        });
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  if (loading || loadingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
            {profile?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome, {profile?.name || "User"}
          </h1>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Profile Details</h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Name</span>
              <span className="text-sm font-medium text-foreground">{profile?.name}</span>
            </div>
            <div className="border-t border-border" />

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm font-medium text-foreground">{profile?.email}</span>
            </div>
            <div className="border-t border-border" />

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Registered</span>
              <span className="text-sm font-medium text-foreground">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "—"}
              </span>
            </div>
            <div className="border-t border-border" />

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Last Login</span>
              <span className="text-sm font-medium text-foreground">
                {profile?.updated_at ? new Date(profile.updated_at).toLocaleString() : "—"}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full rounded-lg border border-input bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
