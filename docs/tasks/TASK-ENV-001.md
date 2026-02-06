# Task Spec

## Metadata
- Task ID: ENV-001
- Date: 2026-02-07
- Owner: Codex + hyunu
- Related PRD Section: 2, 4, 6 (가입 방식, 핵심 기능 MVP, 데이터 모델)

## Problem
- DailyRead MVP 개발을 시작할 수 있는 실행 환경(웹/API/DB/메일 추상화)이 없어서 기능 구현을 바로 진행할 수 없다.

## Scope
### In Scope
- Next.js + Fastify 모노레포 스캐폴딩
- Prisma + PostgreSQL 모델/마이그레이션 초기화
- Nodemailer 기반 이메일 추상화 구조
- Podman 기반 로컬 DB 실행 경로 확정

### Out of Scope
- RSS 수집기 구현
- OAuth 로그인 구현
- 메일 스케줄러 구현

## Requirements
- Functional:
  - 웹/서버 개발 서버가 기동되어야 한다.
  - 구독 API가 DB에 Subscriber를 저장해야 한다.
  - system group이 기본으로 보장되어야 한다.
- Non-functional:
  - provider 교체 가능한 이메일 구조여야 한다.
  - 실행 가이드는 현재 로컬 환경(Podman) 기준으로 문서화되어야 한다.

## Implementation Plan
1. Next.js, Fastify, packages/email 워크스페이스 구조 생성
2. Prisma 스키마와 seed, subscription API DB 저장 로직 연결
3. Podman 기반 실행/검증 및 README 반영

## Validation Plan
- Automated:
  - `npm run prisma:generate -w @dailyread/api`
  - `npm run prisma:migrate -w @dailyread/api -- --name init`
  - `npm run prisma:seed -w @dailyread/api`
- Manual:
  - `npm run dev:api` 기동 로그 확인
  - `npm run dev:web` 기동 로그 확인
  - Podman postgres 컨테이너 상태 확인

## Risks and Mitigations
- Risk: 로컬 환경별(podman/docker) 실행 명령 차이로 온보딩 혼선 발생
- Mitigation: README를 Podman 기준으로 고정하고 Docker는 추후 별도 선택지로 분리

## Done Definition
- [x] Code implemented
- [x] Tests/checks passed
- [x] Worklog updated
- [x] Release notes updated (if deployable change)
