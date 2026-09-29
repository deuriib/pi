---
name: check-security
description: "Looks at what a change could do to login, personal data, or a service outside us, and returns pass, pass-with-conditions, or fail. Use when a change touches auth, personal data, or an outside API, or when the security lead has to sign off. Triggered by \"is this safe\", \"security check\", \"we are adding a login\", or \"we are storing personal data\"."
---

# Check security — threats, personal data, secrets

> _"Haces las cosas como para Dios, por eso trabajas con excelencia, dedicación y minimalista."_

## 1. Purpose

Threat-model every security-relevant proposal and issue a binding verdict:
Approved / Conditional / Rejected. Reuses existing security reviewers —
no parallel reviewer universe.

## 2. Contract

- **IN** — `docs/specs/work/<domain>/PROPOSAL.md` + 4-line note (`GATE:reviewing`).
- **OUT** — `docs/specs/work/reviews/<spec-id>/security-review.md` (findings + threat checklist threat model + verdict).
- **NEXT** — `frame-ship:build` on `APPROVED`/`CONDITIONAL` (conditions met); `REJECTED` → back to `frame-ship:propose`.
- **STOP** — no complete threat model → no verdict. `REJECTED` → implementation blocked.

## 2b. Role Binding (Org)

- **Bound to:** security owner orchestrating security reviewers
  for PII flows. Escalation to orchestrator on Critical/High.

## 3. Process

0. Pre-flight LOAD — STOP: `skill(check-security)` loaded? Agent templates read for security owner + security reviewer? Any NO → STOP. Security owner executes inside the orchestrator-ordered lane and reads this skill first.
1. Read `docs/specs/work/<domain>/PROPOSAL.md` (singleton canonical — only `PROPOSAL.md`, never `PROPOSAL-*.md`).
2. Produce security review output via `references/security-review-template.md` at the canonical path `docs/specs/work/reviews/<spec-id>/security-review.md` (create-if-missing else update-in-place, never suffix).
3. Threat-model via `references/threat-model.md` (threat checklist), inside the same file.
4. Issue verdict + conditions (`APPROVED` / `CONDITIONAL` / `REJECTED`); block implementation on `REJECTED`.
5. Hand off to `frame-ship:build` on `APPROVED` / `CONDITIONAL` (conditions met), or back to `frame-ship:propose` on `REJECTED`, with 4-line note `SPEC:<spec-path>#<REQ-IDs> / HARD:subagents+<constraints> / GATE:<verdict> / DOMAINS:[<list>]`.
6. Close with a commit. Example: `docs(sec-003): record security-review with threat checklist verdict`.

## 4. What I won't do

- Approve without a complete threat model.
- Override engineering owner on architecture-impacting decisions.
- Let implementation proceed on a Rejected verdict.

## 5. References

- `references/security-review-template.md` — Findings + verdict + sign-off.
- `references/threat-model.md` — threat checklist attack surface analysis.
