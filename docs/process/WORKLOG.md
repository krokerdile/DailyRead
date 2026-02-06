# WORKLOG

Keep entries in reverse chronological order.

## Entry Format
- Date/Time (local)
- Task ID
- Goal
- Changes
- Decision/Tradeoff
- Validation
- Next Step

---

## 2026-02-07 03:51 KST - PR-002
- Goal: 2번째 PR 본문/코멘트 Markdown 깨짐(`\n` 노출) 이슈 수정 및 재발 방지.
- Changes:
  - `docs/process/PR_RELEASE_001.md` 추가 (develop -> main PR 본문 파일).
  - `skills/git-pr-delivery-flow/SKILL.md`에 Markdown body guard 추가.
  - PR 본문 전달 방식을 문자열 이스케이프가 아닌 `--body-file` 기준으로 정리.
- Decision/Tradeoff:
  - 빠른 복붙보다 파일 기반 본문 관리(추적성/재사용성)를 우선.
- Validation:
  - PR 본문 파일에서 줄바꿈/헤더/리스트가 일반 Markdown 형식으로 작성됨을 확인.
  - 스킬 문서에 `gh pr create/edit --body-file` 규칙이 반영됨을 확인.
- Next Step:
  - `gh pr edit <번호> --body-file docs/process/PR_RELEASE_001.md`로 실제 PR 본문 교체.

## 2026-02-07 03:15 KST - ENV-001
- Goal: Establish MVP-ready local development environment (web/api/db/email) and verify runtime.
- Changes:
  - Added monorepo scaffold: Next.js web, Fastify API, shared email package.
  - Added Prisma + PostgreSQL schema, migration, and seed for system group.
  - Connected `/subscriptions` API to upsert Subscriber in DB.
  - Added Podman-based local PostgreSQL run path and updated README.
  - Added `git-pr-delivery-flow` skill for branch/commit/PR execution standardization.
- Decision/Tradeoff:
  - Kept email provider abstraction via `EmailSender` + SMTP implementation first to preserve future SES/Gmail swappability.
  - Standardized local DB instructions to Podman for current developer environment.
- Validation:
  - Verified `podman` machine and postgres container startup.
  - Ran Prisma generate/migrate/seed successfully.
  - Confirmed API (`:4000`) and web (`:3000`) dev server startup logs.
- Next Step:
  - Implement RSS ingestion and persist `Blog`/`Post` pipeline with duplicate handling.

## 2026-02-07 02:36 KST - DOCS-001
- Goal: Add MVP PRD-based execution documentation process.
- Changes:
  - Added `docs/prd/MVP_PRD.md`
  - Added `docs/process/WORKLOG.md`
  - Added `docs/process/RELEASE_NOTES.md`
  - Added `docs/process/RELEASE_READINESS.md`
  - Added templates under `docs/templates/`
  - Added project rule file `AGENTS.md`
  - Added skill `skills/dailyread-execution-log/SKILL.md`
  - Updated `README.md` with documentation workflow section
- Decision/Tradeoff:
  - Chose lightweight markdown workflow over DB/tooling to keep MVP speed.
- Validation:
  - Files created and linked for team workflow usage.
- Next Step:
  - Use template for next feature ticket before coding.
