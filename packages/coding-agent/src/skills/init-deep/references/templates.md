# Templates with domain slots — init-deep

Budgets are hard: root 50–150 lines, subdir 30–80 lines.
Domains displace generic text — they never extend the budget.

## Root AGENTS.md skeleton

```markdown
# PROJECT KNOWLEDGE BASE

**Generated:** {TIMESTAMP}
**Commit:** {SHORT_SHA}
**Branch:** {BRANCH}

## OVERVIEW

{1-2 sentences: what + core stack}

## DOMAINS ACTIVE

| Domain | Status | Evidence |
|--------|--------|----------|
| Security & Privacy | active/absent | {path or —} |
| Testing | active/absent | {path or —} |
| Engineering | active | {path} |
| Operations & Automation | active/absent | {path or —} |
| Legal & Regulatory | active/absent | {path or —} |
| Brand & Marketing | active/absent | {path or —} |
| Revenue & Commercial | active/absent | {path or —} |
| Product | active/absent | {path or —} |
| Financial | active/absent | {path or —} |
| People & Conduct | active/absent | {path or —} |

## STRUCTURE

{tree with non-obvious purposes only}

## WHERE TO LOOK

| Task | Location | Notes |

## BOUNDARIES

{trust boundaries, PII stores with purpose/TTL/deletion route, approval gates.
Skip if no cross-domain evidence. Max 8 lines.}

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

## Subdirectory skeleton

```markdown
# {DIR} — AGENTS

`DOMAINS: {max 3, e.g. Security & Privacy, Testing}`

## OVERVIEW

{1 line: responsibility of this dir}

## WHERE TO LOOK

| Task | Location | Notes |

## GUARDRAILS (THIS DIR)

{max 5 bullets, domain-specific deltas only. No parent repeats.
Pick from the per-domain examples below — adapt paths, drop the rest.}

## CONVENTIONS

{only if different from parent}

## ANTI-PATTERNS

{explicitly forbidden here}
```

Omit `STRUCTURE` unless dir has >5 subdirs.
Omit `GUARDRAILS` bullets without evidence.

## GUARDRAILS examples per domain (pick, adapt, never paste all)

- Security & Privacy:
  `- Security: queries parameterized only — see db/client.ts; never interpolate user input`
  `- Privacy: PII store users (purpose: auth, TTL: 30d, deletion: DSR route docs/privacy.md)`
- Testing:
  `- Testing: unit floor 80% — tests/unit/<domain>/ required with every behavior change`
  `- Testing: no merge on red; flaky tests quarantined with owner + ticket, never silently skipped`
- Engineering:
  `- Engineering: strict types only (no any) — see tsconfig strict; wrap errors with context`
  `- Engineering: no circular deps; side effects at edges, DI over globals`
- Operations & Automation:
  `- Ops: pipeline as code — .github/workflows/; no manual prod changes outside it`
  `- Ops: progressive deploy with auto-rollback on SLO breach; flag + kill switch per risky change`
- Legal & Regulatory:
  `- Legal: every contract reviewed by legal before signature — route, don't interpret`
  `- Legal: new PII store/export → privacy review + DPIA if high risk (72h breach-notify ready)`
- Brand & Marketing:
  `- Brand: no claim without evidence on file — comparatives need verified data + legal review`
  `- Brand: opt-in per channel (Ley 172-13); opt-out honored, suppression lists enforced`
- Revenue & Commercial:
  `- Revenue: CRM is source of truth — no stage advance without exit criteria`
  `- Revenue: discounts/non-standard terms need threshold-matrix approval; no verbal side deals`
- Product:
  `- Product: every PRD needs ≥1 falsifiable acceptance criterion — else CLOSED at gate`
  `- Product: one north-star metric per product; roadmap bets carry confidence + evidence`
- Financial:
  `- Finance: no spend without budget line + owner approval; dual approval above threshold`
  `- Finance: no single person initiates + approves + reconciles the same transaction`
- People & Conduct:
  `- People: least-privilege access; same-day revocation on exit`
  `- People: employee PII purpose/TTL/deletion enforced; no bulk exports without approval`
- Cross-Domain:
  `- Boundary: new endpoint/adapter/queue payload → security review before merge`
  `- Boundary: new PII or cross-border flow → privacy review; pricing/entitlement change → CRO + Finance + Product`
