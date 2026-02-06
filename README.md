# DailyRead MVP Scaffold

## Stack

- Web: Next.js (App Router)
- API: Fastify
- DB: Prisma + PostgreSQL
- Email: Nodemailer abstraction (`EmailSender`)

## Prerequisites

- Node.js 22+
- npm 10+
- Podman

## Quick start

1. Install Node.js (recommended with `nvm`):
   - `nvm install 22 && nvm use 22`
2. Install dependencies:
   - `npm install`
3. Start Podman machine (first time):
   - `podman machine init --now`
4. Start local PostgreSQL:
   - `podman volume create dailyread_postgres_data`
   - `podman run -d --name dailyread-postgres -e POSTGRES_USER=dailyread -e POSTGRES_PASSWORD=dailyread -e POSTGRES_DB=dailyread -p 5432:5432 -v dailyread_postgres_data:/var/lib/postgresql/data docker.io/library/postgres:16-alpine`
5. Prepare API env:
   - `cp apps/api/.env.example apps/api/.env`
6. Run Prisma setup:
   - `npm run prisma:generate -w @dailyread/api`
   - `npm run prisma:migrate -w @dailyread/api -- --name init`
   - `npm run prisma:seed -w @dailyread/api`
7. Build shared email package once:
   - `npm run build -w @dailyread/email`
8. Run web:
   - `npm run dev:web`
9. Run api:
   - `npm run dev:api`

## Note for Homebrew node@22

If `node` is not found in your shell, add:

- `export PATH="/opt/homebrew/opt/node@22/bin:$PATH"`

## Database model (MVP)

- `Subscriber` (email-only subscription)
- `User` (GitHub OAuth user)
- `Blog`, `Post`
- `Like`, `Comment`
- `Recommendation`
- `Group` (system-only group for MVP)
- `EmailLog`

## Structure

- `apps/web`: Next.js app
- `apps/api`: Fastify API + Prisma schema/seed
- `packages/email`: provider-agnostic email interface and SMTP sender

## Delivery Docs Workflow

- PRD baseline: `docs/prd/MVP_PRD.md`
- Start each task with: `docs/templates/TASK_SPEC_TEMPLATE.md`
- Record implementation history in: `docs/process/WORKLOG.md`
- Run pre-deploy checklist: `docs/process/RELEASE_READINESS.md`
- Append deploy history in: `docs/process/RELEASE_NOTES.md`
- Project skill for this flow: `skills/dailyread-execution-log/SKILL.md`
- Branch/PR flow skill: `skills/git-pr-delivery-flow/SKILL.md`
