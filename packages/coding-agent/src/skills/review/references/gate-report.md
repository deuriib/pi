# Quality Gate Report: SPEC-XXX

**Date:** YYYY-MM-DD
**Gate Status:** OPEN | CONDITIONAL | CLOSED
**Domains Touched:** [subset of 9: engineering, security, finance, legal, marketing/brand, people, revenue, automation/ops, product + data angle if applicable]

## Reviewer Verdicts

| Domain          | Reviewer (actual agent) | Verdict     | Findings | File                                                                                        |
| --------------- | ----------------------- | ----------- | -------- | ------------------------------------------------------------------------------------------- |
| engineering     | check-clarity           | pass        | 0        | `review/<spec-id>/readability.md`                                                           |
| engineering     | check-correctness       | conditional | 2        | `review/<spec-id>/reliability.md`                                                           |
| engineering     | skeptic                 | pass        | 0        | `review/<spec-id>/refuter.md`                                                               |
| engineering     | check-failure-handling  | pass        | 0        | `review/<spec-id>/resilience.md`                                                            |
| engineering     | check-what-could-break  | pass        | 0        | `review/<spec-id>/risk.md`                                                                  |
| engineering     | run-the-tests           | pass        | 0        | `review/<spec-id>/run-the-tests.md`                                                         |
| engineering     | check-data              | pass        | 0        | `review/<spec-id>/data.md`                                                                  |
| security        | check-security-review   | pass        | 0        | `review/<spec-id>/check-security-review.md`                                                 |
| finance         | check-money             | pass        | 0        | `review/<spec-id>/check-money.md`                                                           |
| legal           | check-legal             | pass        | 0        | `review/<spec-id>/check-legal.md`                                                           |
| marketing/brand | check-brand             | pass        | 0        | `review/<spec-id>/check-brand.md`                                                           |
| people          | check-people            | pass        | 0        | `review/<spec-id>/check-people.md`                                                          |
| revenue         | check-revenue           | pass        | 0        | `review/<spec-id>/check-revenue.md`                                                         |
| automation/ops  | check-automation        | pass        | 0        | `review/<spec-id>/check-automation.md` (+ ops-angle rows folded into it when infra-touched) |

All paths are `docs/specs/work/reviews/<spec-id>/<routing-key>.md`; `<routing-key>` is the Reviewer column above. Delete non-touched domain rows before sign-off; multi-domain specs keep ALL touched rows.

## Conditions for Opening

- [ ] COND-001: [condition from conditional reviewer]

## C3 — CONDITIONAL/documented exception review record (surgical, security-owned)

> Every CONDITIONAL/documented exception justification is challenged against the normative
> three-block bar in `references/exception-template.md` (`Accepted-risk` +
> `Compensating-controls + owner` + `Expiry/Re-review date-or-condition +
owner`). Missing block = FAIL, no promotion.

| Documented exception (every CONDITIONAL — one row per documented exception; rows = CONDITIONALs; sample-of-one never satisfies) | Accepted-risk | Compensating-controls + owner | Expiry + re-review owner | Verdict     |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------- | ----------------------------- | ------------------------ | ----------- |
| [documented exception link]                                                                                                     | pass / fail   | pass / fail                   | pass / fail              | PASS / FAIL |

**Residual-risk:** [risk + owner, or explicit `none + owner` — silent APPROVE+conditions = FAIL]

Substance backstop (COND-K1/SEC1/Q4-shared): presence ≠ substance — a vacuous box-tick (`Accepted-risk: low because low`, owner `someone`, `Expiry: later`) FAILs via a recorded reviewer-judgment reason, never passes silently. Demo: `docs/specs/work/security/SAMPLE-grilling-C3-thin-FAIL.md` (3-documented exception fixture: thin FAIL, missing-block FAIL, full PASS — every documented exception gets a row).

Full re-review banned — C3 reviews every documented exception against this bar only
(every CONDITIONAL gets a row; rows = CONDITIONALs — sample-of-one never satisfies),
never re-runs the routing table. CLOSED stays CLOSED without recorded
`area-leads + orchestrator` sign-off. Retry N=2 → escalate orchestrator.
Expiry default: 90 days or next release, whichever first
(orchestrator-confirmed; re-review owner mandatory).

### PII checkpoint (REQ-SEC-003/004 + REQ-P-006 co-sign)

Zero PII/secrets/tokens/credentials/sessions in documented exception text, grill
questions/answers/prompts/logs/examples/exports. Every prompt/adapter/event/log/
export is a declared PII checkpoint (mask/tokenize + allowlist); allowlisted
evidence only; Ley 172-13 (Dominican privacy law) minimization (purpose + TTL + deletion declared).
Wide/cross-tenant disclosure = finding. No-freelance-fix: findings report
`severity + location + evidence`, owner remediates — never rotate keys/patch
prod/widen perms. Proof-or-refuted: finding without `diff/scan/log` = REFUTED;
Critical/High with proof surfaces same session.

### Tone (REQ-P-003/006 co-sign, people owner verifies at gate)

Warm and direct — one documented exception at a time; say `exit/salir` / pause anytime, no penalty.
Exit-terminal (COND-P5-shared): `exit/salir` mid-C3 = pause + recorded `grill: exited` + escalate; uncleared documented exceptions stay CONDITIONAL, no silent promote.
Masking reminder rides every export.

## Load Evidence (STOP — missing = CLOSED)

- [ ] Stage skill loaded: `skill(<stage>)` cited (name + trigger match)
- [ ] Domain owner/specialist role understood: domain role cited (handed the work role only)
- [ ] Execution mode declared: `subagents` (max 2, read orders in prompt)
- [ ] Reviewer independence verified: strictly 1 dedicated subagent per reviewer; zero bundled reviews across multiple domains or wave criteria
- [ ] The 4-line note is well-formed: `SPEC:<path>#REQ / HARD:<mode+constraints> / GATE:<verdicts> / DOMAINS:[<list>]` — no full-context paste
- Any unchecked above → gate CLOSED, return to stage with findings (retry N=2 → escalate orchestrator).

## Escalations

[Conflicting verdicts escalated to domain leads + orchestrator here]

## Sign-off

- [ ] All reviewers pass or conditions met
- [ ] Gate Keeper: owning domain lead
- [ ] Final authority (if waived): domain leads + orchestrator
