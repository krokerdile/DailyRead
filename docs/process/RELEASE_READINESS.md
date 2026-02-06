# Release Readiness Checklist

Complete before any deployment.

## 1. Scope and Spec
- [ ] Target task spec exists (`docs/templates/TASK_SPEC_TEMPLATE.md` based)
- [ ] Implementation remains in MVP scope (`docs/prd/MVP_PRD.md`)
- [ ] Out-of-scope items are deferred and documented

## 2. Quality Gates
- [ ] Typecheck/build passes
- [ ] API and web smoke tests pass
- [ ] Critical flows manually verified (feed, reaction, email trigger path)
- [ ] Monitoring/logging checks are in place for changed area

## 3. Data and Operations
- [ ] DB migration reviewed and rollback plan noted
- [ ] Email sending changes validated in non-prod
- [ ] Admin moderation impact reviewed (if comment/post/blog behavior changed)

## 4. Documentation
- [ ] `docs/process/WORKLOG.md` updated with final implementation status
- [ ] `docs/process/RELEASE_NOTES.md` appended using release template
- [ ] Known issues and follow-up tasks recorded

## Decision
- [ ] GO
- [ ] NO-GO

Notes:
- Owner:
- Date:
- Risks:

