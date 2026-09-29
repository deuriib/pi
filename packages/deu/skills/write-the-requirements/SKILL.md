---
name: write-the-requirements
description: 'Turns an agreed goal into requirements you can put a test against, plus the design that holds them. Use when the goal is approved and the work needs spelling out, or when something new needs a spec. Triggered by "the goal is approved", "write the requirements", or "what exactly are we building".'
---

# Write the requirements — from a goal to something testable

> _"Haces las cosas como para Dios, por eso trabajas con excelencia, dedicación y minimalista."_

## 1. Purpose

The orchestrator routes the brief to the owning domain leads by reference; they produce testable REQ-IDs plus the
canonical architecture contract. The brief is read-only here.

## 2. Contract

- **IN** — approved `docs/goals/GOAL-<slug>.md` by reference + 4-line note `SPEC:docs/goals/GOAL-<slug>.md / HARD:subagents+<constraints> / GATE:none-yet / DOMAINS:[<list>]` (anchorless at this stage — REQ-IDs do not exist until this stage mints them)
- **OUT** — `docs/specs/backlog/SPEC-<slug>.md` + `docs/specs/requirements/REQ-*.md` + `docs/specs/design/DESIGN.md` (update-in-place)
- **NEXT** — `frame-ship:propose` via `SPEC:<spec-path>#<REQ-IDs> / HARD:subagents+<constraints> / GATE:none-yet / DOMAINS:[<list>]`
- **STOP** — 4-line note missing or brief not approved → STOP. Security-relevant spec without security owner review → STOP.

## 2b. Role Binding (Org)

- **Bound to:** owning domain leads — engineering, security, finance, legal, marketing, people, revenue, automation, product (9-domain catalogue).
- Engineering owner consolidates `DESIGN.md` (interfaces/API shapes in its Components table; no separate `API_CONTRACTS.md` — format owned by `check-design/references/architecture-template.md`).

## 3. Process

0. Before anything, check: is `skill(write-the-requirements)` loaded? Do you know which
   domain lead owns this? Is the 4-line note ready —
   `SPEC:docs/goals/GOAL-<slug>.md / HARD:subagents+<constraints> / GATE:none-yet / DOMAINS:[<list>]`?
   No section anchor yet: requirement ids are minted in step 5, so this is the first
   4-line note that can carry one. Any answer NO means stop. Work goes to helper
   agents: `orchestrator` hands it to the team, domain leads and specialists do the
   work and hand back a short report. Notes are passed by reference, never pasted,
   and every reviewer runs. Trivial reversible work — under about 15 lines — is the
   CEO shortcut, outside these steps, and never a branch in the chain.
1. Read `docs/goals/GOAL-<slug>.md` (reference only, never paste full context) including `execution_mode` and `Domains-touched`. Require `Status: approved`, a `Domains-touched` value, a `Classification` value, and a `## Objectives` heading holding at least one `### Objective`; a record frozen by `CHANGELOG.md` is exempt from the `## Objectives` clause alone (`DESIGN.md` INV-015). Anything missing → escalate to `frame-ship:agree-the-goal`; never author the missing part here.
2. The orchestrator hands work to the owning domain leads by domains touched (9-domain catalogue in `../AGENTS.md`). Each hand the work to the domain lead understands their domain's practices and returns its spec to the orchestrator.
3. Handing the work to the domain lead produces a spec saved at
   `docs/specs/backlog/SPEC-<slug>.md`, using `references/spec-template.md`, carrying
   `execution_mode` and `DOMAINS` forward. Every spec names the domains it touches
   and the lead that owns it. `orchestrator` hands work to the whole team; each lead
   does the work or hands back a short report, and returns what it produced to the
   coordinator — at most 2 in parallel. If the tool cannot run work at the same time,
   the steps run in order in one thread with the same 4-line note, the same
   reviewers, and every reviewer running. The review never shrinks and nothing is
   quietly downgraded.
4. Engineering owner consolidates `docs/specs/design/DESIGN.md` (engineering contracts; non-engineering specs link domain contracts instead of forcing API shapes). Format per `../check-design/references/architecture-template.md` (template owner = check-design; producer = this stage). Singleton: create-if-missing else update-in-place, never suffix — one UPPER_SNAKE canonical per lane (only `DESIGN.md`, never `DESIGN-*.md`).
5. Index requirements in `docs/specs/requirements/` via `references/requirements-template.md` (functional + non-functional + domain controls).
6. Hand off to `frame-ship:propose` as `SPEC:docs/specs/backlog/SPEC-<slug>.md#<REQ-IDs> / HARD:subagents+<constraints> / GATE:none-yet / DOMAINS:[<list>]`.
7. Close with a commit. Example: `feat(spec-003): add spec to backlog with REQ-IDs and DESIGN contract`.

## 4. What I won't do

- Approve specs without security domain lead review for security-relevant domains.
- Modify the brief (escalate to `frame-ship:agree-the-goal`).
- Bypass the canonical architecture contract.

## 5. References

- `references/spec-template.md` — Spec with Context/REQ/AC/Contracts/Out-of-scope (includes `execution_mode` + 4-line note).
- `references/requirements-template.md` — Requirements index.
- `../check-design/references/architecture-template.md` — Architecture contract format (owned by `check-design`, cited here as producer).
