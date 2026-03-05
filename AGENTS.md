AGENTS — Agent Guidelines for this repo

Purpose This file tells automated agents how to build, lint, run tests
(including a single test), and follow the code-style conventions used across
this monorepo. Keep it up to date when config files change: `package.json`,
`eslint.config.js`, `.prettierrc.mjs`, `.editorconfig`, and `tsconfig*.json`.

Layout notes

- Monorepo workspaces: `apps/*`, `services/*`, `shared/typescript`, `database`.
- TS runtime: Bun (preferred). Java microservices use Quarkus + Maven (`mvnw`).
- Primary tooling: Prettier + ESLint; see `eslint.config.js` and
  `.prettierrc.mjs`.

Build / Install

- Install JS/TS deps (preferred): `bun install`
- Alternative: `npm install`
- Build Java services (skip tests for faster dev builds):
  `./mvnw clean install -DskipTests` (Windows:
  `. mvnw clean install -DskipTests`)

Run / Dev

- Start TypeScript dev servers from the repo root: `bun run --filter '*' dev`
- Or inside a package: `cd services/auth && bun run dev`
- Start a Java microservice: `./mvnw quarkus:dev` (Windows:
  `. mvnw quarkus:dev`)
- Start infra (DB, Redis) for integration tests:
  `docker compose -f docker-compose.dev.yml up`

Lint / Format / Hooks

- Format: `bun run format` (runs `prettier --write .`)
- Lint: `bun run lint` (`eslint` with `--fix`)
- Husky + lint-staged run `eslint --fix` and `prettier --write` on staged files.
- Run both locally before committing.

Tests — running a single test Java / Maven

- Run a single test class:
  `./mvnw -pl services/appointment -Dtest=MyTestClass test`
- Run a single test method:
  `./mvnw -pl services/appointment -Dtest=MyTestClass#myMethod test`
- Notes: `-pl` selects a module from the root; run inside module dir if easier.

TypeScript (Vitest / Bun)

- If the package uses Vitest: `npx vitest path/to/file.test.ts` Filter by name:
  `npx vitest -t "test name"`
- Bun native runner: `bun test path/to/file.test.ts` or
  `bun test --filter "pattern"`
- Always inspect the package-level `package.json` for the exact `test` script.
- For integration tests that need DB/Redis, start infra first with Docker
  Compose.

Per-package scripts

- Check `package.json` in the package you will change and prefer package-local
  `test`, `dev`, or `build` scripts.

Coding style (for agents)

- Primary configs: `eslint.config.js`, `.prettierrc.mjs`, `.editorconfig`,
  `tsconfig.base.json`, package `tsconfig.json`.
- Run `bun run lint` and `bun run format` before creating commits.

Imports

- Group imports: external → workspace (`@healthcare/*`) → relative.
- Prefer named imports; avoid `import * as` unless necessary.
- Prefer workspace aliases instead of deep relative paths.
- Let Prettier + organize-imports plugins re-order imports automatically.

Formatting

- Prettier is authoritative. Key values in `.prettierrc.mjs`: printWidth 80,
  tabWidth 2, semi false, trailingComma es5.
- Use ASCII unless a file already contains non-ASCII and it is required.

TypeScript specifics

- Exported functions and public APIs should have explicit return types.
- Use `readonly` where mutation is not intended.
- Use `zod` for runtime validation at boundaries (HTTP handlers, env parsing).
- Keep `any` to a minimum; annotate and justify when used.
- Follow the repo's `tsconfig` strictness.

Naming

- Types, interfaces, classes: PascalCase.
- Functions, variables, parameters: camelCase.
- Constants: prefer camelCase for module constants; UPPER_SNAKE_CASE only for
  true environment/constants (e.g., `DB_URL`).
- Files: follow existing folder pattern (kebab-case common).

Error handling & logging

- Use `BaseError` from `shared/typescript/src/lib/error.ts` and extend it for
  domain errors.
- Preserve error causes when wrapping: `new MyError('msg', { cause })`.
- Do not swallow errors silently: if suppressed add a comment and log it.
- Use shared logger utilities and structured JSON logs; include trace ids.

Concurrency & async

- Prefer async/await; avoid mixing callback and Promise styles.
- Respect cancellation (AbortController / signal) where available.
- Avoid shared mutable state without synchronization.

Security

- Never commit secrets. Use `.env.example` and runtime secrets management.
- Validate external input (use `zod`) and avoid logging sensitive fields.
- Use parameterized queries/ORM helpers for DB interactions.

Tests & CI

- Unit tests: fast and isolated; integration tests run with containers.
- Java tests via `./mvnw test`; TypeScript via `vitest` or `bun test`.
- In CI, ensure infra is available for integration test jobs (Docker Compose).

Commits & PRs

- Small, focused commits. Run lint & format pre-commit.
- Describe the "why" in PR descriptions; split big changes across commits.
- Avoid touching unrelated files (especially formatting) in large PRs.

Cursor / Copilot rules

- Repo-scoped Cursor rules: none detected (`.cursor/rules/` or `.cursorrules`).
- Copilot instructions: none detected at `.github/copilot-instructions.md`.
- If organization-level rules exist, query host policies before proceeding.

If you are unsure which command to run

- Inspect the package-level `package.json` in the package you will change.
- For Java, prefer running commands in the module directory or use `-pl`.

Quick reference — useful commands (Use from repo root unless noted)

```bash
# Install JS deps
bun install
# Format & lint
bun run format
bun run lint
# Build Java services (skip tests)
./mvnw clean install -DskipTests
# Run a single maven test method
./mvnw -pl services/appointment -Dtest=MyTestClass#myMethod test
# Run a single TS test file (Vitest)
npx vitest path/to/example.test.ts
# Or use Bun runner
bun test path/to/example.test.ts
```

Keep this file updated when tooling/configs change. Reference
`eslint.config.js`, `.prettierrc.mjs`, `.editorconfig`, and package-level
`package.json` files for authoritative rules.

End of AGENTS.md
