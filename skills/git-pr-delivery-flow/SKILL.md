---
name: git-pr-delivery-flow
description: Standardize branch, commit, and pull request execution for DailyRead. Use when work must be split into logical commits, summarized for PR review, and prepared for push/PR creation from a feature branch.
---

# Git PR Delivery Flow

## Objective
Turn local changes into review-ready commits and a technically clear PR body.

## Output Language
- Write PR title/body, change summary, and review notes in Korean by default.
- Keep branch and commit type prefixes in conventional English format (`feat`, `fix`, `chore`, `docs`, etc.).
- Switch to English only when the user explicitly requests English.

## Inputs
- Current working tree changes
- Target base branch (default: `develop`, release target: `main`)
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

## Branch Strategy
- Use `main <- develop <- feature/*` as the default flow.
- Open feature PRs to `develop`.
- After feature integration, open `develop -> main` PR for release sync.
- Do not use `master`; use `main` as the primary branch name.

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

## Markdown Body Guard
- Never pass PR body as a single escaped string containing `\n`.
- Prefer `gh pr create --body-file <path>` or `gh pr edit --body-file <path>`.
- Keep PR text in a markdown file under `docs/process/` for auditability.

## Guardrails
- Never rewrite unrelated files.
- Do not commit secrets (`.env`, credentials, private tokens).
- If remote/push/PR command fails, record exact blocker and provide retry commands.
- If `gh` auth is invalid but `git push` works, continue with push-first workflow and create/edit PR with available auth path.
