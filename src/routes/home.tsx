import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { PageShell } from "@/components/page-shell";
import { LogOut, Mail, User, Calendar, Clock } from "lucide-react";

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
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !user) {
      navigate({ to: "/login" });
      return;
    }

    supabase
      .from("users")
      .select("name, email, created_at, updated_at")
      .eq("user_id", user.id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          // Not a registered user — send back to welcome
          navigate({ to: "/" });
          return;
        }
        setProfile(data);
        setVerified(true);
      });
  }, [loading, isAuthenticated, user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  // Block all content until auth + profile are fully verified
  if (!verified) {
    return (
      <PageShell>
        <div className="text-center space-y-4">
          <div className="h-10 w-10 mx-auto animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Verifying your account…</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto w-full max-w-lg">
        <div className="rounded-3xl border border-border bg-card/70 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          {/* Avatar + greeting */}
          <div className="text-center">
            <div className="relative mx-auto mb-5 h-24 w-24">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent blur-md opacity-60" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-4xl font-bold text-primary-foreground shadow-xl">
                {profile?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>
            <h1 className="bg-gradient-to-br from-foreground via-foreground to-muted-foreground bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
              Welcome, {profile?.name || "User"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Glad to see you again.
            </p>
          </div>

          {/* Profile details */}
          <div className="mt-8 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Profile Details
            </h2>

            <div className="space-y-2">
              <ProfileRow
                icon={<User className="h-4 w-4" />}
                label="Name"
                value={profile?.name ?? "—"}
              />
              <ProfileRow
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value={profile?.email ?? "—"}
              />
              <ProfileRow
                icon={<Calendar className="h-4 w-4" />}
                label="Registered"
                value={
                  profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString()
                    : "—"
                }
              />
              <ProfileRow
                icon={<Clock className="h-4 w-4" />}
                label="Last Login"
                value={
                  profile?.updated_at
                    ? new Date(profile.updated_at).toLocaleString()
                    : "—"
                }
              />
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-input bg-background/80 px-6 py-3 text-sm font-medium text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-destructive/40 hover:text-destructive hover:shadow-lg"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>
    </PageShell>
  );
}

function ProfileRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background/40 px-4 py-3 transition-colors hover:bg-background/70">
      <div className="flex items-center gap-3 text-muted-foreground">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </span>
        <span className="text-sm">{label}</span>
      </div>
      <span className="truncate text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
