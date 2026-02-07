# Task Spec

## Metadata
- Task ID: RSS-002
- Date: 2026-02-07
- Owner: Codex + hyunu
- Related PRD Section: 6.A Blog registration and collection

## Problem
- 등록된 블로그를 다시 수집하려면 현재는 URL을 수동으로 재등록해야 하며, 일괄 재수집 실행 경로가 없다.

## Scope
### In Scope
- 등록된 활성 블로그 대상 수동 일괄 재수집 API 추가
- 재수집 결과(성공/실패/신규 포스트 수) 요약 응답 제공
- 기존 RSS 수집 성공/실패 로그 적재 구조 재사용

### Out of Scope
- cron/queue 기반 자동 주기 수집
- 재시도(backoff) 정책 및 병렬 처리 최적화

## Requirements
- Functional:
  - `POST /blogs/refresh` 호출 시 활성 블로그를 순회하며 재수집해야 한다.
  - 각 블로그 수집 실패가 있어도 나머지 블로그 처리는 계속되어야 한다.
  - 응답에는 처리 건수/성공 건수/실패 건수/신규 포스트 수가 포함되어야 한다.
- Non-functional:
  - MVP 안정성을 위해 순차 처리로 단순하게 구현한다.
  - 실패 원인은 기존 `RssFetchLog`로 추적 가능해야 한다.

## Implementation Plan
1. 재수집 서비스 함수(`refreshRegisteredBlogs`) 추가
2. `POST /blogs/refresh` 라우트 추가
3. 타입체크 및 수동 호출 검증
4. Worklog 업데이트

## Validation Plan
- Automated:
  - `./node_modules/.bin/tsc --noEmit -p apps/api/tsconfig.json`
- Manual:
  - `POST /blogs/refresh` 호출 후 응답 집계값 확인
  - `RssFetchLog`에 성공/실패 로그가 누적되는지 확인

## Risks and Mitigations
- Risk: 블로그 수가 증가하면 순차 처리로 응답 지연 가능
- Mitigation: MVP는 단순성 우선, 후속 태스크에서 큐/배치/비동기 처리로 확장

## Done Definition
- [x] Code implemented
- [x] Tests/checks passed
- [x] Worklog updated
- [ ] Release notes updated (if deployable change)
