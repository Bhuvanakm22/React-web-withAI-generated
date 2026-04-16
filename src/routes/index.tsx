import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
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
