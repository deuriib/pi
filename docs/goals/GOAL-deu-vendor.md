# goal file: Vendor completo de deu en pi como packages/deu

**ID:** GOAL-deu-vendor
**Initiator:** orchestrator
**Date:** 2026-09-29
**Status:** approved
**Execution_Mode:** subagents (frozen at agree-the-goal; trivial <50 lines goes by CEO small-task shortcut checkpoint-only, outside methodology)
**Domains-Touched:** [engineering, security, automation/ops]
**Classification:** big-new-direction — restructure: ../deu pasa a workspace dentro del monorepo pi
**Framings-Considered:** (A) vendor como packages/deu — recomendado: aísla deu, versionable, menor blast radius sobre coding-agent; (B) disolver en coding-agent — rechazado: mezcla 4224 líneas deu-tui con packages/tui, alto riesgo de drift y regresión; (C) dejar externo npm:deu — rechazado: no cierra el rebranding en este repo. YAGNI: fuera temas propios, rewrites del router, renombres pi-* externos.
**Approval:** [gate: file-approval — usuario aprobó con "dale" 2026-09-29; constraint añadida: cero duplicación de declaraciones]
**Period:** Q3 2026
**Owner:** orchestrator

## Problem Statement

../deu vive fuera del monorepo pi: launcher `index.ts`, `lib/`, `deu-core`, `deu-mcp`, `deu-tui` (15 ficheros, 4224 líneas), 14 skills frame-ship, `prompts/deu-check.md`, `SYSTEM.md` + `APPEND_SYSTEM.md`, decisiones 0002/0003 y brief de rebranding total. pi ya hizo rebrand parcial (commit 674cd6e: `piConfig { name: deu, configDir: .deu }`, `bin { deu }`, env `DEU_*` con fallback `PI_*`), pero el agente autocontenido no está vendorizado aquí. Resultado: doble fuente de verdad y rebranding incompleto.

## Desired Outcome

`packages/deu` existe en este repo con el contenido completo de ../deu, construible como workspace, sin duplicar `bin deu` ni `configDir .deu`, sin renombrar `pi-*` externo, y con la cadena de calidad verde. Un solo lugar manda para el agente deu.

## Objectives

### Objective 1: deu vendorizado completo y construible

| Key Result | Baseline | Target | Measurement |
|------------|----------|--------|-------------|
| KR-1.1 | ../deu fuera del repo | packages/deu con index, lib, extensions (core, mcp, deu-tui 15 ficheros), skills (14), prompts, SYSTEM/APPEND, docs | `ls packages/deu` + `npm run check` scope deu verde |
| KR-1.2 | bundleDependencies sueltas en ../deu | deps resueltas como workspace sin duplicar pi-* externo | `npm install --ignore-scripts` + shrinkwrap check verde |

### Objective 2: rebranding total sin regresión

| Key Result | Baseline | Target | Measurement |
|------------|----------|--------|-------------|
| KR-2.1 | doble bin/configDir potencial | un solo `bin deu`, un solo `configDir .deu`, semilla SYSTEM/APPEND según decisión 0003 | grep bin/piConfig + arranque `deu config` |
| KR-2.2 | restos "Pi agent / Muse Spark" posibles | cero visibles propios; `pi-*` solo como dependencia técnica invisible | inventario de restos §3 del brief en cero |

### Objective 3: calidad y seguridad bloqueantes en verde

| Key Result | Baseline | Target | Measurement |
|------------|----------|--------|-------------|
| KR-3.1 | sin suite atada al move | `typecheck` + suite relevante verde, `skeptic` previo a QA | logs de verificación en HANDOFF |
| KR-3.2 | guard deu-core + MCP externas sin checklist | threat checklist pass/pass-with-conditions para bash destructivo y URLs context7/parallel | reporte check-security |

## Scope

### In Scope

- Copia completa: `index.ts`, `lib/`, `extensions/deu-core.ts`, `extensions/deu-mcp.ts`, `extensions/deu-tui/*`, `skills/*`, `prompts/*`, `SYSTEM.md`, `APPEND_SYSTEM.md` [engineering]
- Manifiesto `packages/deu/package.json`: bloque `pi`, `piConfig`, `bin`, `files[]` sin fantasmas [engineering]
- Decisiones y brief: `docs/specs/decisions/` + brief rebranding como referencia [engineering]
- Guard destructivo y registro MCP bajo checklist [security]
- Workspace, scripts, SBOM/shrinkwrap y gates de pipeline [automation/ops]

### Out of Scope

- Renombrar `pi-*` externo, imports `@earendil-works/pi-*`, `.agents/skills/pi-agent/**`
- Reescribir prompts del router o agentes C-level más allá de la línea de identidad
- Temas propios nuevos (si no hay tema, des-declarar `themes/`)
- Cambios en `packages/coding-agent/src/core/resource-loader.ts` (PROPOSAL DESIGN.md va por su propio ciclo)

## Stakeholders

| Role    | Agent                                    | Involvement        |
| ------- | ---------------------------------------- | ------------------ |
| Sponsor | orchestrator                             | Decision authority |
| Owner   | engineering                              | Delivery ownership |
| Touched | security, automation/ops                 | Review / sign-off  |

## Constraints

- Budget: sin rango declarado; validar con finance solo si el move añade deps con costo
- Timeline: sin fecha; factibilidad la confirma engineering al especular
- Regulatory: sin PII nueva; `check-security` obligatorio por bash guard + MCP externas
- Brand/GTM: deu total visible; `Pi` solo como dependencia técnica invisible
- People/change: single-primary-owner en build; sin tercer retry (2 retries → escala)
- Sin duplicación (aprobación 2026-09-29, punto): `bin deu`, `piConfig { name, configDir }`, bloque `pi` y semilla SYSTEM/APPEND se declaran una sola vez; packages/deu reutiliza o redirige, nunca duplica

## Open Questions

- [ ] Nombre del workspace: `packages/deu` vs `packages/deu-agent` [engineering]
- [ ] `bin deu` convive con `packages/coding-agent/bin deu`: ¿un bin redirige al otro o solo uno publica? [engineering]
- [ ] `deu-tui` vs `packages/tui`: ¿pin de versión o adaptación de imports `@earendil-works/pi-*`? [engineering]
- [ ] `bundleDependencies` de ../deu: ¿se conservan o las absorbe el workspace + shrinkwrap? [automation/ops]
