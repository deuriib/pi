---
name: init-deep
description: Deep project bootstrap/maintaining — generates/updates hierarchical AGENTS.md files (root + scored subdirectories) with multi-domain coverage (engineering, security, testing, ops, legal, brand, revenue, product, finance, people). Use when a repo needs full agent context beyond what /init covers.
---

# /init-deep

Generate hierarchical `AGENTS.md` files. Root + complexity-scored subdirectories.
Domain-aware: every file declares which of the 11 governance domains apply,
with file/path evidence. No evidence = no section.
Does NOT replace or modify the built-in `/init` — additive only.

## Domain Taxonomy (canonical — use ONLY these names)

| Domain | Covers |
| ------ | ------ |
| Security & Privacy | trust boundaries, PII stores, secrets, auth |
| Testing | unit/integration/e2e/contract/security/perf scope |
| Engineering | stack, code map, conventions, structure |
| Operations & Automation | pipeline, deploy, IaC, observability, rollback |
| Legal & Regulatory | contracts, licenses, DPAs, ROPA, retention |
| Brand & Marketing | claims, assets, consent, channels |
| Revenue & Commercial | pipeline, pricing, CPQ, billing, churn |
| Product | problem, PRD, roadmap, north-star metric |
| Financial | budget, spend, controls, treasury, tax |
| People & Conduct | roles, access, onboarding/offboarding, training |
| Cross-Domain | interfaces/handoffs/approvals between ≥2 domains |

Full definitions + evidence map: `references/domains.md`.
Signal globs/greps: `references/domain-signals.md`.
Skeletons: `references/templates.md`.

## Usage

```text
/init-deep                          # Update mode: modify existing + create new where warranted
/init-deep --depth=2                # Limit directory depth (default: 3)
/init-deep --max-depth=2            # Alias of --depth (oMo compat)
/init-deep --create-new             # Read existing first (preserve context), then delete all and regenerate
/init-deep --domains=Security,Legal # Narrow to subset (default: all detected with evidence)
```

Arguments arrive in `$ARGUMENTS`:

```text
$ARGUMENTS
```

## Arguments

| Flag            | Meaning                                                                | Default           |
| --------------- | ---------------------------------------------------------------------- | ----------------- |
| `--depth=N`     | Hard cap on directory depth for new `AGENTS.md` files                  | `3`               |
| `--max-depth=N` | Alias of `--depth` (oMo compat)                                        | `3`               |
| `--create-new`  | Read existing files first, then remove all and regenerate from scratch | off (update mode) |
| `--domains=CSV` | Narrow to subset (e.g. `Security,Testing,Legal`); aliases accepted (`Sec`, `Ops`, `Rev`) | `all` (every domain with evidence) |

Parse `$ARGUMENTS` first. When both `--depth` and `--max-depth` appear, last one wins.
`--depth` cap applies to domain files too — no exceptions.
`--domains` filters emitted sections only; discovery still runs full-scope so
`DOMAINS ACTIVE` can mark filtered-out domains as `out-of-scope`.
Unknown domain names → warn + ignore, never fail.

## Guardrails (non-negotiable)

- **Manual only.** Run ONLY on explicit `/init-deep` invocation. Never auto-run on session start.
- **Project scope only.** Write `AGENTS.md` files inside the current project workdir only.
  Never modify `~/.config/opencode/AGENTS.md`, `~/.config/opencode/command/`, or any global config.
- **`/init` untouched.** Do not alter, wrap, or shadow the built-in `/init` behavior.
- **pwsh-compatible.** This session may run pwsh non-interactive without profiles.
  Prefer native tools (`Glob`, `Grep`, `Read`) over shell. When shell is needed,
  use `Get-ChildItem -Recurse` / `Select-Object` — NOT `find` / `sed` / `awk`.
- **UTF-8, no secrets.** Never print or commit tokens, keys, or credentials found during analysis.
- **No PII in output.** Tokenise names/emails/account IDs at capture (`[USER-1]`).
  PII stores get purpose/TTL/deletion route — never raw samples.
- **No legal advice.** Surface obligation + owner + route to legal. Never interpret contracts.
- **Evidence-gated domains.** Claim a domain ONLY with a file/path hit from
  `references/domain-signals.md`. Otherwise mark `absent`/`candidate` — no generic filler.
