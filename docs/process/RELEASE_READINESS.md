# Release Readiness Checklist

Complete before any deployment.

## 1. Scope and Spec
- [x] Target task spec exists (`docs/templates/TASK_SPEC_TEMPLATE.md` based)
- [x] Implementation remains in MVP scope (`docs/prd/MVP_PRD.md`)
- [x] Out-of-scope items are deferred and documented

## 2. Quality Gates
- [x] Typecheck/build passes
- [ ] API and web smoke tests pass
- [ ] Critical flows manually verified (feed, reaction, email trigger path)
- [x] Monitoring/logging checks are in place for changed area

## 3. Data and Operations
- [x] DB migration reviewed and rollback plan noted
- [ ] Email sending changes validated in non-prod
- [ ] Admin moderation impact reviewed (if comment/post/blog behavior changed)

## 4. Documentation
- [x] `docs/process/WORKLOG.md` updated with final implementation status
- [x] `docs/process/RELEASE_NOTES.md` appended using release template
- [x] Known issues and follow-up tasks recorded

## Decision
- [ ] GO
- [x] NO-GO

Notes:
- Owner: hyunu + Codex
- Date: 2026-02-07
- Risks:
  - 전체 릴리즈 게이트 기준으로 web smoke, reaction/email trigger path 수동 검증이 이번 RSS 태스크 범위에서는 미실행.
  - RSS 자동 발견은 `/rss`, `/feed`, `/atom.xml`, `/index.xml` 후보 기반이라 일부 사이트에서 추가 보강 필요 가능성 존재.
