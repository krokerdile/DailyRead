# PR: Bootstrap MVP Environment (Next.js + Fastify + Prisma/PostgreSQL + Podman)

## Branches
- Base: `develop`
- Compare: `feat/bootstrap-next-fastify-prisma-podman`

## Summary
Initialize DailyRead MVP development baseline with web/api workspace split, database schema foundation, and local runtime validation.

## Scope
- Add monorepo scaffold for web, api, and shared email package.
- Add Prisma schema for core MVP entities and initialize migration/seed.
- Persist email subscription requests to `Subscriber`.
- Standardize local DB runtime on Podman.
- Add reusable branch/commit/PR execution skill.

## Technical Details
- Workspace layout:
  - `apps/web`: Next.js app router baseline
  - `apps/api`: Fastify server + routes + env validation
  - `packages/email`: `EmailSender` abstraction + SMTP implementation
- Database:
  - Prisma models: `Subscriber`, `User`, `Blog`, `Post`, `Like`, `Comment`, `Recommendation`, `Group`, `EmailLog`
  - Seed creates `system` group
  - Subscription route uses upsert and `connectOrCreate` for system group safety
- Runtime:
  - `.env` is explicitly loaded from `apps/api/.env`
  - Podman containerized PostgreSQL (`postgres:16-alpine`)

## Validation
- `podman` machine started and postgres container running on `:5432`
- `npm run prisma:generate -w @dailyread/api`
- `npm run prisma:migrate -w @dailyread/api -- --name init`
- `npm run prisma:seed -w @dailyread/api`
- `npm run dev:api` startup log verified (`:4000`)
- `npm run dev:web` startup log verified (`:3000`)

## Risks / Follow-up
- `podman compose` plugin is unavailable on current host; currently using direct `podman run` commands.
- Upgrade `next` to a patched version for security advisory handling.
- Add RSS collection job and email scheduler as next milestones.
