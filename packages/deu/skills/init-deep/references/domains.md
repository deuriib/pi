# Domain Taxonomy — init-deep

Canonical list. Use ONLY these 11 names in `AGENTS.md` output. No synonyms.

| # | Domain | AGENTS.md section anchor | What it covers | Typical evidence |
|---|--------|--------------------------|----------------|------------------|
| 1 | Security & Privacy | `SECURITY` | Trust boundaries, PII stores, secrets, auth, OWASP surface | `auth/`, `*.key`, `.env*`, `login`, `token`, `PII`, `GDPR/Ley 172-13` mentions |
| 2 | Testing | `TESTING` | Unit/integration/e2e/contract/security/perf scope + floors | `*.test.*`, `*.spec.*`, `conftest*`, `playwright*`, `vitest*`, `coverage/` |
| 3 | Engineering | `ENGINEERING` | Stack, conventions, code map, structure | `src/`, `package.json`, `pyproject.toml`, `go.mod`, entry files |
| 4 | Operations & Automation | `OPS` | Pipeline, deploy, IaC, observability, rollback | `Dockerfile`, `.github/workflows/`, `*.tf`, `helm/`, `k8s/`, `Makefile` |
| 5 | Legal & Regulatory | `LEGAL` | Contracts, licenses, DPAs, ROPA, retention | `LICENSE*`, `*contract*`, `*DPA*`, `*ROPA*`, `terms/`, `privacy/` |
| 6 | Brand & Marketing | `BRAND` | Claims, assets, consent, channels | `brand/`, `*campaign*`, `*copydeck*`, `assets/licensed/` |
| 7 | Revenue & Commercial | `REVENUE` | Pipeline, pricing, CPQ, billing, churn | `pricing*`, `*billing*`, `*invoice*`, `*checkout*`, `crm/` |
| 8 | Product | `PRODUCT` | Problem, PRD, roadmap, north-star metric | `PRD*`, `roadmap*`, `discovery/`, `specs/` |
| 9 | Financial | `FINANCE` | Budget, spend, controls, treasury, tax | `budget*`, `*invoice*`, `*expense*`, `ledger/`, `tax/` |
| 10 | People & Conduct | `PEOPLE` | Roles, access, onboarding/offboarding, training | `org/`, `roles/`, `onboarding*`, `CODE_OF_CONDUCT*` |
| 11 | Cross-Domain | `BOUNDARIES` | Interfaces between domains, handoffs, approvals | API/queue/pipeline touching ≥2 domains, `openapi*`, `asyncapi*`, `ADRs/` |

Rules:

- Emit a domain section ONLY with file/path evidence. No evidence = mark `absent`, do not write generic advice.
- Root `AGENTS.md` gets `DOMAINS ACTIVE` map (present + absent in one line if useful).
- Subdir gets max 3 domain tags (`DOMAINS: Security, Testing`). Parent repeats are forbidden — child documents only its delta.
- `Cross-Domain` is derived: any endpoint/adapter/queue/pipeline payload = trust boundary → must appear in `BOUNDARIES`.
