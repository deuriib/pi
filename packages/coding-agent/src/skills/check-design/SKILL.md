---
name: check-design
description: 'Checks a proposal against the design, and writes a decision note when it changes a contract, a data model, or something many parts share. Use when a change is about to alter a public API, a data model, or anything many parts depend on. Triggered by "check the design", "does this change the API", "we are changing the data model", or "what would this break".'
---

# Check the design — contracts, structure, decisions

> _"Haces las cosas como para Dios, por eso trabajas con excelencia, dedicación y minimalista."_

## 1. Purpose

Validate proposals against `docs/specs/design/DESIGN.md` and record
significant decisions as ADRs in `docs/specs/decisions/`. No invariant break without an explicit ADR.

## 2. Contract

- **IN** — `docs/specs/work/<domain>/PROPOSAL.md` + `docs/specs/design/DESIGN.md` + 4-line note (`GATE:reviewing`).
- **OUT** — `docs/specs/work/reviews/<spec-id>/architecture-review.md`; `docs/specs/decisions/DECISION-<NNN>-<slug>.md` only when an invariant/component/cross-domain contract changes.
- **NEXT** — `frame-ship:build` on `APPROVED`; `REJECTED` → back to `frame-ship:propose`.
- **STOP** — invariant break without a decision note → no approval.

## 2b. Role Binding (Org)

- **Bound to:** engineering owner with architect for design input and automation/ops owner
  for independent review. Disputes arbitrated by engineering owner; cross-domain needs
  briefed to orchestrator.

## 3. Process

0. Pre-flight LOAD — STOP: `skill(check-design)` loaded? Agent templates read for engineering owner + architect? Any NO → STOP. Execution is subagents only: orchestrator hands work to the lane (owner may hand work to inside its own domain), ordered to read this skill.
1. Read `docs/specs/work/<domain>/PROPOSAL.md` (singleton canonical — only `PROPOSAL.md`, never `PROPOSAL-*.md`).
2. Compare against `docs/specs/design/DESIGN.md` (canonical singleton — update-in-place, never `DESIGN-*.md`; interfaces/API shapes live in its Components/Data Flow table — no separate `API_CONTRACTS.md`).
3. DECISION only if the change breaks/creates an invariant, adds a component, or changes a cross-domain contract: produce `docs/specs/decisions/DECISION-<NNN>-<slug>.md` via `references/adr-template.md`. Within existing contracts → NO ADR, record the verdict only (step 4). One number = one file, never reuse a number. `Status: proposed` with code already merged = gate FAIL.
4. Issue review via `references/architecture-review.md` to the canonical path `docs/specs/work/reviews/<spec-id>/architecture-review.md` (create-if-missing else update-in-place, never suffix). Gate evidence lives with the gate: it is purged with `review/<spec-id>/` on archive — `release` never promotes it.
5. Hand off to `frame-ship:build` on `APPROVED`, or back to `frame-ship:propose` on `REJECTED`, with 4-line note `SPEC:<spec-path>#<REQ-IDs> / HARD:subagents+<constraints> / GATE:<APPROVED|CONDITIONAL|REJECTED> / DOMAINS:[<list>]`.
6. Close with a commit. Example: `docs(adr-009): record architectural decision in decisions`.

## 4. What I won't do

- Approve invariant violations without an explicit ADR.
- Override security domain lead on security conditions.
- Modify the architecture contract without an ADR.

## 5. References

- `references/adr-template.md` — Architecture Decision Record (only when step 3's condition holds).
- `references/architecture-review.md` — Contract compliance + verdict.
- `references/architecture-template.md` — Canonical architecture contract format (owner: this skill; `write-the-requirements` produces `DESIGN.md` from it).
