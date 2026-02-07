# PR: RSS 수집 로그 조회 API 추가

## 브랜치
- 기준 브랜치: `develop`
- 작업 브랜치: `feat/rss-fetch-log-query`

## 요약
운영 중 RSS 수집 상태를 빠르게 확인할 수 있도록 `GET /blogs/fetch-logs` 엔드포인트를 추가했습니다.

## 범위
- RSS 수집 로그 조회 API 추가
- 쿼리 필터(`status`, `limit`) 추가
- 작업 스펙/워크로그 문서화

## 비범위
- 관리자 인증/권한 제어
- 로그 편집/삭제

## 기술 상세
- `status`: `SUCCESS | FAILED` 선택 필터
- `limit`: 1~100, 기본 20
- 최신 순(`fetchedAt desc`)으로 조회
- 각 로그에 연결된 blog 정보(`id`, `name`, `rssUrl`) 포함

## 검증
- `./node_modules/.bin/tsc --noEmit -p apps/api/tsconfig.json`
- `GET /blogs/fetch-logs?limit=3` 응답 확인
- `GET /blogs/fetch-logs?status=FAILED&limit=3` 필터 응답 확인

## 리스크 / 후속 작업
- 현재 인증 없이 노출되므로 운영 환경에서는 관리자 인증 추가 필요
