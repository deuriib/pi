---
name: build
description: 'Writes the code, and only the files the proposal approved, with a test for every requirement it covers. Use when the proposal has been approved and the code needs writing. Triggered by "build it", "start implementing", "the proposal is approved", or "go ahead".'
---

# Build — writing the code

> _"Haces las cosas como para Dios, por eso trabajas con excelencia, dedicación y minimalista."_

## 1. Purpose

Implement strictly within the approved proposal boundaries with REQ-ID →
test → file traceability. Scope expansion requires a new proposal.

## 2. Contract

- **IN** — `docs/specs/backlog/SPEC-<slug>.md` + approved `docs/specs/work/<domain>/PROPOSAL.md` + recorded approvals + 4-line note from orchestrator.
- **OUT** — `docs/specs/work/<domain>/PLAN.md`, `docs/specs/work/<domain>/TESTS.md`, code/deliverables within the approved list only.
- **NEXT** — `frame-ship:review` (4-line note intact, `GATE:reviewing`) | optional before review: `frame-ship:open-a-pull-request`
- **STOP** — scope beyond the approved change list → new proposal. No approval recorded → no code.

## 2b. Role Binding (Org)

- **Bound to:** owning domain lead + domain specialists for all 8 business domains — engineering specialists plus domain executors (finance/legal/marketing/people/revenue/automation).
- Orchestrator hands work to with 4-line note passed by references (`SPEC:<path>#REQ / HARD:subagents+<constraints> / GATE:<verdicts> / DOMAINS:[<list>]`). Domain owners/specialists do the work or brief back — cross-domain need → formal Cross-domain request brief to orchestrator, who delegates or resolves; specialists never hand work to yourself.
- Domain expertise: each domain lead/specialist understands their domain's practices and review criteria.

## 3. Process

0. Pre-flight LOAD — STOP: `skill(build)` loaded? Domain owner/specialist role understood? Approvals + `execution_mode` + `DOMAINS` confirmed? Any NO → STOP. Execution is subagents only — the natural process: orchestrator hands work to the entire team; domain leads/specialists do the work or brief back. Reference-only SPEC/HARD/GATE/DOMAINS 4-line notes, full-wave always. Trivial reversible work (<50 lines) lives outside methodology as CEO small-task shortcut (checkpoint-only), never as a chain branch.
1. Confirm all required approvals are recorded and read `execution_mode` (`subagents`, frozen at agree-the-goal; overridden per SPEC only with CEO documented exception) + `DOMAINS` from spec/proposal.
2. Create implementation plan at `docs/specs/work/<domain>/PLAN.md` via `references/implementation-plan.md` (steps may be file changes OR document/campaign/contract/policy/workflow actions with evidence locations). Singleton: the single `PLAN.md` per lane — create-if-missing else update-in-place, never `PLAN-*.md`.
3. Parallel lanes (max 2, `subagents`): create isolated worktrees first per `references/worktree-annex.md` (consent + clean-baseline + ignore-gate + green `mise run typecheck` before any code), run each SPEC lane inside `.worktrees/<spec-id>`, remove + prune after gate evidence is attributed.
4. Hand work to: orchestrator hands work to across lanes; a domain lead may hand work to its own domain's specialist/reviewer (INV-012) — each prompt orders the specialist to understand their domain role BEFORE acting; cross-domain need → formal Cross-domain request brief to orchestrator, who delegates or resolves; no sideways hand work to. Sequential degradation, same contract: harnesses without task run lanes sequentially in the same thread — same 4-line note, same reviewers, same full-wave gate. No min-gate, no silent downgrade.
5. Execute only targets in the approved change list (files AND non-code targets — no external sends/filings/launches beyond approval).
6. Execute the **approved** Test Plan (frozen at proposal approval) and record results at `docs/specs/work/<domain>/TESTS.md` via `references/test-matrix.md` (tests for code, reviews/sign-offs/attestations for non-code, REQ-ID trace mandatory for all). A missing test type or a floor gap → back to `frame-ship:propose` for a plan amendment, never decided here. Singleton: the single `TESTS.md` per lane — create-if-missing else update-in-place, never `TESTS-*.md`.
7. Run domain quality checks (engineering: lint, types, tests, security; other domains: peer review, owner sign-off, controls check per plan).
8. Commit one commit per approved task/REQ-ID (never batch unrelated REQ-IDs). Body links `REQ-ID → test → file`. Examples: `feat(auth-001): add session store with REQ-001 test trace`, `fix(auth-002): enforce TTL per REQ-002`.
9. Hand off to `frame-ship:review` with 4-line note `SPEC:<spec-path>#<REQ-IDs> / HARD:subagents+<constraints> / GATE:reviewing / DOMAINS:[<list>]`.

## 4. What I won't do

- Exceed spec scope without a new proposal.
- Skip tests/evidence for P0 requirements (tests for code, sign-off/attestation for non-code).
- Re-author the approved Test Plan here — a missing test type or a lower floor is a proposal amendment at `frame-ship:propose`.
- Modify targets outside the approved change list (files or non-code deliverables).

## 5. References

- `references/implementation-plan.md` — Steps + order + rollback points.
- `references/test-matrix.md` — REQ-ID to test traceability (records the approved Test Plan's results).
- `references/worktree-annex.md` — Isolated parallel lanes (max 2): create/verify/remove, security guards, pwsh flow, announce wording.
- `../propose/references/test-strategy.md` — Test strategy standard (owner: `propose`; the Test Plan is approved inside `PROPOSAL.md`, this stage only executes it).
