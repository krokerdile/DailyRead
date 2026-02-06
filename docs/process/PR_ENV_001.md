# PR: MVP 환경 부트스트랩 (Next.js + Fastify + Prisma/PostgreSQL + Podman)

## 브랜치
- Base: `develop`
- Compare: `feat/bootstrap-next-fastify-prisma-podman`

## 요약
DailyRead MVP 개발을 시작할 수 있도록 웹/API 워크스페이스 분리, 데이터베이스 기초 스키마, 로컬 실행 검증 환경을 초기화했습니다.

## 범위
- 웹, API, 공용 이메일 패키지 모노레포 스캐폴딩 추가
- 핵심 MVP 엔티티 Prisma 스키마 및 초기 마이그레이션/시드 추가
- 이메일 구독 요청을 `Subscriber`에 저장하도록 API 연결
- 로컬 DB 런타임을 Podman 기준으로 표준화
- 브랜치/커밋/PR 실행 재사용 스킬 추가

## 기술 상세
- 워크스페이스 구조
  - `apps/web`: Next.js App Router 기본 구성
  - `apps/api`: Fastify 서버 + 라우트 + 환경변수 검증
  - `packages/email`: `EmailSender` 추상화 + SMTP 구현
- 데이터베이스
  - Prisma 모델: `Subscriber`, `User`, `Blog`, `Post`, `Like`, `Comment`, `Recommendation`, `Group`, `EmailLog`
  - 시드에서 `system` 그룹 생성
  - 구독 라우트에서 upsert + `connectOrCreate`로 system group 안전 연결
- 런타임
  - API에서 `apps/api/.env`를 명시적으로 로드
  - Podman 기반 PostgreSQL 컨테이너(`postgres:16-alpine`) 사용

## 검증
- `podman` 머신 시작 및 postgres 컨테이너 `:5432` 구동 확인
- `npm run prisma:generate -w @dailyread/api`
- `npm run prisma:migrate -w @dailyread/api -- --name init`
- `npm run prisma:seed -w @dailyread/api`
- `npm run dev:api` 기동 로그 확인(`:4000`)
- `npm run dev:web` 기동 로그 확인(`:3000`)

## 리스크 / 후속 작업
- 현재 호스트에 `podman compose` 플러그인이 없어 `podman run` 경로 사용 중
- Next 보안 공지 대응을 위한 버전 업그레이드 필요
- 다음 단계로 RSS 수집 파이프라인 및 메일 스케줄러 구현 예정
