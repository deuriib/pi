# Requirements Index: vendor deu completo

**Owner:** engineering
**Brief Reference:** GOAL-deu-vendor
**Domains-Touched:** [engineering, security, automation/ops]

## Functional Requirements

| ID | Requirement | Priority | Source | Spec | Domain | Evidence Type |
|----|-------------|----------|--------|------|--------|---------------|
| REQ-001 | packages/deu con contenido completo ../deu (index, lib, core, mcp, deu-tui 15 ficheros, 14 skills, prompts, SYSTEM/APPEND) | P0 | GOAL-deu-vendor | SPEC-deu-vendor | engineering | review (árbol) |
| REQ-002 | Cero duplicación de bin/piConfig/bloque-pi/semilla | P0 | GOAL-deu-vendor + aprobación "punto" | SPEC-deu-vendor | engineering | review (grep) |
| REQ-003 | Manifiesto válido sin fantasmas ni renombres externos | P0 | GOAL-deu-vendor | SPEC-deu-vendor | engineering | test (script verificación) |
| REQ-004 | deu-tui intacto y resolviendo pi-* del monorepo | P0 | GOAL-deu-vendor | SPEC-deu-vendor | engineering | review (diff --stat) |

## Non-Functional Requirements

| ID | Requirement | Category | Target |
|----|-------------|----------|--------|
| REQ-005 | Guard destructivo + MCP externas con threat checklist | Security | pass o pass-with-conditions, reporte archivado |
| REQ-006 | Check + suite relevante verdes, skeptic previo a QA | Quality/Perf | `npm run check` verde, suite <30s, skeptic en HANDOFF |

## Domain Controls (only touched domains)

| Domain | Control | Owner |
|--------|---------|-------|
| security | OWASP Top-10 screen en boundary MCP/tool_call; sin secretos en código; SSRF allowlist (solo 2 URLs MCP declaradas) | security |
| automation/ops | workspace registrado, shrinkwrap/install-lock verificados, pipeline gates verdes, rollback por revert | automation/ops + engineering |
