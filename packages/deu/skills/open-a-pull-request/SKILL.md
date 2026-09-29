---
name: open-a-pull-request
description: "Opens a pull request that stays small enough to actually read — under 400 changed lines, with the checks green. Use when a branch is ready for other people. Triggered by \"open a pull request\", \"make a PR\", \"ready for review\", or \"push a branch\"."
---

# Pull-Request — Branch & PR Discipline

> *"Haces las cosas como para Dios, por eso trabajas con excelencia, dedicación y minimalista."*

## 1. Purpose

Make every frame-ship pull request small, traceable, and gate-ready: one intent per PR, named branch, filled body template, 400-line review budget, Conventional Commits, and green local checks before review.

## 2. Contract

- **IN** — one approved unit (spec or issue) + 4-line note accepted by reference + clean baseline.
- **OUT** — branch `^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert)\/[a-z0-9._-]+$` + PR per `references/pr-body-template.md` (≤400 lines, `mise run typecheck` green).
- **NEXT** — `frame-ship:review` for the change under review (chain order never changes).
- **STOP** — no approved unit → route to `agree-the-goal` / `write-the-requirements`. Red baseline → no PR.

## 2b. Role Binding (Org)

- **Bound to:** orchestrator as coordinator plus owning domain lead and domain specialists opening PRs for all 8 business domains (see `../AGENTS.md` catalogue).
- Specialists never self-approve their own PR; owning domain lead review required.

## 3. Process

0. Pre-flight LOAD — STOP: `skill(open-a-pull-request)` loaded? `SPEC/HARD/GATE/DOMAINS` 4-line note accepted by reference? Local baseline clean (`git status --porcelain` empty or session-recorded override)? Any NO → STOP. Retry N=2 differently, then escalate to orchestrator.
1. Link the work: every PR references one approved unit — `Closes #<N>` or `SPEC:<spec-path>#REQ-IDs` in the PR body. No approved unit → stop and route to `frame-ship:agree-the-goal` / `frame-ship:write-the-requirements` first.
2. Create a branch from `main` using `references/branch-commit-guide.md` pattern `^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert)\/[a-z0-9._-]+$` (all lowercase, short, hyphen-separated).
3. Implement strictly within the approved proposal (`PROPOSAL.md`); scope expansion needs a new proposal.
4. Run local checks before pushing: `mise run typecheck` (required). Fix failures before pushing — never open a PR on red.
5. Commit with Conventional Commits (`references/branch-commit-guide.md`); never add `Co-Authored-By` trailers; never force-push to `main`/`master`.
6. Open the PR with `references/pr-body-template.md` fully filled: linked unit, summary, changes table, test plan, checklist. Declare the single PR intent (fix/feat/docs/refactor/chore/breaking).
7. Enforce the 400-line review budget (`additions + deletions ≤ 400`) or document the `size:exception` rationale in the PR body. All checks green before merge.
8. Hand off to `frame-ship:review` with 4-line note `SPEC:<spec-path>#<REQ-IDs> / HARD:subagents+<constraints> / GATE:reviewing / DOMAINS:[<list>]` plus the PR URL — opening the PR is not the handoff.

## 4. What I won't do

- Open a PR without a linked approved issue or spec.
- Open a PR on a red baseline or with failing `mise run typecheck`.
- Force-push to protected branches, add AI-attribution trailers, or widen permissions to pass checks.
- Paste secrets, tokens, credentials, sessions, or PII in branches, commits, bodies, or logs.

## 5. References

- `references/pr-body-template.md` — PR body template (linked unit, summary, changes, test plan, checklist).
- `references/branch-commit-guide.md` — Branch naming + Conventional Commits guide.
