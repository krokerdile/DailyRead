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

## 2026-02-07 12:32 KST - RSS-004
- Goal: RSS 수집 결과를 운영 관점에서 바로 확인할 수 있는 로그 조회 API 추가.
- Changes:
  - `docs/tasks/TASK-RSS-004.md` 생성.
  - `GET /blogs/fetch-logs` 라우트 추가 (`apps/api/src/routes/blogs.ts`).
  - 쿼리 필터 추가: `status(SUCCESS|FAILED)`, `limit(기본 20, 최대 100)`.
  - 로그 응답에 연결된 blog 기본 정보(id/name/rssUrl) 포함.
- Decision/Tradeoff:
  - MVP 운영 편의성을 위해 인증 없이 조회 경로를 우선 제공.
  - 보안/권한 제어는 후속 태스크로 분리.
- Validation:
  - 성공: `./node_modules/.bin/tsc --noEmit -p apps/api/tsconfig.json`
  - 성공: `GET /blogs/fetch-logs?limit=3` 응답 확인
  - 성공: `GET /blogs/fetch-logs?status=FAILED&limit=3` 필터 응답 확인
- Next Step:
  - 관리자 인증 추가 후 운영자 전용으로 로그 조회 범위 제한.

## 2026-02-07 12:17 KST - RSS-003
- Goal: 등록 블로그 주기 재수집 스케줄러를 추가하고 최신 테스트 글 수집 여부 확인.
- Changes:
  - 환경변수 스키마 확장: `RSS_REFRESH_SCHEDULER_ENABLED`, `RSS_REFRESH_INTERVAL_MINUTES`, `RSS_REFRESH_BATCH_LIMIT`, `RSS_REFRESH_RUN_ON_START` (`apps/api/src/config/env.ts`).
  - RSS 스케줄러 모듈 추가 (`apps/api/src/rss/scheduler.ts`).
  - API bootstrap에 스케줄러 시작/정지 연결 (`apps/api/src/index.ts`).
  - `.env.example`에 스케줄러 관련 변수 추가.
- Decision/Tradeoff:
  - MVP 단계에서는 단일 인스턴스 전제 타이머 기반 스케줄러로 단순하게 구현.
  - 중복 실행 방지를 위해 이전 실행 중이면 다음 주기 실행을 skip 처리.
- Validation:
  - 성공: `./node_modules/.bin/tsc --noEmit -p apps/api/tsconfig.json`
  - 성공: `RSS_REFRESH_SCHEDULER_ENABLED=true RSS_REFRESH_RUN_ON_START=true` 실행 시 startup 트리거 로그 확인
  - 성공: startup 실행 결과 `createdPostCount: 1` 확인
  - 성공: DB 조회에서 제목 `"테스트 용"` 적재 확인  
    - `title: 테스트 용`  
    - `url: https://jacky0831.tistory.com/138`
- Next Step:
  - 멀티 인스턴스 환경 대비 분산 락/잡큐 기반 스케줄러로 확장 검토.

## 2026-02-07 12:07 KST - RSS-002
- Goal: 등록된 블로그를 한 번에 다시 수집할 수 있는 수동 일괄 재수집 엔드포인트 추가.
- Changes:
  - `docs/tasks/TASK-RSS-002.md` 생성.
  - RSS 수집 서비스에 `refreshRegisteredBlogs` 추가 (`apps/api/src/rss/ingest.ts`).
  - `POST /blogs/refresh` 라우트 추가 및 `limit` 입력 검증 추가 (`apps/api/src/routes/blogs.ts`).
- Decision/Tradeoff:
  - 처리 안정성을 위해 MVP 단계에서는 활성 블로그를 순차 처리.
  - 개별 블로그 실패가 전체 실행을 중단하지 않도록 실패 수집 후 계속 진행.
- Validation:
  - 성공: `./node_modules/.bin/tsc --noEmit -p apps/api/tsconfig.json`
  - 성공: `POST /blogs/refresh {}` -> `processedCount: 1, successCount: 1, failureCount: 0, createdPostCount: 0`
  - 성공: `RssFetchLog` 최신 로그에 SUCCESS 추가 확인
- Next Step:
  - 주기 수집(cron/queue)과 재시도 정책은 후속 태스크로 분리 구현.

## 2026-02-07 11:59 KST - RSS-001
- Goal: 실사용 RSS URL(`jacky0831.tistory.com`) 기준 등록/수집 실검증 및 자동 발견 실패 보완.
- Changes:
  - 외부 RSS 실요청 검증: `https://jacky0831.tistory.com/rss` 응답 200 / XML 확인.
  - `POST /blogs/register` 실호출 검증:
    - RSS URL 입력 성공 (`createdPostCount: 10`)
    - 동일 RSS 재등록 성공 + 중복 방지 확인 (`createdPostCount: 0`)
    - 실패 URL(`https://example.com`) 422 응답 확인
  - 자동 발견 보강: HTML `<link>` 탐지 실패 시 관용 피드 경로(`/rss`, `/feed`, `/atom.xml`, `/index.xml`) probe fallback 추가 (`apps/api/src/rss/feed.ts`).
  - API 서버 재기동 후 일반 블로그 URL(`https://jacky0831.tistory.com`) 입력 성공 및 `resolvedRssUrl=https://jacky0831.tistory.com/rss` 확인.
  - DB 로그 검증: `RssFetchLog`에 SUCCESS/FAILED 로그 및 itemCount/errorMessage 기록 확인.
