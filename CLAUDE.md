# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current Scope — IMPORTANT

**Only implement the Hotel Guest CRUD (RF0101–RF0104).** Do not implement any other feature group (rooms, reservations, payments, promotions, reports, notifications, etc.) until explicitly instructed.

The full system requirements are in [`docs/requirements.md`](docs/requirements.md). Read it to understand the domain and data rules, but only act on the Guest group:

- RF0101 — Register guest
- RF0102 — Update guest registration
- RF0103 — Deactivate guest (soft delete — do not hard delete guests)
- RF0104 — Query guests with user-defined filters

Business rules that apply to guests (from `docs/requirements.md`):
- **RN0201** — Required fields: full name, CPF, date of birth, phone, email, and full address (street, number, ZIP code, neighborhood, complement, city, state)
- **RN0202** — CPF must be unique in the system
- **RN0211** — Email must be in a valid format

## Architecture

Monorepo with two apps orchestrated via Docker Compose:

- `innvoy-backend/` — NestJS 11 REST API (TypeScript), runs on port 3000
- `innvoy-frontend/` — React 19 + Vite SPA (TypeScript), runs on port 5173 in dev, served by nginx in prod
- `docker-compose.yml` — wires backend, frontend, and a Postgres 16 database together
- `.env` — single env file at the repo root, shared by all services via `env_file`

In production, nginx proxies `/api` requests to the backend (`http://backend:3000`) and serves the React SPA for all other routes.

## Commands

### Full stack (from repo root)
```bash
docker compose up --build      # start all services (dev mode with hot reload)
docker compose down            # stop all services
docker compose down -v         # stop and delete DB volume
```

### Backend (from `innvoy-backend/`)
```bash
npm run start:dev    # watch mode
npm run build        # compile to dist/
npm run lint         # ESLint + Prettier fix
npm test             # unit tests (Jest)
npm run test:watch   # watch mode
npm run test:e2e     # e2e tests
npx jest src/path/to/file.spec.ts   # run a single test file
```

### Frontend (from `innvoy-frontend/`)
```bash
npm run dev     # Vite dev server
npm run build   # type-check + Vite build
npm run lint    # ESLint
```

## Environment

All env vars live in `.env` at the repo root (gitignored). Required vars:

| Var | Used by |
|-----|---------|
| `DB_USER` | Postgres + NestJS |
| `DB_PASSWORD` | Postgres + NestJS |
| `DB_NAME` | Postgres + NestJS |
| `DB_HOST` | NestJS (value: `db` in Docker) |
| `DB_PORT` | NestJS (value: `5432`) |

## NestJS conventions

- Feature modules live in `src/<feature>/` with controller, service, module, and entity files co-located.
- `AppModule` in `src/app.module.ts` is the root — import new feature modules here and into the TypeORM entity list.
- TypeORM is configured in `AppModule` via `TypeOrmModule.forRoot()` reading DB vars from `process.env`.

## TDD and quality gates

This project follows TDD. Write the failing test first, then the implementation.

### Test coverage (Jest — backend only)

```bash
npm run test:cov
```

Thresholds enforced at **80%** across branches, functions, lines, and statements. The build fails below this. Excluded from coverage: `*.module.ts`, `main.ts`.

### Mutation testing (Stryker — backend only)

```bash
npm run test:mutation
```

Mutation score must stay **above 60%** (break threshold) — Stryker kills the run below that. Target is 80%+. Report is written to `reports/mutation/index.html`. Run this after completing a feature, not on every save.

### Cyclomatic complexity (ESLint — both projects)

Complexity limit per function is **5**. Functions with more than 5 branches will fail linting. Break complex logic into smaller, named functions rather than raising the limit.

## Code style and linting

Formatting is unified via a single `.prettierrc` at the repo root (single quotes, trailing commas, 100-char print width, LF line endings). Both projects share these rules but have separate ESLint configs.

**Backend (`innvoy-backend/eslint.config.mjs`)** — `recommendedTypeChecked` + NestJS-oriented rules:
- `no-explicit-any`, `no-unsafe-*`, `no-floating-promises` are all **errors** (not warnings)
- Always use `void bootstrap()` at entry points to satisfy `no-floating-promises`
- Async functions must explicitly return `Promise<void>` or a typed promise

**Frontend (`innvoy-frontend/eslint.config.js`)** — `recommendedTypeChecked` + React hooks + Prettier:
- Same `no-explicit-any` and `no-floating-promises` as error
- Unused variables are errors; prefix intentionally unused params with `_`

Run lint before committing:
```bash
# backend
cd innvoy-backend && npm run lint

# frontend
cd innvoy-frontend && npm run lint
```