- **Edit vs Write.** If `AGENTS.md` already exists at the target path, update it with `Edit`.
  Only use `Write` for files that do not exist. Check existence first via `Read` or discovery.

## Workflow

Track ALL phases with `TodoWrite`. Mark `in_progress` → `completed` in real time:

```text
discovery — explore + structural map + domain signals + read existing AGENTS.md
scoring   — score directories (complexity + domain weight), apply --depth cap, decide locations
generate  — generate AGENTS.md files (root first, then subdirs) with domain slots
review    — deduplicate, validate budgets + evidence, trim
```

---

## Phase 1: Discovery + Analysis (concurrent)

Mark `discovery` as `in_progress`.

### 1a. Structural map (native tools first)

- `Glob` all source files (exclude `node_modules`, `.git`, `dist`, `build`, `venv`).
- Top directories by file count; code concentration by extension.
- Locate existing `AGENTS.md` / `CLAUDE.md` files (any depth).
- pwsh fallback only if native tools are insufficient:

```powershell
Get-ChildItem -Recurse -File -Force `
  | Where-Object { $_.FullName -notmatch 'node_modules|\.git|dist|build|venv' } `
  | Group-Object DirectoryName | Sort-Object Count -Descending | Select-Object -First 30
```

### 1b. Read existing AGENTS.md

For each existing file found: `Read` it, extract key insights, conventions,
anti-patterns into an `EXISTING_AGENTS` map. With `--create-new`, still read
everything first (preserve context) — delete only after reading.

### 1c. Code map (LSP when available)

- `lsp_symbols` scope=document on each entry point → file outline.
- `lsp_symbols` scope=workspace by kind (class/interface/function) → inventory.
- `lsp_find_references` on top exports → reference centrality.
- If LSP is unavailable, mark centrality unmeasured and rely on `Grep` + explore output.

### 1d. Parallel exploration

Fire background explore subagents immediately (structure, entry points,
conventions, anti-patterns, build/CI, test patterns) while the main session
runs 1a–1c. Scale agent count with project size (files, lines, depth,
monorepo packages, languages) — never a fixed count. Add one domain-scout
pass for non-code areas (`docs/`, `contracts/`, `pricing/`, `brand/`, pipelines).
Collect all results before scoring.

### 1e. Domain signals (evidence-gated, concurrent with 1d)

- `Glob`/`Grep` per `references/domain-signals.md` (native tools first).
- One hit → `{ domain, evidence_path, confidence: high/med/low }`.
- `high`: regulated artifact (contract, DPA, invoice, auth, pipeline) or ≥3 hits.
  `med`: 1–2 hits with context. `low`: keyword only → `candidate`, no section.
- Emit `DOMAIN_SIGNALS = [...]`. Dirs with zero hits inherit parent domains.
  Mark `discovery` completed.

---

## Phase 2: Scoring & Location Decision

Mark `scoring` as `in_progress`.

### Scoring matrix

| Factor               | Weight | High threshold       | Source         |
| -------------------- | ------ | -------------------- | -------------- |
| File count           | 3x     | >20                  | structural map |
| Subdir count         | 2x     | >5                   | structural map |
| Code ratio           | 2x     | >70%                 | structural map |
| Unique patterns      | 1x     | has own config       | explore        |
| Module boundary      | 2x     | has index/entry file | structural map |
| Symbol density       | 2x     | >30 symbols          | LSP            |
| Export count         | 2x     | >10 exports          | LSP/Grep       |
| Reference centrality | 3x     | >20 refs             | LSP            |
| PII/secrets proximity | 3x    | auth/env/token/PII hit | domain signals |
| Regulated artifact | 3x       | contract/DPA/invoice/license hit | domain signals |
| Revenue/customer impact | 2x  | pricing/billing/checkout hit | domain signals |
| Cross-domain boundary | 2x   | endpoint/queue/pipeline payload | domain signals |

### Decision rules

| Score | Action |
| ----- | ------ |
| Root (`.`) | ALWAYS create/update |
| >15 | Create `AGENTS.md` |
| 8–15 | Create only if distinct domain |
| <8 | Skip (parent covers) |
| **domain-override** | `high`-confidence regulated artifact (contract, DPA, auth, pipeline, invoice) → create even if score <8, tagged with that single domain |

