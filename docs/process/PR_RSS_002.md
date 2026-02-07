# PR: 등록 블로그 수동 일괄 재수집 엔드포인트 추가

## 브랜치
- 기준 브랜치: `develop`
- 작업 브랜치: `feat/rss-refresh-trigger`

## 요약
등록된 활성 블로그를 한 번에 재수집할 수 있도록 `POST /blogs/refresh` 엔드포인트를 추가했습니다.

## 범위
- 재수집 서비스 함수 `refreshRegisteredBlogs` 추가
- `POST /blogs/refresh` 라우트 및 입력 검증(`limit`) 추가
- 작업 스펙/워크로그 문서화

## 비범위
- cron/queue 기반 자동 주기 수집
- 재시도(backoff) 정책 및 병렬화 최적화

## 기술 상세
- `refreshRegisteredBlogs`는 활성 블로그(`isActive=true`)를 조회해 순차 처리합니다.
- 각 블로그는 기존 `registerAndIngestBlog`를 재사용해 수집/중복 방지/로그 기록 흐름을 공통화했습니다.
- 개별 블로그 실패 시 전체 중단 없이 다음 블로그로 진행하고 실패 목록을 응답에 포함합니다.
- 요청 body는 `{ "limit"?: 1..100 }` 형식이며, 미입력 시 전체 활성 블로그 대상입니다.

## 검증
- `./node_modules/.bin/tsc --noEmit -p apps/api/tsconfig.json`
- `POST /blogs/refresh {}` 응답:
  - `processedCount: 1`
  - `successCount: 1`
  - `failureCount: 0`
  - `createdPostCount: 0`
- `RssFetchLog` 최신 로그에 SUCCESS 기록 추가 확인

## 리스크 / 후속 작업
- 블로그 수 증가 시 순차 처리로 응답 지연 가능성이 있어 후속으로 비동기 배치/큐화 필요
- 운영 환경에서는 호출 권한 통제(관리자 전용 API) 보강 필요
