# Architecture Review: SPEC-deu-vendor

**Reviewer:** engineering owner
**Date:** 2026-09-29
**Verdict:** Conditional

## Contract Compliance

| Invariant | Status | Notes |
|-----------|--------|-------|
| INV-001 (un solo `bin deu` efectivo) | pass | PROPOSAL redirige, no duplica; E-002 lo prueba |
| INV-002 (un solo `configDir .deu`, un lector) | pass | Hereda decisión ../deu 0003; semilla solo viaja en `files[]` |
| INV-003 (bloque `pi` con claves válidas, `files[]` sin fantasmas) | pass | T-003 valida claves y existencia; `themes/` se des-declara si no hay tema propio |
| INV-004 (cero renombres `pi-*` externo) | pass | Out-of-scope congelado; Changes no toca coding-agent ni vendor docs |
| INV-005 (deu-tui sin divergencia sin ADR) | pass | E-004 limita el diff a imports; lógica alterada = FAIL |
| INV-006 (sin secretos/PII en código o logs) | pass | Verificado en deu-core/deu-mcp; E-006 lo confirma en build |

## DECISION Required?

- [x] Yes — DECISION-001 created
- [ ] No — change is within existing contracts

## Conditions for Approval

- C-001–C-004 de `security-review.md` (allowlist MCP congelada, T-005a verde, MCP best-effort, cero secretos) — sin override de security
- E-002 y E-004 en verde en build; si el diff deu-tui trae lógica, nuevo `check-design` antes de merge

## Sign-off

- [ ] engineering owner
