# Security Review: SPEC-deu-vendor

**Reviewer:** security owner via check-security
**Date:** 2026-09-29
**Verdict:** Conditional

## Threat Model

**Methodology:** threat checklist
**Date:** 2026-09-29

### Attack Surface

| Surface | Entry Point | Trust Boundary |
|---------|-------------|----------------|
| deu-core `tool_call` guard (bash/user_bash) | agent tool input `command` | internal (agent ↔ tools) |
| deu-mcp `session_start` (context7, parallel-search) | `https://mcp.context7.com/mcp`, `https://search.parallel.ai/mcp` con `directTools: true` | external (HTTPS a terceros) |
| launcher `index.ts` (spawn pi-launcher / fallback `pi` con `shell: true`) | PATH scan + argv heredados | internal (host) con riesgo de PATH hijack en fallback |
| `lib/pkg-meta` (findPackageJSON + readFileSync) | FS local del package | internal |
| semilla SYSTEM/APPEND → configDir | `.deu/` proyecto si trusted, si no `~/.deu/agent/` | internal (trust-gated por runtime) |
| manifiesto + deps workspace | `package.json`, lockfile, shrinkwrap | supply chain interna |

### threat checklist Analysis

| Threat | Applicable? | Mitigation |
|--------|-------------|------------|
| Spoofing | Yes (MCP externas) | Allowlist cerrada de 2 URLs HTTPS; registro vía `pi-mcp-adapter`; sin credenciales en código. Condición C-001: no añadir URLs sin nuevo review |
| Tampering | Yes (command input, MCP responses, PATH) | Guard con lista cerrada case-insensitive (`rm -rf /`, `rm -rf ~`, `--no-preserve-root`, `mkfs.`, `diskpart`, `format c:`); bloqueo sin UI; fallback `shell: true` solo si falta launcher. Condición C-002: T-005a cubre los 6 patrones + permitido + sin-UI |
| Repudiation | Yes (comandos destructivos) | Confirm UI con comando visible (`deu guard`); bloqueo con reason trazable. Sin log PII |
| Information Disclosure | Yes (prompt semilla, MCP directTools) | Sin secretos/tokens en código (verificado en deu-core/deu-mcp); semilla viaja en `files[]`, runtime lee solo configDir trust-gated; `directTools` expone respuestas de terceros al agente — solo 2 fuentes declaradas |
| Denial of Service | Yes (MCP caídas) | Registro best-effort con try/catch + notify; no bloquea sesión. Condición C-003 |
| Elevation of Privilege | No | Sin auth nueva, sin setuid, sin cambio de permisos; guard no eleva, solo bloquea |

### Residual Risk

MCP con `directTools` ejecuta herramientas de terceros dentro del agente: respuestas maliciosas podrían intentar prompt injection. Mitigado por allowlist de 2 + sin credenciales + best-effort. Owner: security. Riesgo PATH hijack en fallback `shell: true` cuando falta launcher: mitigado por preferir `pi-launcher.js` por PATH con `existsSync`; documentado como inofensivo DEP0190 en win32. Owner: engineering.

## Findings

| ID | Severity | Finding | Remediation |
|----|----------|---------|-------------|
| S-001 | Medium | `deu-mcp` expone herramientas externas directas (2 URLs) sin threat checklist previo archivado | E-005b: checklist archivado antes de build; congelar allowlist (C-001) |
| S-002 | Medium | Guard con lista cerrada no cubre variantes (`rm -rf $HOME`, `dd`, `chmod -R 777 /`) | Documentado como lista mínima, no exhaustiva; T-005a fija el piso; futuras variantes por `fix-a-bug`, no en este move |
| S-003 | Low | Fallback `spawn("pi", { shell: true })` | Aceptado solo cuando falta launcher; preferir launcher por defecto; sin cambio en este move |
| S-004 | Low | `lib/pkg-meta` lee package.json best-effort con fallback silencioso | Aceptado: no rompe carga de extensión; fallback `deu/0.0.0` visible en diagnóstico |

## Conditions for Approval

- C-001: allowlist MCP congelada en 2 URLs; añadir una exige nuevo `check-security` (evidencia E-005b)
- C-002: build ejecuta T-005a (6 patrones + permitido + bloqueo sin UI) en verde
- C-003: registro MCP sigue best-effort; ningún fallo MCP bloquea sesión
- C-004: cero secretos/tokens en `packages/deu` (verificado en E-006); vault/env únicamente

## Sign-off

- [ ] security owner
- [ ] engineering owner (arquitectura tocada: workspace + invariantes)
