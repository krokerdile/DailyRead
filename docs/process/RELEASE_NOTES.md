# RELEASE NOTES

Append newest releases at the top.

---

## 2026-02-07 - v0.1.0
- Scope:
  - Bootstrap DailyRead MVP development environment and baseline architecture.
- Included:
  - Next.js web app, Fastify API app, shared email package workspace scaffold.
  - Prisma + PostgreSQL data model and initial migration/seed.
  - Subscriber subscription endpoint persistence (`POST /subscriptions`).
  - Podman-based local PostgreSQL execution path.
  - Branch/commit/PR process skill (`git-pr-delivery-flow`).
- Fixed:
  - API environment loading issue by adding explicit dotenv loading from `apps/api/.env`.
- Known Issues:
  - `podman compose` provider is not installed in current machine; using `podman run` path.
  - Next.js 15.1.0 currently warns about known security advisory; version bump pending.
- Rollback:
  - Revert to previous commit and re-run migration reset in non-prod if schema rollback is required.
- Links:
  - Task spec: `docs/tasks/TASK-ENV-001.md`
  - Worklog entry: `docs/process/WORKLOG.md` (ENV-001)

## YYYY-MM-DD - v0.0.x
- Scope:
- Included:
  - 
- Fixed:
  - 
- Known Issues:
  - 
- Rollback:
  - 
- Links:
  - Task spec:
  - Worklog entry:
