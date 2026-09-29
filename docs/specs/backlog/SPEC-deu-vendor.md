# Spec: Vendor completo de deu como packages/deu

**ID:** SPEC-deu-vendor (filename: `SPEC-deu-vendor.md` in `docs/specs/backlog/`)
**Owner:** engineering
**Domains-Touched:** [engineering, security, automation/ops]
**Brief Reference:** GOAL-deu-vendor
**Status:** draft
**Priority:** P0
**Execution_Mode:** subagents (inherited from brief, frozen at agree-the-goal)

## 1. Context

Cerrar el rebranding deu total vendorizando ../deu completo (incluye deu-tui) como workspace `packages/deu`, sin duplicar `bin deu`, `piConfig`, bloque `pi` ni semilla SYSTEM/APPEND. pi ya tiene rebrand parcial (674cd6e); falta la fuente única del agente.

## 2. Requirements

- REQ-001: packages/deu contiene index.ts, lib/, extensions/deu-core.ts, extensions/deu-mcp.ts, extensions/deu-tui/* (15 ficheros), skills/* (14), prompts/*, SYSTEM.md, APPEND_SYSTEM.md
- REQ-002: cero duplicación: `bin deu`, `piConfig { name, configDir }`, bloque `pi`, semilla SYSTEM/APPEND declarados una sola vez; packages/deu reutiliza o redirige, nunca duplica
- REQ-003: manifiesto packages/deu/package.json válido: bloque `pi` solo con claves `extensions/skills/prompts/themes`, `piConfig { name: deu, configDir: .deu }`, `files[]` sin fantasmas, sin renombrar `pi-*` externo
- REQ-004: deu-tui intacto (byte a byte salvo imports) y resolviendo `@earendil-works/pi-*` del monorepo
- REQ-005: guard deu-core (bash destructivo) y registro MCP (context7, parallel-search) con threat checklist pass/pass-with-conditions
- REQ-006: `npm run check` scope deu y suite relevante verdes, `skeptic` previo a QA

## 3. Acceptance Criteria

- [ ] AC-001: `ls packages/deu` muestra index, lib, extensions, skills, prompts, SYSTEM, APPEND + decisiones/brief referenciados; evidencia: árbol en HANDOFF
- [ ] AC-002: grep de `bin deu` / `piConfig` / `configDir` prueba declaración única efectiva; evidencia: salida grep en HANDOFF
- [ ] AC-003: manifiesto valida claves `pi` y `files[]` existentes; evidencia: script de verificación en HANDOFF
- [ ] AC-004: diff deu-tui vs ../deu muestra solo ajustes de import; evidencia: `git diff --stat` en HANDOFF
- [ ] AC-005: reporte check-security pass o pass-with-conditions archivado; evidencia: path del reporte
- [ ] AC-006: check + tests verdes; evidencia: logs en HANDOFF

## 4. Contracts & Interfaces

- Layout: `packages/deu/{index.ts,lib/,extensions/{deu-core.ts,deu-mcp.ts,deu-tui/},skills/,prompts/,SYSTEM.md,APPEND_SYSTEM.md,package.json}`
- Regla única: un solo `bin deu` publica; el otro redirige o se elimina. Un solo `configDir .deu`. Semilla SYSTEM/APPEND viaja en `files[]`; runtime lee solo desde configDir (decisión 0003)
- Launcher resuelve `DEU_CODING_AGENT_DIR` con fallback `PI_CODING_AGENT_DIR`; respeta override explícito
- `deu-core` bloquea bash destructivo (`rm -rf /`, `rm -rf ~`, `--no-preserve-root`, `mkfs.`, `diskpart`, `format c:`) con confirmación UI o bloqueo sin UI
- `deu-mcp` registra context7 + parallel-search vía `pi-mcp-adapter`, best-effort con aviso UI
- Ver contrato arquitectónico: `docs/specs/design/DESIGN.md`

## 5. Out of Scope

- Renombrar `pi-*` externo, imports `@earendil-works/pi-*`, `.agents/skills/pi-agent/**`
- Reescribir router o agentes C-level más allá de la línea de identidad
- Temas propios nuevos; si no hay tema, des-declarar `themes/`
- Cambios en `resource-loader.ts` (ciclo PROPOSAL DESIGN.md separado)

## 6. Dependencies

- Commit 674cd6e (rebrand parcial coding-agent)
- Decisión 0003 (system prompt desde configDir, supera 0002)
- Brief `../deu/docs/specs/brief-rebranding-deu-total.md` (referencia, no se copia entero)
- Toolchain: `npm install --ignore-scripts`, `npm run check`, shrinkwrap checks

## 7. Traceability

| Requirement | Acceptance Criterion | Proposed Change | Evidence |
|-------------|---------------------|-----------------|----------|
| REQ-001 | AC-001 | PROPOSAL.md | árbol packages/deu en HANDOFF |
| REQ-002 | AC-002 | PROPOSAL.md | salida grep declaración única |
| REQ-003 | AC-003 | PROPOSAL.md | verificación manifiesto |
| REQ-004 | AC-004 | PROPOSAL.md | git diff --stat deu-tui |
| REQ-005 | AC-005 | PROPOSAL.md + check-security | reporte threat checklist |
| REQ-006 | AC-006 | PROPOSAL.md | logs check + tests + skeptic |
