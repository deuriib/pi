# Proposed Changes: DESIGN.md as context file

**Spec Reference:** N/A — no `docs/specs/backlog/SPEC-*` exists in this repo; REQs defined inline below.
**Agent:** engineering
**Date:** 2026-09-29
**Execution_Mode:** direct (no SPEC to inherit from; single small change, no subagents)
**Domains-Touched:** engineering

## Summary

Load `DESIGN.md` alongside `AGENTS.md`/`CLAUDE.md` in every scope the current loader covers (global `agentDir` + each ancestor dir of `cwd`, top-most first). `DESIGN.md` is a supplement, not a fallback candidate: a directory containing both contributes both, `AGENTS.md` first.

## Changes

| Target | Change Type | Description |
| ------ | ----------- | ----------- |
| `packages/coding-agent/src/core/resource-loader.ts` | file-modify | `loadContextFileFromDir()` returns array; load AGENTS-family (existing precedence, one winner) + DESIGN-family (one winner) per dir. Update `loadProjectContextFiles()` flattening and `findShadowedContextFile()` to shadow both in linked worktrees. |
| `packages/coding-agent/test/resource-loader.test.ts` | file-modify | New/updated cases: DESIGN.md alone, AGENTS.md + DESIGN.md ordering, global + nested DESIGN.md inheritance, worktree shadowing for DESIGN.md. |
| `packages/coding-agent/test/system-prompt.test.ts`, `test/interactive-mode-status.test.ts` | file-modify | Update expectations where context-file display/count assumes one file per dir. Only if failing. |

## Rationale

Today `loadContextFileFromDir()` picks a single winner per directory (`AGENTS.override.md > AGENTS.md > CLAUDE.md`). Adding `DESIGN.md` to that candidate list would make it load only when no `AGENTS.md` exists in the same dir — useless for the stated goal ("como ya lo hace con AGENTS.md": same hierarchical discovery, both present). The supplement approach reuses the proven scope machinery (global + ancestors, top-down) unchanged.

Naming: `DESIGN.md`, `DESIGN.override.md`, `DESIGN.MD` — mirrors the existing AGENTS/CLAUDE case pattern. Order within a dir: AGENTS-family winner first, then DESIGN-family winner (stable, documented).

## Alternatives Considered

| Alternative | Reason Rejected |
| ----------- | --------------- |
| Append `DESIGN.md` to `candidates` (1-line change) | Silent shadowing: DESIGN.md ignored wherever AGENTS.md exists; fails the requirement. |
| Separate `--design` CLI flag / `--context-file` passthrough | New UX surface for something that should be automatic like AGENTS.md; out of scope. |
| Recursive `**/DESIGN.md` glob instead of ancestor walk | Breaks the top-most-first inheritance contract and worktree dedup; higher blast radius. |

## Test Plan

### REQ-ID to Test Mapping

| REQ-ID | Test ID | Scope / Path | Test Type | Expected Behavior / Boundary Checked |
| ------ | ------- | ------------ | --------- | ------------------------------------- |
| REQ-001 DESIGN.md loads like AGENTS.md (global + ancestors, top-down) | T-001 | `packages/coding-agent/test/resource-loader.test.ts` | Unit | DESIGN.md in global agentDir + cwd + parent all load, ordered top-most → cwd; content intact. |
| REQ-002 Both files in same dir contribute both, AGENTS first | T-002 | `packages/coding-agent/test/resource-loader.test.ts` | Unit | Dir with AGENTS.md + DESIGN.md yields 2 entries in order; negative: neither shadows the other. |
| REQ-003 Linked-worktree shadowing covers DESIGN.md | T-003 | `packages/coding-agent/test/resource-loader.test.ts` | Unit | Nested linked worktree with own DESIGN.md shadows main-repo DESIGN.md (mirrors existing AGENTS.md worktree cases). |
| REQ-004 No regression: AGENTS/CLAUDE precedence unchanged | T-004 | existing `resource-loader.test.ts` suite + `system-prompt.test.ts` | Regression | Full existing suite green; unreadable-dir and non-file (dir named DESIGN.md) cases handled like AGENTS.md. |

### Declared Coverage Floors

| Metric | Floor Declared | Scope / Justification |
| ------ | -------------- | --------------------- |
| Line | 80% | Touched module `resource-loader.ts` (repo standard). |
| Branch | 75% | New per-dir combination branches (AGENTS-only / DESIGN-only / both / neither). |
| Function | 85% | No new exported functions expected. |
| Unit suite runtime | <30s | Repo gate; run `./test.sh` scope, plus targeted vitest file. |

### Test Environment & Setup

- **Prerequisites:** repo root, `npm install` done; temp dirs via existing test harness (no real FS writes outside tmp).
- **Environment Variables:** none (faux provider; no keys, no network).
- **Cleanup & Isolation:** each case writes only its own tmp DESIGN.md/AGENTS.md files; `afterEach` cleanup per existing suite conventions.

## Risk Assessment

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|-----------|--------|------------|
| R-001 | Prompt bloat: repos with both files inject more context per turn (cost/latency) | Med | Low | Same opt-out as today (`noContextFiles`); document in README section for context files. |
| R-002 | Order-dependence: model behaves differently with AGENTS-first vs DESIGN-first | Low | Low | Fixed documented order (AGENTS then DESIGN); covered by T-002. |
| R-003 | Worktree/submodule double-load if shadowing misses DESIGN.md | Low | Low | T-003 mirrors existing shadow cases; reuse `canonicalizePath` comparison. |

**What else could break:** system-prompt assembly (all modes: interactive/print/RPC consume `getAgentsFiles()`), `/status` context-file display, compaction summaries that list context files. No customer/regulator/revenue surface: internal dev-tool behavior only.

**Rollback Plan:** revert single commit of `resource-loader.ts` + tests; no migration, no config change. Owner: engineering. ETA: minutes.

**Security Considerations:** no new trust boundary. DESIGN.md flows through the exact same loader/trust path as AGENTS.md (project-trust-gated `SYSTEM.md`/`APPEND_SYSTEM.md` unaffected; context files are prompt text, existing injection posture unchanged). `check-security`: N/A — same mechanism, no auth/data/external-API change.

**Domain Considerations:** engineering only. No finance/legal/marketing/people/revenue/automation impact.

## Approval Required From

- [ ] Owning domain lead: engineering owner
- [ ] engineering owner (shared loader + cross-mode impact — `check-design` applies, decision note only if contract change is judged so at review)
- [ ] security owner — N/A (justification above)
- [ ] Test Plan present and covering every REQ-ID — yes (T-001…T-004)

> reviews: `check-design` flagged for reviewer call; `check-security` N/A with justification. No repo files modified in this phase; no commit without explicit ask.