Apply `--domains` filter + `--depth` / `--max-depth` cap AFTER scoring: drop every
location deeper than the cap or outside the filter, no exceptions. Emit the final list:

```text
AGENTS_LOCATIONS = [
  { path: ".", type: "root" },
  { path: "src/hooks", score: 18, reason: "high complexity" },
  { path: "docs/contracts", score: 6, reason: "domain-override: Legal", domains: ["Legal & Regulatory"] }
]
```

Mark `scoring` completed.

---

## Phase 3: Generate AGENTS.md

Mark `generate` as `in_progress`.

### Root AGENTS.md (full treatment, 50–150 lines)

Full skeleton: `references/templates.md`. Shape:

````markdown
# PROJECT KNOWLEDGE BASE

**Generated:** {TIMESTAMP}
**Commit:** {SHORT_SHA}
**Branch:** {BRANCH}

## OVERVIEW

{1-2 sentences: what + core stack}

## DOMAINS ACTIVE

| Domain | Status | Evidence |

## STRUCTURE

{tree with non-obvious purposes only}

## WHERE TO LOOK

| Task | Location | Notes |

## BOUNDARIES

{trust boundaries, PII stores (purpose/TTL/deletion), approval gates — max 8 lines}

## CODE MAP

{from LSP/Grep — skip if project <10 files}

## CONVENTIONS

{ONLY deviations from standard}

## ANTI-PATTERNS (THIS PROJECT)

{explicitly forbidden here}

## COMMANDS

```bash
{dev/test/build}
```

## NOTES

{gotchas}

```

Quality gates: telegraphic style, no generic advice, no content obvious from the tree.
Domains displace filler — they never extend the 150-line budget.
Every `active` domain needs an evidence path; `absent` needs none.

### Subdirectory files (30–80 lines each, parallel)

Header: `` `DOMAINS: {max 3}` `` (e.g. `` `DOMAINS: Security & Privacy, Testing` ``).
Then `OVERVIEW` (1 line), `WHERE TO LOOK`, `GUARDRAILS (THIS DIR)` (max 5 bullets,
domain deltas only), `CONVENTIONS` (only if different from parent), `ANTI-PATTERNS`.
`STRUCTURE` only if >5 subdirs. NEVER repeat parent content. Wait for all. Mark `generate`
completed.

---

## Phase 4: Review & Deduplicate

Mark `review` as `in_progress`. For each generated file: remove generic advice,
remove parent duplicates, enforce size limits (root ≤150, subdir ≤80),
verify telegraphic style, verify every `active` domain has an evidence path
and every `GUARDRAILS` bullet is dir-specific. Drop `low`-confidence domains.
Mark `review` completed.

---

## Final Report

```text
=== init-deep Complete ===

Mode: {update | create-new}
Max depth: {N}
Domains: {all | CSV filter}
Domains Active: {e.g. Engineering, Testing, Security & Privacy (3/11)}

Files:
  [OK] ./AGENTS.md (root, {N} lines)
  [OK] ./src/hooks/AGENTS.md ({N} lines, DOMAINS: Engineering, Testing)

Dirs Analyzed: {N}
AGENTS.md Created: {N}
AGENTS.md Updated: {N}

Hierarchy:
  ./AGENTS.md
  └── src/hooks/AGENTS.md
````

---

## Anti-Patterns

- Static explore-agent count regardless of project size.
- Sequential execution instead of parallel discovery.
- Ignoring existing files (always read first, even with `--create-new`).
- Documenting every directory — most dirs are covered by their parent.
- Child repeating parent content.
- Generic advice that applies to ALL projects.
- Verbose prose instead of telegraphic style.
- Claiming a domain without a file/path hit (no evidence = no section).
- Dumping raw PII/secrets into AGENTS.md instead of tokenising + purpose/TTL/route.
- Giving legal interpretations instead of routing to legal.
- Letting domains bloat past budgets (root >150, subdir >80).
- `find`/`sed`/`awk` shellisms that break on pwsh non-interactive.

## References

- `references/domains.md` — 11-domain taxonomy + per-domain AGENTS.md anchors.
- `references/domain-signals.md` — Glob/Grep map + confidence rules for `DOMAIN_SIGNALS`.
- `references/templates.md` — Root + subdir skeletons with domain slots and budgets.
