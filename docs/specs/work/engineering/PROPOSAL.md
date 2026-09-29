# Proposed Changes: engineering

**Spec Reference:** SPEC-deu-vendor
**Agent:** engineering
**Date:** 2026-09-29
**Execution_Mode:** subagents (inherited from spec)
**Domains-Touched:** [engineering, security, automation/ops]

## Summary

Vendorizar ../deu completo como `packages/deu` (workspace `packages/*`), con regla de declaración única para `bin deu`, `piConfig`, bloque `pi` y semilla SYSTEM/APPEND. Repo intacto salvo la creación del workspace más su manifiesto; sin renombres `pi-*` externos.

Nota de singleton: este archivo sustituye en el lane engineering al PROPOSAL anterior (DESIGN.md como context file). El diff sin commitear en `packages/coding-agent/src/core/resource-loader.ts` queda fuera de alcance: se revierte o va por su propio ciclo, no viaja en este move.

## Changes

| Target | Change Type | Description |
| ------ | ----------- | ----------- |
| `packages/deu/index.ts` | file-create | Launcher desde ../deu (DEU dir + fallback PI_*), solo ajuste de imports si exige el monorepo |
| `packages/deu/lib/` | file-create | `pkg-meta.ts` + `index.ts` intactos; fallback `deu/0.0.0` vigente |
| `packages/deu/extensions/deu-core.ts` | file-create | Guard bash destructivo intacto; confirmación UI o bloqueo |
| `packages/deu/extensions/deu-mcp.ts` | file-create | Registro context7 + parallel-search vía pi-mcp-adapter; best-effort con aviso |
| `packages/deu/extensions/deu-tui/` | file-create | 15 ficheros intactos salvo imports `@earendil-works/pi-*` del monorepo |
| `packages/deu/skills/` | file-create | 14 skills frame-ship intactas |
| `packages/deu/prompts/deu-check.md` | file-create | Prompt diagnóstico intacto |
| `packages/deu/SYSTEM.md` + `APPEND_SYSTEM.md` | file-create | Semilla en `files[]`; runtime lee solo configDir (decisión 0003) |
| `packages/deu/package.json` | file-create | Manifiesto: bloque `pi` solo con claves válidas, `piConfig { name: deu, configDir: .deu }`, `bin` redirigido (no duplica `deu`), `files[]` sin fantasmas |
| `packages/deu/tsconfig.json` + `README.md` | file-create | TS config alineado al root; README con uso `deu config` |
| `package-lock.json` / shrinkwrap | config-update | Registrar workspace; `npm install --ignore-scripts` + checks de shrinkwrap/install-lock |

Change types per template. No se toca `packages/coding-agent/*`, no se renombra `pi-*` externo, no se toca `.agents/skills/pi-agent/**`.

## Rationale

El workspace aísla deu con su `pi/piConfig` propio y resuelve el doble-origen sin mezclar 4224 líneas deu-tui con `packages/tui`. La regla única elimina la colisión `bin/configDir` en el punto exacto donde nace: un bin publica, el otro redirige; una semilla viaja, un lector lee.

## Alternatives Considered

| Alternative | Reason Rejected |
| ----------- | --------------- |
| Disolver en coding-agent | Mezcla deu-tui con packages/tui; alto drift y regresión |
| Dejar externo npm:deu | No cierra el rebranding en este repo |
| Duplicar bin/piConfig en ambos packages | Crea doble fuente; rompe REQ-002 y la aprobación "punto" |
| Traer también `package-lock.json` de ../deu tal cual | Choca con lockfile del monorepo; se regenera vía workspace |

## Test Plan

> Plan congelado a la aprobación. `build` lo ejecuta; resultados en `TESTS.md`. Sin plan no hay aprobación.

### REQ-ID to Test Mapping

| REQ-ID | Test ID | Scope / Path | Test Type | Expected Behavior / Boundary Checked |
| ------ | ------- | ------------ | --------- | ------------------------------------- |
| REQ-001 | E-001 | `docs/specs/work/engineering/evidence/E-001-tree.txt` | Attestation | Árbol packages/deu con index, lib, extensions, skills, prompts, SYSTEM, APPEND; negativo: falta un top-level → FAIL |
| REQ-002 | E-002 | `docs/specs/work/engineering/evidence/E-002-single-declaration.txt` | Attestation | Grep prueba un solo `bin deu` efectivo + `configDir .deu` único; negativo: dos bins publicando → FAIL |
| REQ-003 | T-003 | `packages/deu/test/manifest.test.ts` | Unit | Bloque `pi` solo con claves válidas; `files[]` existen; `piConfig` name/configDir exactos; negativo: clave fantasma o theme inexistente → FAIL |
| REQ-004 | E-004 | `docs/specs/work/engineering/evidence/E-004-deu-tui-diffstat.txt` | Attestation | `diff --stat` deu-tui vs ../deu solo con ajustes de import; negativo: lógica alterada → FAIL |
| REQ-005 | T-005a | `packages/deu/test/deu-core-guard.test.ts` | Security | Bloquea `rm -rf /`, `~`, `--no-preserve-root`, `mkfs.`, `diskpart`, `format c:`; permite `ls`; sin UI bloquea destructivo |
| REQ-005 | E-005b | `docs/specs/work/engineering/evidence/E-005b-mcp-checklist.txt` | Attestation | Threat checklist context7/parallel-search: pass o pass-with-conditions archivado |
| REQ-006 | E-006 | `docs/specs/work/engineering/evidence/E-006-checks.log` | Attestation | `npm run check` scope deu + suite relevante verdes; `skeptic` previo a QA con log |

