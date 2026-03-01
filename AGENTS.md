AGENTS — Agent Guidelines for this repo

This document tells agentic coding tools how to build, lint, run (and run a
single) test, and follow code-style conventions in this monorepo.

Important repo files to inspect for context:

- `package.json`
- `eslint.config.js`
- `.editorconfig`
- `README.md`

Build / Lint / Test commands

- Install dependencies (root): `bun install` (preferred) or `npm install`.
- Build everything (Java + TypeScript):
  - TypeScript / Bun: `bun install` then `bun run --filter '*' build`
    (per-package scripts may vary).
  - Java (all microservices): `./mvnw clean install -DskipTests` (Windows:
    `\.\mvnw clean install -DskipTests`).
- Run dev servers:
  - Boot TypeScript services (root): `bun run --filter '*' dev` or run the `dev`
    script inside a package (example: `services/auth` has `bun run dev`).
  - Boot Quarkus Java microservices (per-service): `./mvnw quarkus:dev` (inside
    the microservice folder).
- Lint & format (root):
  - Format: `bun run format` (maps to `prettier --write .` defined in
    `package.json`).
  - Lint: `bun run lint` (maps to `eslint . --ext js,ts,jsx,tsx,cjs,mjs --fix`).
  - Pre-commit hooks: Husky + lint-staged are configured (`husky` and
    `lint-staged` in `package.json`).

Tests — running a single test

- Java (maven / surefire): run a single test class or method with maven's
  `-Dtest`:
  - Run a single class:
    `./mvnw -pl services/appointment -Dtest=MyTestClass test`
  - Run a single method:
    `./mvnw -pl services/appointment -Dtest=MyTestClass#myMethod test`
  - If you run from root and tests belong to another module, use `-pl` or run
    inside the module directory.

- TypeScript / Bun / Vitest (not every package includes tests):
  - If this repo uses Bun's test runner: `bun test path/to/testfile.test.ts` or
    `bun test --filter "pattern"`.
  - If the package uses Vitest/Jest: prefer `bunx vitest -t "test name"` or
    `npx vitest -t "test name"`.
  - If unsure: inspect a package's `package.json` for `test` / `devDependencies`
    (Vitest/Jest) and follow that package's script.

Code Style Guidelines (for agents) General

- Follow existing configs: prefer the rules in `eslint.config.js` and Prettier
  (project uses `eslint` + `prettier` plugins).
- Run `bun run lint` and `bun run format` before committing changes. The repo
  uses `lint-staged` to run both on staged files.

Imports

- Use explicit named imports where possible; keep imports grouped by external
  packages → internal shared packages → relative local imports.
- The repo uses Prettier plugins that may reorder or organize imports; let the
  formatter do import reorganization. Do not fight automatic import
  organization.
- Avoid deep relative ladders when a package export exists (use workspaces where
  appropriate: `@healthcare/shared`, `@healthcare/database`).

Formatting

- Prettier is the canonical formatter. Use `bun run format` or
  `prettier --write`.
- Keep line length reasonable (Prettier defaults apply). Do not introduce custom
  formatting unless necessary.
- Use ASCII characters unless a file already contains non-ASCII and it's
  necessary.

Types & TypeScript

- Prefer explicit types on exported functions, public methods and module-level
  constants. For small internal helpers inferred types are acceptable.
- Use `tsconfig` settings defined in the repository (`tsconfig.base.json` and
  package-level `tsconfig.json`).
- Prefer `readonly` where object/array mutation is not intended.
- Use discriminated unions and zod (this repo uses `zod`) for runtime validation
  of external input (requests, env parsing) and keep validation close to the
  boundary.
- Keep `any` use minimal — if you must use it, add a short inline comment
  explaining why and where it will be narrowed.

Naming conventions

- Types & interfaces: PascalCase (eslint enforces this for `interface` and
  `typeAlias`).
- Classes: PascalCase.
- Functions, variables, parameters: camelCase.
- Constants (module-level, exported): UPPER_SNAKE_CASE only when truly constant;
  prefer `const myValue = ...` with camelCase otherwise.
- Files: kebab-case or camelCase are both present; prefer the existing pattern
  in the folder. Keep extensions accurate (`.ts`, `.js`, `.tsx`).

Error handling

- Use typed error classes: this repo includes
  `shared/typescript/src/lib/error.ts` with a `BaseError`. Extend it for
  domain-specific errors to enable structured handling.
- Always attach context where possible: throw new MyError('message', { cause })
  when re-throwing or when wrapping lower-level errors.
- Do not swallow errors. If an error must be handled silently, add a clear
  comment and log the event at appropriate level.
- For HTTP handlers: return well-formed error responses (use OpenAPI/middleware
  patterns in `services/auth/src/core/middleware` where present).

Logging & observability

- Use the shared logger utilities (see `shared/typescript/src/log/*`).
- Log structured JSON (pino/consola are used in the repo). Include request id /
  trace context when present.

Concurrency & async

- Prefer async/await for asynchronous flows. Do not mix callback-style and
  promise-style in the same code path.
- Cancelation & timeouts: respect request context where provided (e.g., signal,
  AbortController).

Security

- Never commit secrets. `.env` exists in the repo but keep secrets out of
  version control.
- Validate external input (use zod where appropriate) and avoid serializing
  sensitive fields into logs.

Tests & CI expectations

- Unit tests should be fast and isolated; integration tests that rely on
  DB/services should use dev containers or
  `docker compose -f docker-compose.dev.yml up` as needed (documented in
  `README.md`).
- Java tests use Maven and Quarkus test helpers; run them with `./mvnw test` at
  service-level.

Commit & PR hygiene for agents

- Prefer small, focused changes. Run lint/format locally before creating
  commits.
- If the change touches TypeScript + Java, split the work into separate logical
  commits when possible.

Repo-specific notes & conventions

- Monorepo workspaces: `apps/*`, `services/*`, `shared/typescript`, `database` —
  prefer workspace imports (see `package.json` root and package packages).
- Pre-commit hooks: `husky` + `lint-staged` are configured in `package.json`.
- ESLint config: `eslint.config.js` contains project-wide rules and exceptions
  (notably: `@typescript-eslint/no-unused-vars` is strict and naming conventions
  for types/interfaces are enforced).

Cursor / Copilot rules

- No `.cursor/rules/` or `.cursorrules` found in the repo root.
- No Copilot-specific instructions file found at
  `.github/copilot-instructions.md`.
- If you rely on organization-level agent/cursor rules, check the host
  environment; this repository has no repo-scoped Cursor/Copilot rules to
  include.

If you are unsure what to run

- Inspect package-level `package.json` inside the package you plan to change
  (example `services/auth/package.json`) and follow its `scripts`.
- If you need to run a single Java test and the module contains multiple
  microservices, use `-pl` to select the module or run the command in the module
  dir.

Quick reference — useful commands

- Install: `bun install`
- Format: `bun run format`
- Lint: `bun run lint`
- Build Java services: `./mvnw clean install -DskipTests`
- Dev auth service: `cd services/auth && bun run dev`
- Run single maven test method:
  `./mvnw -pl services/appointment -Dtest=MyTestClass#myMethod test`

If anything in this document becomes outdated, update `AGENTS.md` and include
links to the changed config files.

End of AGENTS.md
