# DECISION-001: vendorizar deu como workspace packages/deu con declaración única

**Date:** 2026-09-29
**Deciders:** engineering owner, security owner, automation/ops owner
**Status:** proposed

## Context

El agente deu vive en ../deu fuera del monorepo; pi solo tiene rebrand parcial (674cd6e: `piConfig`, `bin deu`, env `DEU_*`). Traerlo crea un workspace nuevo, una regla de declaración única (`bin`, `piConfig`, bloque `pi`, semilla SYSTEM/APPEND) y adapta `deu-tui` a los imports del monorepo. Referencias externas: decisiones ../deu 0002 (superseded) y 0003 (configDir como único lector, vigente).

## Decision

- `packages/deu` es el hogar único del agente deu en este repo (launcher, lib, deu-core, deu-mcp, deu-tui, skills, prompts, semilla SYSTEM/APPEND, manifiesto).
- Un solo `bin deu` publica; el otro redirige o no publica. Un solo `configDir .deu`. Semilla viaja en `files[]`; el runtime lee solo desde configDir.
- `bundleDependencies` de ../deu las absorbe el workspace + lockfile/shrinkwrap del monorepo; el `package-lock.json` de ../deu no se copia tal cual.
- `deu-tui` se adapta solo en imports `@earendil-works/pi-*`; sin divergencia lógica sin ADR.
- `pi-*` externo, imports y `.agents/skills/pi-agent/**` no se renombran (non-goal congelado).

## Consequences

### Positive

- Fuente única del agente; rebranding total sin mezclar deu-tui con `packages/tui`
- Colisión bin/configDir resuelta por construcción, verificable con grep (E-002)
- CI unificada: un lockfile, unos gates, un rollback por revert

### Negative

- El lane engineering pierde su PROPOSAL anterior (resource-loader DESIGN); ese diff va por su propio ciclo o se revierte
- `packages/deu/package.json` debe mantenerse alineado con `packages/coding-agent` en `piConfig`/`bin` (revisión en cada cambio de cualquiera de los dos)

## Supersedes / Superseded By

- Reutiliza ../deu 0003 (configDir como único lector); no la supersede — la hereda
- Ninguna decisión previa de este repo (primer ADR del lane)
