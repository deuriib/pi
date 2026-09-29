---
name: propose
description: "Writes PROPOSAL.md — what would change, which files, what could break, and how it gets tested — then stops and waits for your yes. Changes no code. Use when someone is ready to work and needs a yes first. Triggered by \"propose this\", \"can we change\", \"I want to add\", or \"how should we do this\"."
---

# Propose — the plan you approve before any code

> _"Haces las cosas como para Dios, por eso trabajas con excelencia, dedicación y minimalista."_

## 1. Purpose

Force design-before-code. The proposal — risk assessment plus the Test Plan — is reviewable; the repo is untouched.

## 2. Contract

- **IN** — `docs/specs/backlog/SPEC-<slug>.md` + 4-line note from orchestrator (or `frame-ship:fix-a-bug` triage).
- **OUT** — `docs/specs/work/<domain>/PROPOSAL.md` (with Test Plan) (+ risk assessment). Repo untouched.
- **NEXT** — `frame-ship:check-security` / `frame-ship:check-design` as required, then `frame-ship:build`; 4-line note re-emitted with `GATE:reviewing`.
- **STOP** — no approval → no code. Proposal without a Test Plan (every REQ-ID covered) → not approvable. Neither review applies → record `reviews: N/A` in the proposal before moving on.

## 2b. Role Binding (Org)

- **Bound to:** orchestrator hands work to; owning domain lead + domain specialists return proposals for all 8 business domains
  (see `../AGENTS.md` catalogue): engineering, security, finance, legal, marketing/brand, people, revenue, automation/ops.
  Orchestrator hands work to entire team; domain leads/specialists do the work or brief back.
- Specialists never hand work to anyone else, never approve their own proposal.

## 3. Process

0. Pre-flight LOAD — STOP: `skill(propose)` loaded? Agent template read for proposing specialist + owning domain lead? Any NO → STOP. Execution is subagents only: orchestrator hands work to the lane, domain leads/specialists do the work or brief back — the domain lead returns its proposal to the orchestrator.
1. Read the target spec (`docs/specs/backlog/SPEC-<slug>.md`) including `execution_mode` and `Domains-touched`.
2. Produce `docs/specs/work/<domain>/PROPOSAL.md` via `references/proposal-template.md` carrying `execution_mode` + `DOMAINS` forward. Singleton: create-if-missing else update-in-place, never suffix — one UPPER_SNAKE canonical per lane (only `PROPOSAL.md`, never `PROPOSAL-*.md`).
3. Include risk assessment via `references/risk-assessment.md` (what else could break covers systems + teams + customers + regulators + revenue).
4. Declare the Test Plan in `PROPOSAL.md` §Test Plan via `references/test-strategy.md`: every REQ-ID gets ≥1 Test ID (code) or ≥1 Evidence ID (non-code), canonical paths per §1, declared coverage floors per §2, negative + edge cases and environment/cleanup per §5. The plan is frozen at approval — `frame-ship:build` executes it, it never re-authors it. No plan → no approval.
5. Identify approvers by domain (owning domain lead mandatory; engineering owner for architecture impact; security owner for auth/data/API/PII) and block until approval. Reviews required? auth/data/API/PII → `check-security`; invariant/component/cross-domain contract → `check-design`; **neither applies → record `reviews: N/A` in the proposal** so the audit shows a decision, not a skip.
6. Hand off to `frame-ship:check-security` / `frame-ship:check-design` as required with 4-line note `SPEC:<spec-path>#<REQ-IDs> / HARD:subagents+<constraints> / GATE:reviewing / DOMAINS:[<list>]`.
7. Close with a commit (the proposal doc itself is committed, impl files stay untouched). Example: `docs(proposal-003): add PROPOSAL with what else could break + Test Plan`.

### C2 — Pre-approval challenge trigger + one-pass budget (REQ-002)

- Mechanics (glossary, opener/exit, one-at-a-time, warmth, masking, N+1, stall breaker): `../start-here/references/challenge-round.md` §1–§2 — never redefined here.
- Trigger (any): auth/data/API/PII surface; multi-domain scope; what else could break mentioning customers/regulators/revenue (synonym scan fires even when prose says "internal only"); approver request.
- Budget: exactly one pass of ≤3 questions (question 4 = FAIL); approver-requested re-grill ≤1 extra pass (≤2 total). Untouched rule: repo files AND external sends/filings/launches stay untouched during the round.
- Exit terminal (pre-decision): exit before approve/reject = pause + recorded `grill: exited` + escalate; proposal stays unapproved (no silent promote). Then terminal approve/reject.

## 4. What I won't do

- Modify implementation files during proposal phase (only `docs/specs/work/<domain>/PROPOSAL.md` + risk assessment are produced and committed).
- Skip risk assessment for auth, data, or external-API changes.
- Approve a proposal with no Test Plan or with REQ-IDs uncovered by a Test/Evidence ID.
- Approve my own proposal (specialists never self-approve).

## 5. References

- `references/proposal-template.md` — Proposed-changes template (includes the mandatory §Test Plan).
- `references/risk-assessment.md` — Risk matrix + what else could break + rollback.
- `references/test-strategy.md` — Owner: this skill. Test types, canonical paths, coverage floors, and the Test Plan standard (consumed by `build`, `review`, `verify`).
