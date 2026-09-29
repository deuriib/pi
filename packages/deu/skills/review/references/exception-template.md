# Quality Gate Documented exception: SPEC-XXX

**Issued By:** domain leads + orchestrator
**Date:** YYYY-MM-DD
**Gate Status at Documented exception:** CLOSED
**Expiry default:** 90 days or next release, whichever first (orchestrator-confirmed; re-review owner mandatory)

## Reviewer(s) Overridden

| Reviewer | Verdict | Reason for Override |
|----------|---------|---------------------|
| [name] | fail/conditional | [justification] |

## Normative three-block bar (C3 — missing block = FAIL, no promotion)

> All documented exceptions match this structure verbatim. Any CONDITIONAL/documented exception missing one
> of the three blocks fails review — missing block = FAIL, no promotion.

**Accepted-risk:** [risk + why]

**Compensating-controls:** [control + owner + evidence-ref]

**Expiry:** [date/condition + re-review owner]

**Sign-off:** [area-leads + orchestrator]

**Residual-risk:** [risk + owner, or explicit `none + owner` — silent PASS = FAIL]

CLOSED stays CLOSED without recorded `area-leads + orchestrator` sign-off.
Retry N=2 → escalate orchestrator. Full re-review banned — C3 interrogates every
documented exception against this bar only (every CONDITIONAL gets a row; rows = CONDITIONALs — sample-of-one never satisfies), never re-runs the routing table.

## Accepted Risk

[Must match `Accepted-risk:` line above — risk explicitly accepted + why + owner.]

## Compensating Controls

[Must match `Compensating-controls:` line above — mitigations + owner + evidence-ref.]

## Expiration

[Must match `Expiry:` line above — valid until date or condition + re-review owner.
Default: 90 days or next release, whichever first.]

## PII checkpoint (REQ-SEC-003/004 + REQ-P-006 co-sign)

Zero PII/secrets/tokens/credentials/sessions in documented exception text, grill
questions/answers/prompts/logs/examples/exports. Every prompt/adapter/event/log/
export is a declared PII checkpoint (mask/tokenize + allowlist); allowlisted
evidence only; Ley 172-13 (Dominican privacy law) minimization (purpose + TTL + deletion declared).
Wide/cross-tenant disclosure = finding. No-freelance-fix: findings report
`severity + location + evidence`, owner remediates — never rotate keys/patch
prod/widen perms. Proof-or-refuted: finding without `diff/scan/log` = REFUTED.

## Sign-off

- [ ] orchestrator
- [ ] Relevant domain lead(s)
- [ ] security owner (for security documented exceptions)
