# Implementation Plan: SPEC-deu-vendor

**Agent:** engineering
**Date:** 2026-09-29
**Approved By:** usuario ("aprobado" propuesta 2026-09-29) + security Conditional + architecture Conditional (DECISION-001 proposed)
**Domains-Touched:** [engineering, security, automation/ops]

## Steps

| Step | Description | Target / Files | Evidence Location | Est. Effort |
|------|-------------|----------------|-------------------|-------------|
| 1 | Scaffold + copia byte a byte (sin node_modules, .git, .agents, package-lock): index.ts, lib/, extensions/, skills/, prompts/, SYSTEM.md, APPEND_SYSTEM.md, README.md, tsconfig.json, skills-lock.json, docs ref (brief + 0002 + 0003) | `packages/deu/` | E-001 árbol | 0.5h |
| 2 | Adaptar manifiesto: sin `bin` (publica coding-agent), `piConfig` idéntico reutilizado, bloque `pi` solo con claves válidas, `files[]` verificado, externas pineadas exactas, fuera `bundleDependencies` y lock copiado | `packages/deu/package.json` | T-003 + E-002 | 0.5h |
| 3 | Convertir imports relativos `.js` → `.ts` (gate `check:ts-imports` repo-wide) | `packages/deu/**/*.ts` | E-004 diffstat + `node scripts/check-ts-relative-imports.mjs` | 0.5h |
| 4 | Tests T-003 (manifiesto) y T-005a (guard) + ejecución | `packages/deu/test/*.test.ts` | TESTS.md + logs | 1h |
| 5 | Evidencias E-002/E-004/E-005b/E-006 + gates (pinned-deps, ts-imports, tsc local deu) | `docs/specs/work/engineering/evidence/` | TESTS.md | 1h |
| 6 | Deps locales: promover `@earendil-works/*` a `dependencies`, pineado compatible con `min-release-age=2`, `npm install --ignore-scripts`, prueba de resolución + re-test completo | `packages/deu/package.json` | E-007 + TESTS.md | 1h |

Cada paso = un commit planificado (no se commitea por regla del repo: sin commit sin pedido explícito).

## Order of Operations

Scaffold → manifiesto → imports → tests → evidencias. El manifiesto fija la regla única antes de verificar; los tests corren sobre los archivos finales. Sin worktree aislado: un solo lane secuencial en el mismo hilo (degradación permitida por el skill), sin tocar `packages/coding-agent` ni el diff preexistente de `resource-loader.ts`.

## Rollback Points

Cada paso revierte borrando `packages/deu` (sin migración, sin config externa). Punto seguro tras cada paso: `git status` muestra solo añadidos bajo `packages/deu/` + docs.

## Quality Gates

- [ ] Engineering: tests T-003/T-005a verdes; `tsc --noEmit` local deu verde; `check:pinned-deps` + `check:ts-imports` verdes (tsgo root no cubre el lane: fuera de su `include`, justificado en E-006)
- [ ] Finance: N/A (sin costo)
- [ ] Legal: N/A
- [ ] Marketing: N/A (rebrand ya decidido en GOAL)
- [ ] People: N/A
- [ ] Revenue: N/A
- [ ] Automation/ops: lockfile raíz pendiente de `npm install --ignore-scripts` al commitear (no se commitea aquí); shrinkwrap/install-lock son scope coding-agent, no afectados
