# Task Spec

## Metadata
- Task ID: RSS-003
- Date: 2026-02-07
- Owner: Codex + hyunu
- Related PRD Section: 6.A Blog registration and collection

## Problem
- 현재는 수동 API 호출 없이 등록된 블로그를 주기적으로 수집할 수 있는 실행 경로가 없다.

## Scope
### In Scope
- API 서버 내 환경변수 기반 RSS 주기 재수집 스케줄러 추가
- 실행 중복 방지(이전 실행이 끝나기 전 다음 주기 시작 방지)
- 스케줄 실행 결과 로그(성공/실패 집계) 출력

### Out of Scope
- 외부 큐/크론 인프라 연동
- 분산 환경 멀티 인스턴스 락

## Requirements
- Functional:
  - 환경변수로 스케줄러 활성화 시 지정된 주기(분)마다 재수집이 실행되어야 한다.
  - 개별 수집 실패가 있어도 주기 실행 자체는 유지되어야 한다.
  - 스케줄러 비활성화 시 기존 API 동작에 영향이 없어야 한다.
- Non-functional:
  - MVP 단계에서는 단일 프로세스 기준으로 단순하고 안전한 구현을 우선한다.
  - 실행 상태/결과를 서버 로그에서 추적 가능해야 한다.

## Implementation Plan
1. 환경변수 스키마에 RSS 스케줄 옵션 추가
2. RSS 스케줄러 모듈 추가 및 `refreshRegisteredBlogs` 연동
3. API bootstrap에 스케줄러 시작/정지 연결
4. 타입체크 및 수동 실행 검증

## Validation Plan
- Automated:
  - `./node_modules/.bin/tsc --noEmit -p apps/api/tsconfig.json`
- Manual:
  - 스케줄러 활성화 후 실행 로그 확인
  - 비활성화 시 스케줄러 미동작 확인

## Risks and Mitigations
- Risk: 단일 프로세스 내 타이머 방식은 인스턴스 증가 시 중복 실행 가능
- Mitigation: MVP에서는 단일 인스턴스 운영 전제로 사용, 후속으로 분산 락/잡큐 도입

## Done Definition
- [x] Code implemented
- [x] Tests/checks passed
- [x] Worklog updated
- [ ] Release notes updated (if deployable change)
