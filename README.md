# Innvoy

Hotel management system. Currently implements the **Hotel Guest CRUD** (RF0101–RF0104): register, update, deactivate (soft delete), and query guests with user-defined filters.

## Architecture

Monorepo with two apps orchestrated via Docker Compose:

- `innvoy-backend/` — NestJS 11 REST API (TypeScript), port `3000`
- `innvoy-frontend/` — React 19 + Vite SPA (TypeScript), port `5173` in dev, served by nginx in prod
- `docker-compose.yml` — wires backend, frontend, and a Postgres 16 database together
- `docs/requirements.md` — full system requirements (only the Guest group is currently implemented)

In production, nginx proxies `/api` requests to the backend and serves the React SPA for all other routes.

## Getting started

1. Create a `.env` file at the repo root with the following variables:

   | Var | Used by |
   |-----|---------|
   | `DB_USER` | Postgres + NestJS |
   | `DB_PASSWORD` | Postgres + NestJS |
   | `DB_NAME` | Postgres + NestJS |
   | `DB_HOST` | NestJS (value: `db` in Docker) |
   | `DB_PORT` | NestJS (value: `5432`) |

2. Start the stack:

   ```bash
   docker compose up --build
   ```

   - Backend: http://localhost:3000
   - Frontend: http://localhost:5173

3. Stop the stack:

   ```bash
   docker compose down       # stop all services
   docker compose down -v    # stop and delete the DB volume
   ```

## Development

### Backend (`innvoy-backend/`)

```bash
npm run start:dev    # watch mode
npm run build        # compile to dist/
npm test             # unit tests (Jest)
npm run test:watch   # watch mode
npm run test:e2e     # e2e tests
npm run test:cov     # coverage (80% threshold)
npm run test:mutation # mutation testing (Stryker, run after completing a feature)
npm run lint         # ESLint + Prettier fix
```

### Frontend (`innvoy-frontend/`)

```bash
npm run dev     # Vite dev server
npm run build   # type-check + Vite build
npm run lint    # ESLint
```

## Quality gates

- **Test coverage**: 80% minimum (branches, functions, lines, statements), enforced by Jest on the backend.
- **Mutation score**: above 60% (target 80%+), enforced by Stryker on the backend.
- **Cyclomatic complexity**: max 5 per function, enforced by ESLint on both projects.

Formatting is unified via a single `.prettierrc` at the repo root (single quotes, trailing commas, 100-char print width, LF line endings).

## Contributing

This project follows TDD — write the failing test first, then the implementation. See [`CLAUDE.md`](CLAUDE.md) for detailed conventions and current scope.
