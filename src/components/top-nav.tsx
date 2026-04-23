import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, FileText, Send, Sparkles } from "lucide-react";

export function TopNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cvOpen, setCvOpen] = useState(false);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCvOpen(false);
      }
    }
    if (cvOpen) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [cvOpen]);

  const handleRequestCV = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/request-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Failed to send request");
      }
      setSuccess(true);
      setName("");
      setTimeout(() => {
        setSuccess(false);
        setCvOpen(false);
      }, 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-30">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
        <Link to="/" className="flex items-center gap-2 text-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Bhuvana K.</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 sm:flex">
          <Link
            to="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-card/60 hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>
          <Link
            to="/contact"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-card/60 hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            Contact
          </Link>

          {/* CV request dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setCvOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <FileText className="h-4 w-4" />
              Request CV
            </button>

            {cvOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border bg-card/95 p-5 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
                {success ? (
                  <div className="text-center space-y-2 py-4">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                      <Send className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-sm font-medium text-foreground">Request sent!</p>
                    <p className="text-xs text-muted-foreground">
                      Bhuvana will get back to you soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleRequestCV} className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        Request a copy of my CV
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Enter your name and I'll be notified.
                      </p>
                    </div>

                    <div>
                      <label htmlFor="cv-name" className="sr-only">
                        Your name
                      </label>
                      <input
                        id="cv-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        maxLength={100}
                        disabled={submitting}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                      />
                    </div>

                    {error && (
                      <p className="text-xs text-destructive">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting || !name.trim()}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send request
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-lg border border-border bg-card/60 p-2 text-foreground sm:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mx-4 rounded-2xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur-xl sm:hidden">
          <div className="flex flex-col gap-1">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-background/60"
            >
              Home
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-background/60"
            >
              Contact
            </Link>
            <button
              onClick={() => {
                setMobileOpen(false);
                setCvOpen(true);
              }}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              <FileText className="h-4 w-4" />
              Request CV
            </button>
          </div>
        </div>
      )}
    </header>
  );
}