# PR: RSS 주기 재수집 스케줄러 추가

## 브랜치
- 기준 브랜치: `develop`
- 작업 브랜치: `feat/rss-refresh-scheduler`

## 요약
등록된 블로그 RSS를 주기적으로 재수집할 수 있도록 API 서버 내부 스케줄러를 추가했습니다.

## 범위
- 환경변수 기반 스케줄러 설정 추가
- RSS 재수집 스케줄러 모듈 추가
- 서버 부트스트랩에 스케줄러 시작/종료 연결
- 작업 스펙/워크로그 문서화

## 비범위
- 외부 큐/크론 연동
- 멀티 인스턴스 분산 락

## 기술 상세
- 새 환경변수:
  - `RSS_REFRESH_SCHEDULER_ENABLED`
  - `RSS_REFRESH_INTERVAL_MINUTES`
  - `RSS_REFRESH_BATCH_LIMIT`
  - `RSS_REFRESH_RUN_ON_START`
- 스케줄러 동작:
  - `setInterval` 기반 주기 실행
  - 이전 실행 중이면 중복 실행 skip
  - `refreshRegisteredBlogs` 재사용으로 수집/로그 로직 일원화
- 서버 종료 시 타이머 clear 처리

## 검증
- `./node_modules/.bin/tsc --noEmit -p apps/api/tsconfig.json`
- `RSS_REFRESH_SCHEDULER_ENABLED=true RSS_REFRESH_RUN_ON_START=true` 실행 시 startup 실행 로그 확인
- startup 실행 결과 `createdPostCount: 1` 확인
- DB 확인:
  - 제목 `"테스트 용"` 포스트 적재 확인
  - `url: https://jacky0831.tistory.com/138`

## 리스크 / 후속 작업
- 단일 인스턴스 전제 타이머라 다중 인스턴스에서 중복 실행 가능
- 후속으로 분산 락/잡큐 기반 실행 제어 필요
