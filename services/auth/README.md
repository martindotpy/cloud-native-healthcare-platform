<h1 align="center">Auth Service</h1>

Central authentication and authorization service (TypeScript, Elysia).

This service handles user sign-up, login, token issuance and basic access
control. It provides REST endpoints used by frontend apps and other services.

Key points

- Entrypoint: `services/auth/src/index.ts`
- Framework: Elysia (Bun runtime)
- Health: `/_health` (GET)
- API documentation exposed via middleware (OpenAPI)
- Important env vars: `PORT`, `DATABASE_URL`, `BETTER_AUTH_SECRET`,
  `ADMIN_EMAIL`, `ADMIN_PASSWORD` — see `services/auth/.env.example`

Running locally

- With Docker: `docker compose up --build` (service name `service-auth`).
- Local (dev): install dependencies and run the entrypoint with your preferred
  manager (`bun`, `npm`, `pnpm`).

Operational notes

- The initializer (`services/auth/src/auth/auth-initializer.ts`) runs database
  migrations and seeds an admin user when necessary.
- Do not commit real credentials to the repository.
