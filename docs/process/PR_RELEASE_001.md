# PR: develop 변경사항 main 반영 (MVP 초기 환경)

## 브랜치
- 기준 브랜치: `main`
- 작업 브랜치: `develop`

## 요약
develop 브랜치에 반영된 초기 MVP 환경 구성을 main으로 동기화합니다.

## 포함 내용
- Next.js + Fastify + Prisma/PostgreSQL + Podman 기반 초기 시스템 구성
- 모노레포 기반 워크스페이스(웹/API/공용 이메일 스키마) 구성
- 기본 검증 및 문서화 산출물 정리

## 검증
- 기존 feature -> develop PR(#1) 머지 완료 확인
- 브랜치 상태 점검: develop이 main 대비 포함해야 할 변경만 존재하는지 확인

## 리스크 / 후속 작업
- Next.js 보안 공지 대응을 위한 버전 업그레이드 후속 진행
- RSS 수집 파이프라인 및 메일 스케줄러는 다음 feature PR에서 반영
