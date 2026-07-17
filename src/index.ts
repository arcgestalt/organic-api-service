import { Hono } from "hono";
import { cors } from "hono/cors";

type Bindings = Record<string, unknown>;

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS for local development (localhost) and deployed apps
app.use(
  "*",
  cors({
    origin: (origin) => {
      // Allow local development ports, *.pages.dev subdomains, or custom organic-app domains
      if (
        !origin ||
        origin.startsWith("http://localhost:") ||
        origin.endsWith(".pages.dev") ||
        origin.includes("organic-app")
      ) {
        return origin;
      }
      return null;
    },
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
