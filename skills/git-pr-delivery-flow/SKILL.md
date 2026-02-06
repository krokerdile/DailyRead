---
name: git-pr-delivery-flow
description: Standardize branch, commit, and pull request execution for DailyRead. Use when work must be split into logical commits, summarized for PR review, and prepared for push/PR creation from a feature branch.
---

# Git PR Delivery Flow

## Objective
Turn local changes into review-ready commits and a technically clear PR body.

## Inputs
- Current working tree changes
- Target base branch (default: `develop`)
- Requested scope boundaries

## Workflow
1. Verify repository status and identify generated artifacts to exclude.
2. Create or switch to base branch, then create a feature branch using conventional format.
3. Group files by concern (scaffold, data layer, docs/process) and stage each group separately.
4. Commit each group with imperative conventional messages.
5. Prepare PR notes with:
- Summary
- Technical design decisions
- Validation evidence
- Known gaps and follow-up items
6. Push feature branch and open PR against base branch.

## Branch Naming Convention
- Use `<type>/<scope>` format.
- Allowed `type`: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`.
- Keep `scope` short, lowercase, hyphen-separated.
- Examples:
  - `feat/bootstrap-next-fastify-prisma-podman`
  - `chore/update-ci-cache`
  - `fix/subscription-upsert-error`

## Commit Grouping Rules
- Keep one concern per commit.
- Do not mix generated files with source changes unless required.
- Prefer sequence:
  1. project scaffold
  2. feature/data integration
  3. docs/process updates

## PR Body Checklist
- Base branch and compare branch explicitly noted
- Scope and non-scope
- Architecture or model changes
- Environment/runtime assumptions
- Validation commands and results
- Risks, rollback, and next steps

## Guardrails
- Never rewrite unrelated files.
- Do not commit secrets (`.env`, credentials, private tokens).
- If remote/push/PR command fails, record exact blocker and provide retry commands.
