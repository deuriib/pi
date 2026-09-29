---
name: agree-the-goal
description: 'Turns a rough idea into one written goal plus two to four things that count as success, and waits for you to approve it. No code, no requirements. Use when something new is starting, or when a goal needs writing down. Triggered by "start something new", "what are we building", "set the goal", or "quarterly planning".'
---

# Agree the goal — from an idea to a written goal

> _"Haces las cosas como para Dios, por eso trabajas con excelencia, dedicación y minimalista."_

## 1. Purpose

Elicit strategic intent and freeze it into a goal file before any domain work
starts. No specs, no code, no budgets committed here.

## 2. Contract

- **IN** — strategic intent from the user; repo context. No 4-line note yet (chain entry).
- **OUT** — `docs/goals/GOAL-<slug>.md` (`Domains-touched`, `execution_mode: subagents`, `Classification`, `Approval`).
- **NEXT** — `frame-ship:write-the-requirements` via `SPEC:docs/goals/GOAL-<slug>.md / HARD:subagents+<constraints> / GATE:none-yet / DOMAINS:[<list>]` (no anchor — no REQ-ID exists yet)
- **STOP** — no explicit approval → no handoff. No GOAL file → no 4-line note (mint the file at approval).

```text
frame-ship:agree-the-goal → frame-ship:write-the-requirements → frame-ship:propose → frame-ship:check-security / frame-ship:check-design → frame-ship:build
  → frame-ship:review → frame-ship:verify → frame-ship:release
```

## 2b. Role Binding (Org)

- **Bound to:** Orchestrator — classifies strategic intent and owns the brief.
- Domain owners do NOT write briefs; they receive them via reference.

## 3. Process

0. Pre-flight LOAD — STOP (subagents only): `skill(agree-the-goal)` loaded? Domain ownership identified? `execution_mode` about to be frozen? Any NO → STOP, load first. FAIL → retry N=2 → escalate. Output cites skill.
1. Explore context first — files, docs, recent commits, and load any relevant sideways or external skills (even outside frame-ship scope) that can assist with discovery, planning, domain context, or task decomposition — before detailed questions. If the request describes multiple independent subsystems, flag this immediately and decompose into sub-initiatives (own GOAL→SPEC cycle each); brainstorm the first through the normal flow.
2. Classify first, announce the path, allow override — "this looks bounded, so I'll present a short brief here rather than write a full GOAL file":
   - `quick-question` — a feasibility question whose output is an answer, not a brief. Present probe in 2-3 sentences, get a nod, report a recommendation; anything built stays labeled throwaway.
   - `scoped-change` — a well-scoped intent with an existing flow to change. Ask the questions that matter, present a short GOAL in chat, and STOP for an explicit yes. If the work will reach a spec, mint `docs/goals/GOAL-<slug>.md` from that chat brief at approval — a 4-line note needs a path; answer-only work needs no file.
   - `big-new-direction` — new direction, new subsystem, restructure of how parts fit together. Follow the full flow below and write the GOAL file.
     Ratchet is one-directional: hidden complexity upgrades the path — stop, say so, step up. Nothing downgrades mid-initiative. When in doubt, take the heavier path.
3. Freeze execution as subagents only (no mode question): `orchestrator` hands the work out, leads and specialists do it or hand back a short report. Where the tool cannot hand work to another agent, do the same steps in the same thread, one after the other. Trivial <50-line reversible work is CEO small-task shortcut, outside methodology. Freeze as execution_mode in brief; all specs follow it unless overridden per SPEC with a documented exception from `orchestrator`.
4. Elicit one question at a time — multiple-choice preferred, open-ended fine. Focus on purpose, constraints, success criteria. One question per message; break deeper topics into follow-ups.
5. Propose 2–3 framings with trade-offs, lead with the recommendation and why. YAGNI ruthlessly — cut every non-essential scope from each framing before presenting.
6. Present the GOAL in sections scaled to complexity; ask after each section whether it looks right. Cover problem, outcome, scope, stakeholders, constraints.
7. Produce `docs/goals/GOAL-<slug>.md` using `references/goal-template.md` (with `Classification:`, `Framings-considered:`, `Approval:`) with `Domains-touched` declared from the 8-domain catalogue.
8. Write the `## Objectives` block into that same file, immediately after `## Desired Outcome`, using `references/goals-template.md` — 2–4 objectives, each a `### Objective`. One file per initiative; the objectives are not a second artefact.
9. Self-review the written GOAL with fresh eyes — placeholder scan (no TBD/TODO/vague lines), internal consistency, scope check (one SPEC cycle or decompose?), ambiguity check (one reading only) — fix inline, no re-review loop.
10. User reviews the GOAL file before handoff: "GOAL written at `<path>`. Please review and approve before we move to specs." Wait for explicit yes. GATE: the approval scales with the size of the work — a nod for a quick question, a yes for a scoped change, reading a file for a big new direction. The approval itself never scales away.
11. Identify required domain leads (engineering, security, finance, legal, marketing, people, revenue, automation — 8-domain catalogue in `../AGENTS.md`) and flag cross-cutting concerns (data angle where schema/PII involved). Each domain lead understands their domain's practices.
12. Hand off the brief reference to `frame-ship:write-the-requirements` as `SPEC:docs/goals/GOAL-<slug>.md / HARD:subagents+<constraints> / GATE:none-yet / DOMAINS:[<list>]`. Anchorless by grammar (`DESIGN.md#the-4-line-note`: `anchors = req-id *( "," req-id )`, and no REQ-ID exists yet).
13. Close with a commit. Example: `docs(brief-auth): add GOAL-auth with domains-touched`.

### C1 — Classification-scaled challenger (opt-in, REQ-001)

- Mechanics (glossary, opener/exit, one-at-a-time, warmth, masking, N+1, stall breaker): `../start-here/references/challenge-round.md` — never redefined here.
- Stage budget: spike 1-3 question / bounded cap 3-5 / architectural cap 5 (4 core + 3 frontier-empty). Opt-in at classification, never skips the GATE; unclassified → heaviest path (cap 5).
- Falsifiable-bet: challenger runs "what evidence would kill each framing?" over the 2–3 framings and records it in `Framings-Considered`. Record outcome `grill: accepted|declined|exited|stalled`.

### Red Flags (adapted — approval scales, never skipped)

| Thought                                                 | Reality                                                                         |
| ------------------------------------------------------- | ------------------------------------------------------------------------------- |
| "Too simple to need a brief"                            | Simple means a short brief in chat, not no brief. Two sentences, then approval. |
| "I'll call it bounded to skip the file"                 | Reaching for a label to skip work IS the doubt — take the heavier path.         |
| "The design is obvious — start while they read"         | The gate is the approval, not the length. Present, then stop until yes.         |
| "They approved the probe, so the follow-up is approved" | Each initiative gets its own classification and its own approval.               |
| "It grew, but almost done — no re-classify"             | Hidden complexity upgrades the path. Stop and say so.                           |

## 4. What I won't do

- Write implementation specs (→ `frame-ship:write-the-requirements`).
- Bypass `frame-ship:write-the-requirements` for the core chain handoff — sideways/external skills outside this scope are welcomed and should be loaded whenever they assist with planning, tasks, or domain context, but the final brief handoff always targets `write-the-requirements` via 4-line note passed by reference.
- Approve my own brief or skip the GATE for any classification.
- Allocate budgets without finance domain lead approval.
- Commit to timelines without engineering domain lead feasibility input.

## 5. References

- `references/goal-template.md` — goal file template (includes `execution_mode`).
- `references/goals-template.md` — the `## Objectives` block that goes under `## Desired Outcome`.
