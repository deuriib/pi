---
name: fix-a-bug
description: 'Finds why something is broken and proves it with a test that fails first, before anyone fixes it. Use when something is broken, a test fails, or the result is not what was expected. Triggered by "this is broken", "a test is failing", "why does this not work", or "fix this bug".'
---

# Debugging — Systematic Root Cause Before Fixes

> _"Haces las cosas como para Dios, por eso trabajas con excelencia, dedicación y minimalista."_

## 1. Purpose

Enforce root-cause-first fix-a-bug so no fix is proposed or implemented from symptoms. Produce evidence + single hypothesis, then hand off through the chain.

## 2. Contract

- **IN** — bug report / failed test / `build` failure + intact `SPEC/HARD/GATE/DOMAINS` 4-line note.
- **OUT** — failing reproduction test (code) + one root-cause hypothesis, recorded in `PROPOSAL.md §Rationale`. No fix edited here.
- **NEXT** — `frame-ship:propose` (fix proposal), then review / execute / gate as required.
- **STOP** — no Phase-1 evidence → no fix talk. Fix #4 → STOP, question architecture with human/orchestrator.

## 2b. Role Binding (Org)

- **Bound to:** engineering owner + executing specialist diagnosing the defect; automation owner for boundary-evidence/runbook angle; security owner for example/log hygiene.
- Never self-approves the resulting fix; never edits impl files from this skill.

## 3. Process

0. Pre-flight LOAD — STOP: `skill(fix-a-bug)` loaded? `SPEC/HARD/GATE/DOMAINS` 4-line note ready? Any NO → STOP. Iron Law applies from here.
1. Phase 1 — Root cause (MUST complete before any fix talk): read errors fully; reproduce consistently with exact steps; check recent diffs/commits/config; at each component boundary log masked entry/exit + config presence (placeholders only, no secrets); trace bad value backward to source. No hypothesis yet.
2. Phase 2 — Pattern: find working example in same codebase; read reference completely; list every difference; map dependencies/config/assumptions.
3. Phase 3 — Hypothesis: state one theory ("X is root cause because Y"); test with smallest single-variable change; verify or form NEW hypothesis (never stack fixes). Say "I don't understand X" when stuck; research or escalate.
4. Phase 4 — Implementation handoff: create the failing reproduction test first (commits as test-only, no fix); state the single hypothesis in one line. Never edit implementation code here.
5. Hand off to `frame-ship:propose` with 4-line note `SPEC:<spec-path>#<REQ-IDs> / HARD:subagents+<constraints> / GATE:reviewing / DOMAINS:[<list>]`, the reproduction commit, and the hypothesis — `propose` records both in `PROPOSAL.md §Rationale` (the hypothesis has no file of its own). Count fixes: <3 → return to Phase 1 with new info; ≥3 → STOP, question architecture with human/orchestrator before any Fix #4.
6. Red flags — STOP and return to Phase 1 on: "quick fix now", "try X and see", bundled changes, skipped test, "probably X", partial-pattern adaptation, solutions before data-flow trace, "one more fix" after 2 failures, each fix surfacing new-area symptoms.
7. 4-line notes: carry `SPEC/HARD/GATE/DOMAINS` by reference; trace `REQ-ID → reproduction → PROPOSAL → gate verdict`. Evidence allowlisted + masked per guardrails 1-8.

## 4. What I won't do

- Propose or apply fixes without Phase-1 evidence (Iron Law).
- Bundle refactors with the fix or stack hypotheses.
- Attempt Fix #4 without architecture review + human sign-off.
- Paste secrets/PII into logs, examples, or evidence.

## 5. References

- `references/root-cause-tracing.md` — Backward trace technique.
- `references/defense-in-depth.md` — Layered validation after root cause.
- `references/condition-based-waiting.md` — Condition polling over arbitrary sleeps.