### Declared Coverage Floors

| Metric | Floor Declared | Scope / Justification |
| ------ | -------------- | --------------------- |
| Line | 80% | Módulos nuevos con lógica: `lib/`, `deu-core`, manifiesto-test |
| Branch | 75% | Ramas del guard (6 patrones + UI/no-UI + permitido) |
| Function | 85% | Sin nuevas exports salvo test-harness |
| Unit suite runtime | <30s | Gate del repo; `./test.sh` scope + vitest dirigido |

### Test Environment & Setup

- **Prerequisites:** repo root, `npm install --ignore-scripts` hecho; faux provider, sin red salvo MCP declaradas (no se llaman en tests)
- **Environment Variables:** ninguna con secretos; `DEU_CODING_AGENT_DIR` temporal en tmp si se prueba el launcher
- **Cleanup & Isolation:** tmp dirs por caso; `afterEach` limpia; sin `sleep()`; solo el workspace nuevo se toca

## Risk Assessment

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|-----------|--------|------------|
| R-001 | Colisión `bin deu` con coding-agent | Med | Med | Un bin publica, el otro redirige; E-002 lo prueba; rollback por revert |
| R-002 | Drift deu-tui vs packages/tui | Med | Med | Diff byte a byte salvo imports (E-004); sin ADR no hay divergencia lógica |
| R-003 | Lockfile/shrinkwrap rompe CI | Med | Med | Regenerar vía scripts del repo; checks `check:shrinkwrap` + `install-lock` en E-006 |
| R-004 | MCP externas caídas al arrancar | Med | Low | Best-effort con notify; sin bloqueo de sesión |
| R-005 | Prompt doble-carga (semilla + configDir) | Low | Med | Decisión 0003: un solo lector; semilla solo viaja en `files[]` |
| R-006 | Pérdida del PROPOSAL anterior del lane (resource-loader) | Low | Low | Declarado aquí: ese diff va por su propio ciclo o se revierte; no viaja en este move |

**What else could break:** engineering (workspace graph, bundle, TUI imports); security (guard bypass por variante de comando no listada, SSRF fuera de las 2 URLs); automation/ops (pipeline gates, SBOM, registros). Sin superficie cliente/regulador/revenue: herramienta interna de desarrollo.

**Rollback Plan:** revert de un commit del workspace; sin migración ni config externa. Owner: engineering. ETA: minutos.

**Security Considerations:** guard con lista cerrada de patrones + bloqueo sin UI; MCP solo a 2 URLs allowlist vía adapter; sin secretos/PII en código o logs. `check-security` obligatorio antes de build.

**Domain Considerations:** engineering (owner, arquitectura e invariantes — `check-design` aplica); security (threat checklist — `check-security` aplica); automation/ops (workspace, shrinkwrap, gates). Finanzas/legal/marketing/people/revenue/producto: sin impacto.

## Approval Required From

- [ ] Owning domain lead: engineering owner
- [ ] engineering owner (workspace + invariantes + impacto cross-package — `check-design` aplica)
- [ ] security owner (bash guard + MCP externas — `check-security` aplica)
- [ ] Test Plan present and covering every REQ-ID — sí (E-001, E-002, T-003, E-004, T-005a, E-005b, E-006)

> reviews: `check-security` + `check-design` requeridos antes de build. Sin aprobación no hay código.

## C2 challenge hook (REQ-002 — additive, no new required section)

- Trigger: multi-domain scope (engineering + security + automation/ops) → la ronda dispara. Sin superficie auth/data/PII de usuarios; MCP externas y guard sí van a `check-security`.
- Presupuesto: una sola pasada de ≤3 preguntas; pregunta 4 = FAIL. Re-grill a pedido ≤1 pasada extra. Salida antes de decidir = pausa + `grill: exited`, propuesta sin aprobar.
- Sin PII/secretos en la ronda; evidencia allowlist únicamente.
