# PR: RSS 블로그 등록/수집 파이프라인 추가

## 브랜치
- 기준 브랜치: `develop`
- 작업 브랜치: `feat/rss-blog-ingestion`

## 요약
MVP 요구사항(6.A)에 맞춰 블로그 URL/RSS URL 등록 시 즉시 피드를 수집하고, `Blog`/`Post`를 중복 없이 저장하는 API 파이프라인을 추가했습니다.

## 범위
- `POST /blogs/register` 라우트 추가
- RSS/Atom 자동 발견 및 피드 파싱 서비스 구현
- 블로그/포스트 저장 및 수집 성공/실패 로그 영속화
- Prisma `RssFetchLog` 모델 + `RssFetchStatus` enum + 마이그레이션 추가
- 실행/검증 로그를 포함한 작업 문서 업데이트

## 비범위
- 주기 수집 스케줄러(cron/queue)
- 비RSS HTML 컨텐츠 스크래핑
- 피드 품질 점수/개인화 추천

## 기술 상세
- Feed discovery
  - 입력 URL이 XML 피드이면 직접 파싱
  - HTML일 경우 `<link rel="alternate">`에서 RSS/Atom 링크 탐지
  - 미탐지 시 `/rss`, `/feed`, `/atom.xml`, `/index.xml` fallback probe
- Ingestion
  - `Blog.rssUrl` 기준 upsert-like 처리(기존 블로그 update, 신규 create)
  - `Post.createMany({ skipDuplicates: true })`로 포스트 중복 방지
  - 성공/실패 모두 `RssFetchLog`에 기록

## 검증
- 타입/빌드
  - `./node_modules/.bin/tsc --noEmit -p apps/api/tsconfig.json`
  - `./node_modules/.bin/tsc -p apps/api/tsconfig.json`
  - `./node_modules/.bin/prisma generate --schema apps/api/prisma/schema.prisma`
- 수동 API 테스트
  - `POST /blogs/register {"url":"https://jacky0831.tistory.com/rss"}` -> 성공, 최초 `createdPostCount: 10`
  - 동일 RSS 재요청 -> 성공, `createdPostCount: 0`
  - `POST /blogs/register {"url":"https://jacky0831.tistory.com"}` -> 성공, `resolvedRssUrl` 자동 발견
  - `POST /blogs/register {"url":"https://example.com"}` -> 422 + 실패 로그 저장

## 리스크 / 후속 작업
- 자동 발견 fallback 후보 경로 외 사이트는 추가 패턴 보강이 필요할 수 있음
- 정규식 기반 파싱은 엣지 XML 변형 대응 한계가 있어 파서 고도화 후보
- 스케줄러 기반 주기 수집/재시도 정책은 후속 태스크로 분리
