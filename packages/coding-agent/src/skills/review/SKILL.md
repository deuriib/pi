---
name: review
description: "Hands the work to reviewers who cannot see each other's work, then merges what they say into REVIEW.md. A single failure closes the review. Use when the code is written. Triggered by \"review this\", \"is this good\", \"run the review\", or \"check my work\"."
---

# Review — every reviewer, every time

> _"Haces las cosas como para Dios, por eso trabajas con excelencia, dedicación y minimalista."_

## 1. Purpose

Route a completed spec to the correct reviewers per touched domain, collect
verdicts into one gate report, and enforce "no handoff until all reviewers
sign". Reuses existing reviewers — creates none except the data dupla.

## 2. Contract

- **IN** — spec `Domains-touched` + `PROPOSAL.md` + `TESTS.md` + 4-line note from `frame-ship:build`.
- **OUT** — `docs/specs/work/reviews/<spec-id>/<reviewer>.md` per reviewer + consolidated `docs/specs/work/reviews/<spec-id>/REVIEW.md`.
- **NEXT** — `frame-ship:verify` only on `GATE:OPEN` (4-line note intact) | on failure → `frame-ship:fix-a-bug` → `frame-ship:propose`
- **STOP** — any ❌ → `CLOSED`, no handoff without documented exception (domain leads + orchestrator). Malformed 4-line note → `CLOSED`.

```text
frame-ship:build → frame-ship:review → frame-ship:verify → frame-ship:release
```

## 2b. Role Binding (Org)

- **Bound to:** orchestrator hands work to all gate reviewers; owning domain lead acts as gate keeper (engineering owner for engineering, else
  the domain lead); orchestrator synthesizes multi-domain gates.
- Reviewers are domain specialists who understand their domain's review criteria and never approve their own work.
- **Reviewer Independence (1 subagent per Reviewer):** Reviewers are strictly independent from each other. No single agent does the work of all or multiple reviewers. The orchestrator hands work to exactly one dedicated subagent per reviewer role (`1 subagent per reviewer`). Bundling reviewer roles into a single subagent is strictly prohibited.

## 3. Reviewer Routing Table

| Domain                    | Owner             | Reviewers                                                                                                            |
| ------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| engineering               | engineering owner | check-clarity, check-correctness, skeptic, check-failure-handling, check-what-could-break, run-the-tests, check-data (data specs) |
| security                  | security owner    | check-security-review                                                                                                    |
| finance                   | finance owner     | check-money                                                                                                     |
| legal                     | legal owner       | check-legal                                                                                                       |
| brand/marketing           | marketing owner   | check-brand                                                                                                       |
| people                    | people owner      | check-people                                                                                                      |
| revenue                   | revenue owner     | check-revenue                                                                                                     |
| product                   | product lead      | check-product                                                                                                     |
| automation/ops            | automation owner  | check-automation (+ ops angle)                                                                                     |
| data (cross-cutting angle) | engineering owner | check-data (schema/lineage/PII angle)                                                                       |

A spec spanning multiple domains needs ALL touched-domain reviewers to sign. `Domains-touched` comes from the spec 4-line note; data angle attaches to any spec with schema/lineage/PII-store impact.

Execution mode (from spec `execution_mode`): `subagents` only — full wave per routing table below + adversarial `skeptic` before `run-the-tests` (full-wave único, no min-gate). Sequential degradation, same contract: harnesses without task run lanes sequentially in the same thread — same 4-line note, same reviewers, same full-wave gate. No min-gate, no silent downgrade.

Each reviewer understands their domain's review criteria. The orchestrator hands work to reviewers who understand their domain's practices.

## 4. Process

0. Pre-flight LOAD — STOP: `skill(review)` loaded? Owning domain lead identified? Each reviewer handed the work by orchestrator? Any NO → STOP.
1. Identify touched domains from spec `Domains-touched`/tags/requirements (must be subset of 9-domain catalogue in `../AGENTS.md`).
2. Hand work to each required reviewer via orchestrator as a separate, independent subagent (strictly 1 subagent per reviewer; reference-only `SPEC/HARD/GATE/DOMAINS` 4-line note + explicit orders to understand domain role first). No single agent may perform the work of multiple reviewers or combine reviewer audits.
3. Each reviewer create-if-missing else update-in-place `docs/specs/work/reviews/<spec-id>/<reviewer>.md`, where `<reviewer>.md` is the routing-table role key (`readability`, `reliability`, `refuter`, `resilience`, `risk`, `run-the-tests`, `data`, `check-security-review`, `check-money`, `check-legal`, `check-brand`, `check-people`, `check-revenue`, `check-automation`).
4. Consolidate into `docs/specs/work/reviews/<spec-id>/REVIEW.md` via `references/gate-report.md` create-if-missing else update-in-place.
5. Verdict mapping: reviewer `APPROVE` → ✅, `CONDITIONAL` → ⚠️, `CLOSED` → ❌ (vocabulary: `DESIGN.md#verdict-mapping`). Any ❌ → gate `CLOSED`. Any ⚠️ → `CONDITIONAL` (conditions must clear).
6. All ✅ → gate `OPEN` → hand off to `frame-ship:verify` with 4-line note `SPEC:<spec-path>#<REQ-IDs> / HARD:subagents+<constraints> / GATE:OPEN / DOMAINS:[<list>]`.
7. Documented exceptions only by domain leads + orchestrator via `references/exception-template.md`; on documented exception the 4-line note carries `GATE:WAIVED:<path-to-documented exception>`.
8. Close with a commit (never fails the gate). Example: `docs(gate-003): record OPEN verdict for SPEC-003 with 7 reviews`.

## 4b. C3 — CONDITIONAL/documented exception interrogation lane (security-owned)

- Mechanics + human contract: `../start-here/references/challenge-round.md` §1–§2. Trigger/budget (C3 row): every CONDITIONAL/documented exception, interrogated against the three-block bar in `references/exception-template.md` only — per-block pass/fail recorded in the C3 row of `references/gate-report.md`; missing block = FAIL, no promotion.
- Surgical scope: C3 does NOT re-run the routing table, run the reviewers again, or re-review the spec. Rows = CONDITIONALs — sample-of-one never satisfies. Every C3-interrogated CONDITIONAL lists `risk left over + owner` (or explicit `none + owner`); silent APPROVE+conditions = FAIL. Expiry default: 90 days or next release, whichever first (orchestrator-confirmed, re-review owner mandatory). CLOSED stays CLOSED without recorded `area-leads + orchestrator` sign-off.
- Evidence + safety: PII checkpoint per `challenge-round.md` §3 (zero PII/secrets/tokens in rounds/logs/exports; allowlisted evidence only; Ley 172-13 (Dominican privacy law)). Proof-or-refuted (`diff/scan/log`) and no-freelance-fix rules apply. Exit = pause + `grill: exited` + escalate; uncleared documented exceptions stay CONDITIONAL, no silent promote. No routing-table change.

## 5. What I won't do

- Open a gate with any ❌ verdict (only domain leads + orchestrator waive).
- Allow handoff with unverified conditions.
- Skip reviewers for a touched domain or override a verdict myself.
- Allow a single agent to conduct multiple reviewers' work (strictly 1 subagent per reviewer; no bundled reviews).

## 6. References

- `references/gate-report.md` — Consolidated verdicts + conditions.
- `references/exception-template.md` — Domain owners + orchestrator override record.
- `references/engineering/` — readability, reliability, refuter, resilience, risk, run-the-tests checklists.
- `references/domains/` — finance, legal, marketing, people, security, data, revenue, product, automation checklists + ops angle.