- Decision/Tradeoff:
  - 피드 자동 발견 정확도를 높이기 위해 추가 네트워크 요청(후보 경로 probe)을 허용.
  - MVP 단계에서는 제한된 후보 경로만 사용해 속도/복잡도 균형 유지.
- Validation:
  - 성공: `./node_modules/.bin/tsc --noEmit -p apps/api/tsconfig.json`
  - 성공: `POST /blogs/register {"url":"https://jacky0831.tistory.com/rss"}` -> `createdPostCount: 10` (초회)
  - 성공: 동일 요청 재실행 -> `createdPostCount: 0` (중복 방지)
  - 성공: `POST /blogs/register {"url":"https://jacky0831.tistory.com"}` -> `rssUrl: https://jacky0831.tistory.com/rss`
  - 성공: `POST /blogs/register {"url":"https://example.com"}` -> 422 + 실패 로그 적재
- Next Step:
  - RSS 수집 주기화(cron/queue) 및 재시도 정책 추가는 후속 태스크로 분리.

## 2026-02-07 11:43 KST - RSS-001
- Goal: 중단된 RSS-001 작업 재개 및 검증 상태 정리.
- Changes:
  - RSS 등록/수집 코드 상태 재확인 (`apps/api/src/rss/feed.ts`, `apps/api/src/rss/ingest.ts`, `apps/api/src/routes/blogs.ts`).
  - Prisma 스키마/마이그레이션 파일 일관성 확인 (`RssFetchLog`, `RssFetchStatus`).
  - API 타입체크 및 컴파일 검증 재실행 (`./node_modules/.bin/tsc --noEmit -p apps/api/tsconfig.json`, `./node_modules/.bin/tsc -p apps/api/tsconfig.json`).
  - Prisma Client 재생성 확인 (`./node_modules/.bin/prisma generate --schema apps/api/prisma/schema.prisma`).
- Decision/Tradeoff:
  - 현재 실행 환경에서 루프백 DB 연결이 불가해(`P1001`) 수동 API 시나리오 검증은 보류하고, 코드/타입/스키마 정합성 검증을 우선 확정.
- Validation:
  - 성공: `./node_modules/.bin/tsc --noEmit -p apps/api/tsconfig.json`
  - 성공: `./node_modules/.bin/tsc -p apps/api/tsconfig.json`
  - 성공: `./node_modules/.bin/prisma generate --schema apps/api/prisma/schema.prisma`
  - 실패(환경): `./node_modules/.bin/prisma migrate deploy --schema apps/api/prisma/schema.prisma` (`P1001: Can't reach database server at localhost:5432`)
- Next Step:
  - 로컬 런타임(비샌드박스)에서 DB 연결 가능한 터미널로 마이그레이션 적용 후 `POST /blogs/register` 수동 3케이스(RSS URL, 일반 블로그 URL 자동 발견, 실패 URL 로그) 검증.

## 2026-02-07 11:07 KST - RSS-001
- Goal: MVP RSS 등록/수집 최소 파이프라인 구현 (URL 등록, 자동 발견, 중복 방지, 실패 로그 영속화).
- Changes:
  - `docs/tasks/TASK-RSS-001.md` 생성 및 구현 범위/검증 계획 정의.
  - `POST /blogs/register` 라우트 추가 (`apps/api/src/routes/blogs.ts`).
  - RSS/Atom 자동 발견 및 파싱 로직 추가 (`apps/api/src/rss/feed.ts`).
  - 블로그 upsert + 포스트 dedup 저장 + 성공/실패 로그 기록 서비스 추가 (`apps/api/src/rss/ingest.ts`).
  - `RssFetchLog` 모델/`RssFetchStatus` enum 및 마이그레이션 추가.
  - API 서버 부트스트랩에 blogs 라우트 등록.
- Decision/Tradeoff:
  - 초기 MVP 속도를 위해 XML 파서는 외부 의존성 없이 최소 공통 포맷(RSS item / Atom entry) 기반 정규식 파싱으로 구현.
  - 정밀 파싱보다 "수집 성공률 + 실패 원인 로깅"을 우선해 후속 보강 가능한 구조로 분리.
- Validation:
  - `npm run prisma:generate -w @dailyread/api`
  - `npm run build -w @dailyread/email`
  - `npm run typecheck -w @dailyread/api`
- Next Step:
  - 로컬 DB에 신규 마이그레이션 적용 후 `POST /blogs/register` 수동 시나리오 검증(RSS URL, 일반 블로그 URL, 실패 케이스).

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
