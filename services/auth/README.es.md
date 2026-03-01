<h1 align="center">Auth Service</h1>

Servicio central de autenticación y autorización (TypeScript, Elysia).

Gestiona registro, inicio de sesión, emisión de tokens y controles de acceso
básicos. Expone endpoints REST usados por las aplicaciones frontend y otros
servicios.

Puntos clave

- Entrypoint: `services/auth/src/index.ts`
- Framework: Elysia (runtime Bun)
- Health: `/_health` (GET)
- Documentación API via OpenAPI (middleware)
- Variables: `PORT`, `DATABASE_URL`, `BETTER_AUTH_SECRET`, `ADMIN_EMAIL`,
  `ADMIN_PASSWORD` — ver `services/auth/.env.example`

Arranque local

- Docker: `docker compose up --build` (servicio `service-auth`).
- Local (dev): instalar dependencias y ejecutar el entrypoint con `bun`, `npm` o
  `pnpm`.

Notas operativas

- El initializer (`services/auth/src/auth/auth-initializer.ts`) aplica
  migraciones y crea un usuario admin si es necesario.
- No almacenar credenciales reales en el repositorio.
