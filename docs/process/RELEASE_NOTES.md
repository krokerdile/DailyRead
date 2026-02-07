# RELEASE NOTES

Append newest releases at the top.

---

## 2026-02-07 - v0.1.1
- Scope:
  - RSS 기반 블로그 등록/수집 파이프라인 MVP 기능 추가.
- Included:
  - `POST /blogs/register` 엔드포인트 추가 (URL 등록 즉시 피드 수집).
  - RSS/Atom 파싱 및 블로그 URL 입력 시 피드 자동 발견 구현.
  - 자동 발견 fallback(`/rss`, `/feed`, `/atom.xml`, `/index.xml`) probe 추가.
  - `RssFetchLog` 모델 및 `RssFetchStatus` enum 도입으로 수집 성공/실패 로그 영속화.
  - 포스트 중복 방지(`Post.url` + `createMany(skipDuplicates)`) 및 블로그 중복 방지(`Blog.rssUrl`) 처리.
- Fixed:
  - 일반 블로그 URL에서 `<link rel="alternate">` 미탐지 시 RSS 발견 실패하던 문제를 fallback probe로 보완.
- Known Issues:
  - 일부 블로그는 관용 경로 외의 커스텀 피드 경로를 사용해 자동 발견 보강이 추가로 필요할 수 있음.
  - 정규식 기반 파싱 구조라 XML 변형(네임스페이스/비표준 태그)에서 일부 필드 누락 가능성 존재.
- Rollback:
  - API 변경 롤백 시 `POST /blogs/register` 라우트/ingest 모듈 제거 후 이전 이미지로 배포.
  - DB 롤백은 non-prod에서 `RssFetchLog`/`RssFetchStatus` 제거 마이그레이션을 별도 적용 후 진행.
- Links:
  - Task spec: `docs/tasks/TASK-RSS-001.md`
  - Worklog entry: `docs/process/WORKLOG.md` (RSS-001, 2026-02-07 11:07/11:43/11:59 KST)

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
