# Automation Review: SPEC-XXX

**Reviewer:** check-automation (automation owner) + engineering owner (ops mechanics)
**Date:** YYYY-MM-DD
**Verdict:** pass | conditional | fail

## Checklist

- [ ] Workflow/port/adapter/event boundary mapped (PII checkpoint per guardrails)
- [ ] Least-privilege scopes verified (keys, roles, automation identities)
- [ ] Idempotency + retry budget defined (retry N=2, then escalate — no third loop)
- [ ] Deployment plan + rollback tested (see `ops-review.md` angle when infra-touched)
- [ ] Monitoring/alerting + runbook updated
- [ ] Capacity/scaling + feature flags reviewed (if needed)
- [ ] No freelance fixes (no prod key rotation / permission widening by reviewer)

## Findings

| ID | Severity | Finding | Mitigation |
|----|----------|---------|------------|
| AUT-001 | Med | [issue] | [action] |

## Verdict Rationale

[Why this verdict]

## Ops Angle

- See `ops-review.md` for deployment/rollback/monitoring detail when spec touches infra. Automation verdict covers workflow logic; ops angle covers run mechanics.
