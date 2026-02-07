# Task Spec

## Metadata
- Task ID: RSS-001
- Date: 2026-02-07
- Owner: Codex + hyunu
- Related PRD Section: 6.A Blog registration and collection

## Problem
- MVP 핵심 요구사항인 RSS 기반 블로그 등록/수집 파이프라인이 없어 실제 콘텐츠 적재가 불가능하다.

## Scope
### In Scope
- 블로그 URL 또는 RSS URL 입력 지원
- HTML에서 RSS/Atom 링크 자동 발견
- RSS/Atom 아이템 수집 및 `Post` 저장
- 중복 블로그(`rssUrl`) 및 중복 포스트(`url`) 방지
- 수집 성공/실패 로그 영속화

### Out of Scope
- 스케줄러(cron/queue) 기반 주기 수집
- 비RSS HTML 스크래핑
- 피드 품질 점수/개인화 추천

## Requirements
- Functional:
  - `POST /blogs/register`로 URL 등록 시 블로그/포스트가 DB에 반영되어야 한다.
  - RSS 자동 발견 실패 또는 파싱 실패 시 실패 로그가 저장되어야 한다.
  - 기존 블로그/포스트 중복 입력 시 중복 생성 없이 안전하게 처리되어야 한다.
- Non-functional:
  - 외부 파서 의존성 최소화(내장 기능 기반)로 초기 MVP 복잡도를 낮춘다.
  - 실패 원인(error message) 추적이 가능해야 한다.

## Implementation Plan
1. Prisma에 RSS 수집 로그 모델 추가 및 마이그레이션 반영
2. RSS URL 발견/피드 파싱 서비스 추가
3. 블로그 등록+즉시 수집 라우트 구현 및 서버 등록
4. 타입체크 및 문서(Worklog) 업데이트

## Validation Plan
- Automated:
  - `npm run prisma:generate -w @dailyread/api`
  - `npm run typecheck -w @dailyread/api`
- Manual:
  - RSS URL 입력 시 블로그/포스트 생성 확인
  - 일반 블로그 URL 입력 시 RSS 자동 발견 확인
  - 잘못된 URL 입력 시 실패 로그 생성 확인

## Risks and Mitigations
- Risk: 피드 XML 변형(네임스페이스/포맷 차이)으로 일부 항목 파싱 실패 가능
- Mitigation: RSS(item) + Atom(entry) 공통 최소 필드 위주 파싱, 실패 로그 기반 후속 보강

## Done Definition
- [x] Code implemented
- [x] Tests/checks passed
- [x] Worklog updated
- [x] Release notes updated (if deployable change)
