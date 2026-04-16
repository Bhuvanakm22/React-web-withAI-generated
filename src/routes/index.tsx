import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { user, loading, signOut, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Welcome</h1>
        <p className="text-muted-foreground">Sign in or register to get started</p>
        <div className="flex gap-4">
          <Link
            to="/login"
            className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="rounded-lg border border-input bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        Welcome, {user?.user_metadata?.full_name || user?.email || "User"}
      </h1>
      <p className="text-muted-foreground">{user?.email}</p>
      <button
        onClick={signOut}
        className="rounded-lg border border-input bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
      >
        Sign out
      </button>
    </div>
  );
}
