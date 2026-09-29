# Domain Signals — glob/grep map for init-deep discovery

Use with native tools first (`Glob`, `Grep`). pwsh fallback only if needed.
Each hit produces: `{ domain, evidence_path, confidence }`.
Require ≥1 evidence path per claimed domain. Tokenise PII — never paste secrets.

## Signal table

| Domain | Glob signals | Grep signals (case-insensitive) |
|--------|--------------|---------------------------------|
| Security & Privacy | `**/auth/**`, `**/*secret*`, `**/.env*`, `**/*token*`, `**/privacy/**` | `password|secret|api[_-]?key|bearer|session|pii|gdpr|ley 172-13|dpa|ropa` |
| Testing | `**/*.test.*`, `**/*.spec.*`, `**/conftest*`, `**/playwright*`, `**/vitest*`, `**/coverage/**` | `describe\(|test\(|expect\(|given.*when.*then` |
| Engineering | `src/**`, `package.json`, `pyproject.toml`, `go.mod`, `*.sln`, `Cargo.toml` | `export (class|function|const)|^class |^def |^func ` |
| Operations & Automation | `Dockerfile*`, `.github/workflows/**`, `*.tf`, `helm/**`, `k8s/**`, `Makefile`, `.gitlab-ci*` | `pipeline|deploy|rollback|canary|runbook|slo` |
| Legal & Regulatory | `LICENSE*`, `**/*contract*`, `**/*DPA*`, `**/*ROPA*`, `**/terms/**`, `**/privacy/**` | `liability|indemnity|warranty|breach-notify|retention|consent` |
| Brand & Marketing | `**/brand/**`, `**/*campaign*`, `**/*copydeck*`, `**/assets/licensed/**` | `claim|testimonial|utm_|opt-in|opt-out|suppression` |
| Revenue & Commercial | `**/pricing*`, `**/*billing*`, `**/*invoice*`, `**/*checkout*`, `**/crm/**`, `**/cpq/**` | `discount|quote|forecast|churn|mrr|arr|cac|ltv` |
| Product | `PRD*`, `roadmap*`, `discovery/**`, `specs/**`, `docs/specs/**` | `north-star|acceptance criteria|non-goals|persona|user story` |
| Financial | `**/budget*`, `**/*expense*`, `**/ledger/**`, `**/tax/**` | `purchase order|reimburse|accrual|revenue recognition|fx|bad-debt` |
| People & Conduct | `**/org/**`, `**/roles/**`, `**/onboarding*`, `CODE_OF_CONDUCT*`, `**/offboarding*` | `pay band|pip|onboarding|offboarding|background check|whistleblower` |
| Cross-Domain | `openapi*`, `asyncapi*`, `**/adrs/**`, `docs/specs/decisions/**` | `openapi|asyncapi|webhook|event schema|contract-first|strangler` |

## Confidence

- `high`: regulated artifact hit (contract, DPA, invoice, auth, pipeline) or ≥3 corroborating hits.
- `med`: 1–2 hits with plausible context.
- `low`: keyword only, no path corroboration → do NOT emit a section; note as `candidate` in discovery output.

## Output shape

```text
DOMAIN_SIGNALS = [
  { domain: "Security & Privacy", evidence: "src/auth/login.ts", confidence: "high" },
  { domain: "Testing", evidence: "tests/unit/auth/login.test.ts", confidence: "high" },
  { domain: "Legal & Regulatory", evidence: "docs/contracts/Master.docx", confidence: "med" }
]
```

Dirs with zero hits: inherit parent domains, claim nothing new.
