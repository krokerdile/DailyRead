---
name: dailyread-execution-log
description: DailyRead MVP delivery documentation workflow. Use when tasks involve planning from PRD, tracking implementation progress, preserving work order/history, preparing release readiness, or writing deployment notes/checklists.
---

# DailyRead Execution Log Skill

## Objective
Keep delivery traceable from spec to deploy with minimal overhead.

## Required Artifacts
- `docs/prd/MVP_PRD.md`
- `docs/process/WORKLOG.md`
- `docs/process/RELEASE_READINESS.md`
- `docs/process/RELEASE_NOTES.md`
- `docs/templates/TASK_SPEC_TEMPLATE.md`

## Workflow
1. Start task from spec:
   - Create or update a task spec using `docs/templates/TASK_SPEC_TEMPLATE.md`.
   - Link to the relevant section in `docs/prd/MVP_PRD.md`.
2. Implement:
   - Update code.
   - Append progress/decision/validation notes to `docs/process/WORKLOG.md`.
3. Pre-release gate:
   - Complete `docs/process/RELEASE_READINESS.md`.
   - Explicitly mark GO or NO-GO with owner/date/risks.
4. Release history:
   - Append entry to `docs/process/RELEASE_NOTES.md` using template.
   - Include links to task spec and worklog entry.

## Rules
- Do not ship changes without updated worklog and release notes for deployable scope.
- Keep entries concrete: what changed, why, and how validated.
- Track out-of-scope discoveries as follow-up items, not silent scope creep.

