import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, LogIn, UserPlus, Sparkles, Shield, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-12">
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-accent/30 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/20 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Welcome to your new experience</span>
        </div>

        {/* Heading */}
        <h1 className="bg-gradient-to-br from-foreground via-foreground to-muted-foreground bg-clip-text font-bold tracking-tight text-transparent sm:text-6xl md:text-7xl text-6xl">
          Welcome👋
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
          Sign in to pick up where you left off, or create a new account in seconds to get started.
        </p>

        {/* CTA cards */}
        <div className="mt-10 grid w-full gap-4 sm:grid-cols-2">
          <Link
            to="/login"
            className="group relative overflow-hidden rounded-2xl border border-border bg-primary p-6 text-left text-primary-foreground shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100 text-blue-600" />
            <div className="relative flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/15 backdrop-blur-sm">
                <LogIn className="h-5 w-5" />
              </div>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </div>
            <h2 className="relative mt-6 text-xl font-semibold">Sign in</h2>
            <p className="relative mt-1 text-sm text-primary-foreground/80">
              Already have an account? Jump right back in.
            </p>
          </Link>

          <Link
            to="/register"
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 text-left text-foreground shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <UserPlus className="h-5 w-5 text-primary" />
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
            </div>
            <h2 className="relative mt-6 text-xl font-semibold">Create account</h2>
            <p className="relative mt-1 text-sm text-muted-foreground">
              New here? Set up your account in less than a minute.
            </p>
          </Link>
        </div>

        {/* Feature highlights */}
        <div className="mt-12 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card/50 p-3 backdrop-blur-sm">
            <Shield className="h-4 w-4 shrink-0 text-primary" />
            <span className="text-xs font-medium text-foreground">Secure by default</span>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card/50 p-3 backdrop-blur-sm">
            <Zap className="h-4 w-4 shrink-0 text-primary" />
            <span className="text-xs font-medium text-foreground">Lightning fast</span>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card/50 p-3 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 shrink-0 text-primary" />
            <span className="text-xs font-medium text-foreground">Beautifully simple</span>
          </div>
        </div>
      </div>
    </div>
  );
}
