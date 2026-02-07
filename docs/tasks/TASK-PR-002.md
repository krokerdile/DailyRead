# Task Spec

## Metadata
- Task ID: PR-002
- Date: 2026-02-07
- Owner: Codex + hyunu
- Related PRD Section: 배포/운영 문서화 프로세스 (출시 커뮤니케이션 품질)

## Problem
- PR 본문/코멘트가 문자열 이스케이프(`\n`)로 게시되어 Markdown 줄바꿈이 깨지는 문제가 발생했다.

## Scope
### In Scope
- 2번째 PR(develop -> main) 본문 마크다운 파일 정리
- PR 작성 가드(`--body-file` 우선) 문서화
- 작업 이력(WORKLOG) 업데이트

### Out of Scope
- 기능 코드 변경
- 릴리즈 버전 변경

## Requirements
- Functional:
  - PR 본문이 GitHub에서 정상 Markdown으로 렌더링되어야 한다.
  - PR 본문 재사용이 가능하도록 파일 기반으로 관리되어야 한다.
- Non-functional:
  - 동일 문제 재발 방지를 위한 실행 규칙이 남아야 한다.

## Implementation Plan
1. `docs/process/PR_RELEASE_001.md` 본문 초안 추가
2. `skills/git-pr-delivery-flow/SKILL.md`에 Markdown body guard 추가
3. `docs/process/WORKLOG.md`에 처리 내역 기록

## Validation Plan
- Automated:
  - N/A (문서 변경)
- Manual:
  - PR 본문 파일이 실제 줄바꿈/헤더 형태로 작성되었는지 확인
  - 스킬 문서에 `--body-file` 사용 규칙 반영 확인

## Risks and Mitigations
- Risk: 사용자 로컬에서 다시 문자열 이스케이프 방식으로 게시할 수 있음
- Mitigation: 명령 예시를 `--body-file`로 고정하고 PR 본문 파일 경로를 명시

## Done Definition
- [x] Code implemented
- [x] Tests/checks passed
- [x] Worklog updated
- [ ] Release notes updated (if deployable change)
