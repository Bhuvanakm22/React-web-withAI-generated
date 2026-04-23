import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, User, ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { TopNav } from "@/components/top-nav";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Bhuvana Kandasamy" },
      {
        name: "description",
        content:
          "Get in touch with Bhuvana Kandasamy via email or phone for collaborations and opportunities.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <TopNav />
      <PageShell>
        <div className="mx-auto w-full max-w-2xl">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              <Mail className="h-3 w-3 text-primary" />
              <span>Get in touch</span>
            </div>
            <h1 className="bg-gradient-to-br from-foreground via-foreground to-muted-foreground bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
              Contact Us
            </h1>
            <p className="mt-3 text-base text-muted-foreground">
              Feel free to reach out — I'd love to hear from you.
            </p>
          </div>

          <div className="mt-10 rounded-3xl border border-border bg-card/70 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <ContactRow
              icon={<User className="h-5 w-5" />}
              label="Name"
              value="Bhuvana Kandasamy"
            />
            <ContactRow
              icon={<Phone className="h-5 w-5" />}
              label="Mobile"
              value="+44 7721874585"
              href="tel:+447721874585"
            />
            <ContactRow
              icon={<Mail className="h-5 w-5" />}
              label="Email"
              value="bhuvana.kandasamy.uk@gmail.com"
              href="mailto:bhuvana.kandasamy.uk@gmail.com"
              isLast
            />
          </div>

          <div className="mt-8 text-center">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Welcome
            </a>
          </div>
        </div>
      </PageShell>
    </>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
  isLast,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  isLast?: boolean;
}) {
  const content = (
    <div
      className={`flex items-center gap-4 py-4 ${
        !isLast ? "border-b border-border" : ""
      }`}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 truncate text-base font-medium text-foreground">
          {value}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block transition-opacity hover:opacity-80">
        {content}
      </a>
    );
  }
  return content;
}