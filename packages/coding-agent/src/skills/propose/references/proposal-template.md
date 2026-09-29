# Proposed Changes: {{AGENT_ROLE}}

**Spec Reference:** SPEC-XXX
**Agent:** [name]
**Date:** YYYY-MM-DD
**Execution_Mode:** subagents (inherited from spec)
**Domains-Touched:** [engineering | security | finance | legal | marketing/brand | people | revenue | automation/ops | product — delete as applicable, must match spec]

## Summary

[What this agent proposes to do, in 2-3 sentences]

## Changes

| Target                       | Change Type     | Description                                    |
| ---------------------------- | --------------- | ---------------------------------------------- |
| `api/v2/users.ts`            | file-modify     | Add pagination params                          |
| `contracts/MSA-v3.md`        | document-create | Redline liability cap per SPEC-XXX             |
| `campaigns/launch-q3.md`     | campaign-update | Reposition messaging per marketing owner brief |
| `policies/retention.md`      | policy-update   | Set PII TTL + deletion path                    |
| `workflows/billing-close.md` | workflow-update | Add finance owner sign-off step                |

Change types: `file-create | file-modify | file-delete | document-create | campaign-update | contract-update | policy-update | model-update | workflow-update | config-update`. Engineering proposals use `file-*`; non-engineering proposals use document/campaign/contract/policy/workflow rows — same table, no forced file path.

## Rationale

[Why these changes satisfy the spec]

## Alternatives Considered

| Alternative | Reason Rejected |
| ----------- | --------------- |
| [approach]  | [why not]       |

## Test Plan

> Required section, standard owned by `references/test-strategy.md`. A proposal without a Test Plan is not approvable. Tests are planned here and executed later at `frame-ship:build` (results recorded in `docs/specs/work/<domain>/TESTS.md`); the plan is frozen at approval.

### REQ-ID to Test Mapping

| REQ-ID    | Test ID | Scope / Path                             | Test Type   | Expected Behavior / Boundary Checked                                   |
| --------- | ------- | ---------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| REQ-001   | T-001   | `tests/unit/auth/token.test.ts`          | Unit        | Returns valid JWT when credentials match; throws 401 on invalid secret |
| REQ-001   | T-002   | `tests/security/auth-expiry.test.ts`     | Security    | Rejects expired token after TTL; denies refresh after revocation       |
| REQ-002   | T-003   | `tests/integration/db/user-repo.test.ts` | Integration | Persists user record and rolls back transaction on duplicate email     |
| REQ-L-001 | E-001   | `docs/specs/work/legal/evidence/`        | Attestation | Legal owner written sign-off on updated terms of service               |

### Declared Coverage Floors

| Metric             | Floor Declared | Scope / Justification                                       |
| ------------------ | -------------- | ----------------------------------------------------------- |
| Line               | [XX%]          | [touched modules; N/A + written justification for non-code] |
| Branch             | [XX%]          | [ ]                                                         |
| Function           | [XX%]          | [ ]                                                         |
| Unit suite runtime | [Xs]           | [ ]                                                         |

### Test Environment & Setup

- **Prerequisites:** [e.g. local Postgres container, mock HTTP server]
- **Environment Variables:** [e.g. `TEST_MODE=true` — never real credentials or PII]
- **Cleanup & Isolation:** [e.g. truncate test tables in `afterEach`, isolate mock timers, no `sleep()`]

## Approval Required From

- [ ] Owning domain lead: [engineering owner | security owner | finance owner | legal owner | marketing owner | people owner | revenue owner | automation owner | product owner — per Domains-Touched]
- [ ] engineering owner (if architecture/API/model/cross-cutting impact)
- [ ] security owner (if auth/data/external-API/PII impact)
- [ ] Test Plan present and covering every REQ-ID (per `references/test-strategy.md`)

> **Rule:** No repository file modifications during proposal phase. For non-code domains, no external sends/filings/launches during proposal phase either.

## C2 challenge hook (REQ-002 — additive, no new required section)

- Trigger checklist — challenge round fires on ANY: auth/data/API/PII surface;
  multi-domain scope; what else could break mentioning customers/regulators/revenue
  (synonyms fire: customers/users/clients/members/consumers; regulators/GDPR/
  Ley 172-13 (Dominican privacy law)/authorities; revenue/pipeline/quota/money; independent
  blast-radius + API-surface scan fires even when prose says "internal only");
  approver request.
- One-pass budget: exactly one budgeted round per trigger (pass = ≤3
  questions; question 4 (N+1) = FAIL, blocked), then terminal
  approve/reject; approver-requested re-challenge ≤1 extra pass (total ≤2),
  then Retry N=2 → escalate orchestrator; pause/exit offered
  after the round. Exit before decision = pause + recorded `grill: exited` +
  escalate, proposal stays unapproved (no silent promote).
- Masking reminder: grill prompt + every export carry the people SPEC §4
  masking clause ("Por tu privacidad: no compartas PII/secretos/tokens en esta
  ronda; enmascaramos todo export (Ley 172-13 (Dominican privacy law))."); allowlisted evidence only.
- Single source: glossary lives once in C1 (`skills/agree-the-goal/SKILL.md` §C1); opener/warmth/masking canonical wording lives in people SPEC §4 inserts 1–6 — this hook points there, never redefines.
