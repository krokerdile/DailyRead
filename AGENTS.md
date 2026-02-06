# AGENTS.md

## Purpose
Maintain DailyRead delivery context so any contributor can verify:
- what spec we started from
- what order work happened in
- what is safe to deploy

## Required Process
1. Before implementation, create `docs/tasks/TASK-<ID>.md` from `docs/templates/TASK_SPEC_TEMPLATE.md`.
2. During implementation, append meaningful updates to `docs/process/WORKLOG.md`.
3. Before deployment, complete `docs/process/RELEASE_READINESS.md` and append `docs/process/RELEASE_NOTES.md`.

## Source of Truth
- Product scope: `docs/prd/MVP_PRD.md`
- Work history: `docs/process/WORKLOG.md`
- Deployment decision: `docs/process/RELEASE_READINESS.md`
- Deploy summary: `docs/process/RELEASE_NOTES.md`

## Skill Trigger
Use `dailyread-execution-log` skill for requests about:
- task planning/spec setup
- progress documentation
- release readiness and deployment history

Use `git-pr-delivery-flow` skill for requests about:
- branch strategy
- split commits
- technical PR description and submission workflow
