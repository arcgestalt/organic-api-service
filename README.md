# Organic API Service (Serverless Backend)

An industry-standard, lightweight, ultra-fast serverless API gateway built using **Hono** and optimized for **Cloudflare Workers**. 

This repository is designed as a highly scalable, generic backend architecture. It provides a modular core optimized for any backend requirements—including e-commerce gateways (Stripe), high-performance databases (Drizzle + LibSQL), enterprise error tracking (Sentry), logging (Axiom), and auth handling.

---

## 🛠️ Tech Stack & Tooling

- **Core Router:** [Hono v4.12](https://hono.dev/) (The ultra-fast web framework built for Edge runtimes)
- **Deployment & CLI:** [Wrangler v4.111](https://developers.cloudflare.com/workers/wrangler/) (The official developer toolkit for Cloudflare Workers)
- **Database ORM:** [Drizzle ORM v0.45](https://orm.drizzle.team/) & [Drizzle Kit](https://orm.drizzle.team/docs/kit-overview) (The fastest TypeScript-first relational database client)
- **Database Client:** [LibSQL Client](https://github.com/tursodatabase/libsql-client-ts) (Turso/SQLite-compatible edge database driver)
- **Telemetry & Error Tracking:** [Sentry](https://sentry.io/) (Real-time application monitoring)
- **Analytics & Observability:** [Axiom](https://axiom.co/) (High-performance event-data logging)
- **Payment Gateway:** [Stripe JS SDK](https://stripe.com/) (Secure, edge-compatible financial transactions)
- **Testing:** [Vitest v4.1](https://vitest.dev/) (Subsecond unit and integration testing)
- **Code Quality:** [Biome v2.5](https://biomejs.dev/) (Unified formatter and linter)

---

## 🌲 Multi-Environment Git & Deployment Flow

This project utilizes a secure, automated staging-to-production deployment pipeline integrated with GitHub and Cloudflare Workers.

### **1. Environment Architecture**
We use two fully isolated Cloudflare Workers projects connected to the same GitHub repository:
- **Production (`organic-api-service`):** Deploys automatically when code is pushed/merged to the **`main`** branch.
- **Staging (`organic-api-service-staging`):** Deploys automatically when code is pushed/merged to the **`staging`** branch.

### **2. Dynamic Wrangler Configuration**
To deploy a single repository to multiple distinct Cloudflare Workers without maintaining separate configuration files, we use **Wrangler Environments** in `wrangler.toml`:

```toml
name = "organic-api-service"
main = "src/index.ts"
compatibility_date = "2026-07-16"
workers_dev = false

[vars]
CLOUDFLARE_API_ENVIRONMENT = "production"

[env.staging]
name = "organic-api-service-staging"

[env.staging.vars]
CLOUDFLARE_API_ENVIRONMENT = "staging"
```

### **3. Setting up your Cloudflare Dashboard (Deploy Commands):**
To ensure that Wrangler automatically targets the correct environment configuration during automatic Git builds:
- **For `organic-api-service` (Production):** 
  - Deploy command: `npx wrangler deploy` (default, deploys to top-level `organic-api-service`)
- **For `organic-api-service-staging` (Staging):**
  - Change your Deploy command in the dashboard build settings to:
    ```bash
    npx wrangler deploy --env staging
    ```
  *(This forces Wrangler to deploy using the `[env.staging]` block, correctly setting the staging worker name and runtime environment variables automatically!)*

---

## 🔒 Security & CORS Policy

To prevent unauthorized origin access while maintaining flexibility for multi-environment deployments, CORS is dynamically handled in `src/index.ts`:

```typescript
app.use(
  "*",
  cors({
    origin: (origin) => {
      // Safely allows localhost, Cloudflare Pages staging/preview URLs, and custom production domains
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
    credentials: true,
  }),
);
```

---

## 💻 Local Development Workflow

### **1. Setup & Install**
Navigate to your worker directory and install dependencies:
```bash
pnpm install
```

### **2. Run the Worker Locally**
```bash
pnpm run dev
```
- Your local Hono API server will start on **`http://localhost:8787`**.
- It is fully hot-reloaded. Any changes made to your API routes or logic will reflect in subseconds!

---

## 💎 Industry-Standard Code Quality

We enforce pre-commit validation hooks and branch protection policies to guarantee production-ready code.

### **Branch Protection**
Both `main` and `staging` branches on GitHub are protected. Commits can only be merged via Pull Requests after passing the **`validate`** job:
1. Fast linting and format verification with Biome.
2. Type-checking with TypeScript.
3. Unit and integration test validation with Vitest.

### **Local Commands**
- **Linting & Formatting:** 
  ```bash
  pnpm run format  # Formats files
  pnpm run lint    # Lints with auto-fixes
  ```
- **Run Unit Tests:**
  ```bash
  pnpm run test
  ```
- **Type-checking:**
  ```bash
  pnpm run typecheck
  ```
