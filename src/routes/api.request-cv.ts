import { createFileRoute } from "@tanstack/react-router";

/**
 * POST /api/request-cv
 * Body: { name: string }
 *
 * Sends a notification email to Bhuvana when someone requests her CV.
 * Currently logs the request — once the email domain is configured, this
 * will dispatch via Lovable Emails to bhuvana.kandasamy.uk@gmail.com.
 */
export const Route = createFileRoute("/api/request-cv")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { name?: unknown };
          const rawName = typeof body.name === "string" ? body.name.trim() : "";

          if (!rawName) {
            return Response.json(
              { error: "Name is required" },
              { status: 400 },
            );
          }
          if (rawName.length > 100) {
            return Response.json(
              { error: "Name must be 100 characters or fewer" },
              { status: 400 },
            );
          }

          // Strip control characters but keep unicode letters/spaces.
          const name = rawName.replace(/[\u0000-\u001F\u007F]/g, "");

          // TODO: Once Lovable Emails domain is verified, send email to
          // bhuvana.kandasamy.uk@gmail.com with subject:
          //   "Hey Bhuvane, <name> needs your CV"
          console.log(
            `[CV REQUEST] Hey Bhuvane, ${name} needs your CV`,
          );

          return Response.json({ ok: true });
        } catch {
          return Response.json(
            { error: "Invalid request body" },
            { status: 400 },
          );
        }
      },
    },
  },
});