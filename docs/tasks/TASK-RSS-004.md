# Task Spec

## Metadata
- Task ID: RSS-004
- Date: 2026-02-07
- Owner: Codex + hyunu
- Related PRD Section: 6.A Blog registration and collection

## Problem
- RSS 수집이 정상 동작했는지 운영 중에 빠르게 확인할 조회 경로가 없다.

## Scope
### In Scope
- RSS 수집 로그 조회 API 추가
- 상태(SUCCESS/FAILED)와 개수(limit) 필터 지원

### Out of Scope
- 관리자 인증/권한 제어
- 로그 수정/삭제 기능

## Requirements
- Functional:
  - `GET /blogs/fetch-logs`에서 최신 로그를 반환해야 한다.
  - `status`, `limit` 쿼리로 필터링 가능해야 한다.
- Non-functional:
  - 기본 조회 건수는 20으로 제한해 과도한 응답을 방지한다.

## Implementation Plan
1. blogs 라우트에 로그 조회 endpoint 추가
2. 쿼리 파라미터 검증 추가
3. 타입체크 및 수동 호출 검증
4. Worklog 업데이트

## Validation Plan
- Automated:
  - `./node_modules/.bin/tsc --noEmit -p apps/api/tsconfig.json`
- Manual:
  - `GET /blogs/fetch-logs` 기본 조회 확인
  - `status=FAILED` 필터 조회 확인

## Risks and Mitigations
- Risk: 인증 없는 로그 조회로 내부 운영 정보 노출 가능
- Mitigation: MVP 단계에서는 내부 운영용으로 사용, 후속 태스크에서 관리자 인증 추가

## Done Definition
- [x] Code implemented
- [x] Tests/checks passed
- [x] Worklog updated
- [ ] Release notes updated (if deployable change)
