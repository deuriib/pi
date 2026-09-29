---
name: verify
description: "Checks the work against the done checklist and writes HANDOFF.md — what was delivered and the proof. Use when someone says the work is finished and it needs a second look before it ships. Triggered by \"is it done\", \"verify this\", \"hand this off\", or \"ready to ship\"."
---

# Verify — the done checklist, then the hand-off

> _"Haces las cosas como para Dios, por eso trabajas con excelencia, dedicación y minimalista."_

## 1. Purpose

Run the whole done checklist against the spec, the tests, and the open review report. Then:
produce HANDOFF.md routing to the next agent. No gate OPEN, no handoff.

## 2. Contract

- **IN** — spec + `TESTS.md` + `docs/specs/work/reviews/<spec-id>/REVIEW.md` (`OPEN` or waived) + intact 4-line note.
- **OUT** — `docs/specs/work/<domain>/HANDOFF.md` (deliverables + the done checklist + evidence links).
- **NEXT** — `frame-ship:release` on pass; findings needing code → `frame-ship:propose` (Hard Rule 1), else → `frame-ship:build`.
- **STOP** — gate not `OPEN` → no handoff. Evidence link dead/missing → FAIL, no handoff.

## 2b. Role Binding (Org)

- **Bound to:** owning domain lead gate (engineering / security / domain lead) with
  orchestrator synthesizing cross-domain handoffs.

## 3. Process

0. Pre-flight LOAD — STOP: `skill(verify)` loaded? Owning domain lead template read? `SPEC/HARD/GATE/DOMAINS` 4-line note + `REVIEW.md` in hand? Any NO → STOP. Execution is subagents only: orchestrator hands work to the lane, ordered to read this skill. No OPEN gate = no handoff (documented exception only domain leads + orchestrator).
1. Read spec + test/evidence matrix + `REVIEW.md` with `SPEC/HARD/GATE/DOMAINS` 4-line note intact.
2. Run the done checklist via `references/done-checklist.md` — Common section for all, Domain appendix only for touched domains.
3. Produce `docs/specs/work/<domain>/HANDOFF.md` via `references/handoff-template.md` (deliverables may be files, documents, filings, campaigns, closes, workflows — with evidence links). Singleton: create-if-missing else update-in-place, never suffix — one UPPER_SNAKE canonical per lane (only `HANDOFF.md`, never `HANDOFF-*.md`).
4. All gates pass → hand off to `frame-ship:release` with 4-line note `SPEC:<spec-path>#<REQ-IDs> / HARD:subagents+<constraints> / GATE:<OPEN|WAIVED:<path>> / DOMAINS:[<list>]`.
5. Findings split by kind: needs code change → `frame-ship:propose` (Hard Rule 1 — no code without an approved proposal); evidence/doc-only → `frame-ship:build` with specific findings.
6. Close with a commit. Example: `docs(handoff-003): verify the done checklist and route SPEC-003 to release`.

## 3a. C4 — REQ→evidence-link presence check (surgical, security-owned)

- Mechanics + human contract: `../start-here/references/challenge-round.md` §1–§2. Trigger/budget (C4 row): every REQ must link evidence (test/scan/log/review-link) — link present AND resolves AND relevant; missing/dead/irrelevant = FAIL with recorded reviewer-judgment reason; attestation-alone = FAIL. No handoff on FAIL.
- Every C4 FAIL lists `risk left over + owner`. Re-litigating settled gate verdicts banned — findings return to `frame-ship:build`. 4-line notes preserved; Retry N=2 → escalate orchestrator.
- Evidence safety: PII checkpoint per `challenge-round.md` §3 (zero PII/secrets/tokens in handoff text/exports; allowlisted evidence only; Ley 172-13 (Dominican privacy law)). Proof-or-refuted + no-freelance-fix apply. Tone (people owner verifies at gate): warm and direct — one item at a time, `exit/salir`/pause anytime, no penalty, masking rides every export. Exit = pause + `grill: exited` + escalate; proposal stays unapproved on pre-decision exit, no silent promote.

## 4. What I won't do

- Approving without running the whole done checklist.
- Skip security verification for security-relevant specs.
- Allow shipping without doc updates.

## 5. References

- `references/handoff-template.md` — Deliverables + the done checklist + next agent.
- `references/done-checklist.md` — Functional/quality/security/docs gates.
