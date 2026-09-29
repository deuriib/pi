# Test / Evidence Matrix: SPEC-deu-vendor

**Agent:** engineering
**Date:** 2026-09-29
**Domains-Touched:** [engineering, security, automation/ops]

| REQ-ID | Evidence ID | Description | Type | Status | Commit |
|--------|-------------|-------------|------|--------|--------|
| REQ-001 | E-001 | Árbol packages/deu: 99 ficheros (index, lib, core, mcp, deu-tui 15, skills 14+refs, prompts, SYSTEM/APPEND, docs ref) | Attestation | pass | pendiente (sin commit sin pedido) |
| REQ-002 | E-002 | Un `bin deu` (coding-agent); `piConfig` idéntico reutilizado; `packages/deu` sin `bin` | Attestation | pass | pendiente |
| REQ-003 | T-003 | `packages/deu/test/manifest.test.ts`: claves pi, piConfig, bin parity, files[], pin exacto, semilla (6 casos) | Unit | pass 6/6 | pendiente |
| REQ-004 | E-004 | Diff vs ../deu: solo imports `.js`→`.ts`; package.json/README adaptados; fuera lock/.git* (root manda); nuevo `test/` | Attestation | pass | pendiente |
| REQ-005 | T-005a | `packages/deu/test/deu-core-guard.test.ts`: 6 patrones bloqueados, inocuo permitido, UI respetada, no-string ignorado (9 casos) | Unit/Security | pass 9/9 | pendiente |
| REQ-005 | E-005b | Allowlist MCP congelada (2 URLs), cero secretos (grep limpio), checklist archivado | Attestation | pass | pendiente |
| REQ-005 | E-011 | Warning global reproducido pre-fix; auto-reparo (instala adapter + reintenta) deja notifications en [] y handler limpio | Attestation | pass | pendiente |
| REQ-006 | E-006 | `check:pinned-deps` OK, `check:ts-imports` OK, `node --check` 22/22, tests 15/15 | Attestation | pass | pendiente |
| REQ-003/REQ-004 | E-007 | `@earendil-works/pi-{ai,coding-agent,tui}` resuelven a `packages/*/dist` local; `deu-tui`+`deu-core`+`lib` importan OK; `pkg-meta` deu/0.1.0 | Attestation | pass | pendiente |
| REQ-001/REQ-004 | E-008 | `npm run build` verde (bundle 56 ficheros); boot `deu` limpio hasta auth gate; `-e` carga deu-core/mcp/tui sin errores (calibración con path roto sí reporta); 15/15 módulos deu-tui importan y funciones puras OK | Attestation | pass | pendiente |
| REQ-003 | E-009 | `npm pack` + install de tarball en prefijo temporal: 11/11 paths `pi` OK, `deu --help` OK, `-e` sin errores; `bin → dist/index.js` (type-stripping prohibido bajo node_modules) | Attestation | pass | pendiente |
| REQ-001/REQ-003 | E-010 | Global real: `npm link --force` reenruta `deu` al launcher; `deu install` registra el package; boot limpio hasta auth gate | Attestation | pass | pendiente |

Types per test-strategy. Ejecución: `node --test packages/deu/test/` → 15 pass, 0 fail.

## Coverage Summary

- Unit coverage: T-003 + T-005a sobre `lib/`, `deu-core`, manifiesto (módulos nuevos con lógica)
- Integration coverage: N/A con justificación (workspace sin instalar: `@earendil-works/*` y `pi-mcp-adapter` resuelven post-`npm install --ignore-scripts` al commitear)
- Evidence coverage: 6/6 REQ-IDs con fichero o test vinculado (+ E-007 refuerzo local-deps para REQ-003/004)
- Acceptance criteria covered: 6/6 (AC-001…AC-006)

## Notas

- tsgo/biome root no cubren el lane (fuera de su `include`): justificado en PLAN.md; a cambio `node --check` 22/22 + ejecución real de `deu-core`/`lib` en tests.
- `npm install --ignore-scripts` + shrinkwrap/install-lock quedan para el momento del commit (lockfile raíz pendiente, declarado en PLAN.md).
- Límites de esta verificación (sin TTY ni API keys en el entorno): render interactivo de la TUI no verificado aquí (sin tmux; winpty reporta `stdin is not a tty`); round-trip de modelo imposible sin provider auth. Pendiente: smoke interactivo en máquina con terminal y `deu list` tras `/trust` del project package.
- Manifiesto final: `bin { deu: ./dist/index.js }`, `dist/` compilado con esbuild + `prepublishOnly`, externas en versiones `min-release-age=2`, `@earendil-works/*` en `dependencies` (enlace local en dev, registry publicado en global).
- Commits planificados uno por REQ (build §8) no ejecutados por regla del repo (sin commit sin pedido explícito).
- Cambio post-aprobación dentro del lane (mismo fichero, mismo REQ-003): `@earendil-works/pi-{ai,coding-agent,tui}` promovidos a `dependencies` (antes dev/peer) para enlace workspace local; 6 externas rebajadas a versiones que cumplen `min-release-age=2` del `.npmrc` (permission 35.0.0, antigravity 0.8.0, mcp-adapter 3.0.0, rewind 1.8.6, subagents 0.72.1, web-access 0.32.0).
- Incidente: un bloque `bin` colado en `packages/deu/package.json` hizo fallar T-003; eliminado, T-003 verde de nuevo. El test cumplió su función.
- Desviación dirigida por usuario (mismo REQ-002, 2026-09-29): `packages/deu` declara `bin { deu: ./index.ts }` en paridad con ../deu y la convención del monorepo (cada package declara el suyo). T-003 ahora fija esa paridad. `.bin/deu` en dev resuelve al bundle de coding-agent sin warnings de npm.
