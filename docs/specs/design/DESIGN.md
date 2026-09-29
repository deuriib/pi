# Architecture Contract: vendor deu

**Owner:** engineering
**Version:** v1
**Last Updated:** 2026-09-29
**Domains-Touched:** [engineering, security, automation/ops]

## Overview

../deu se vendoriza como workspace `packages/deu` del monorepo pi. Un solo `bin deu` publica, un solo `configDir .deu` manda, la semilla SYSTEM/APPEND viaja en `files[]` y el runtime lee solo desde configDir. `pi-*` externo queda intacto.

## Components

| Component | Responsibility | Interface |
|-----------|---------------|-----------|
| launcher `index.ts` | lanzar runtime pi con `DEU_CODING_AGENT_DIR` (fallback `PI_*`) | `spawn pi-launcher.js` o `pi` en PATH; respeta override |
| `lib/pkg-meta` | meta `{ name, version }` + root del package | `getPackageMeta(import.meta.url)`, `packageRoot(url)`; fallback `deu/0.0.0` |
| `deu-core` | guard destructivo en `tool_call` | bloquea `rm -rf /`, `rm -rf ~`, `--no-preserve-root`, `mkfs.`, `diskpart`, `format c:`; confirm UI o bloqueo |
| `deu-mcp` | registro MCP context7 + parallel-search | `registerMcpServer` vía `pi-mcp-adapter`; best-effort con notify |
| `deu-tui` | UI terminal vendorizada (15 ficheros) | imports `@earendil-works/pi-*`; header/footer/config/git/runtime/telemetry |
| `skills/ + prompts/` | chain frame-ship (14 skills) + diagnóstico | descubiertos vía bloque `pi.skills/prompts` |
| semilla SYSTEM/APPEND | fuente del prompt que se copia al configDir | runtime lee `<cwd>/.deu/` si trusted, si no `~/.deu/agent/` |
| manifiesto | declara `pi`, `piConfig`, `bin`, `files[]` una sola vez | `piConfig { name: deu, configDir: .deu }` |

## Data Flow

Instalación copia semilla al configDir; arranque resuelve agentDir y descubre SYSTEM/APPEND; sesión carga extensiones por bloque `pi`; `tool_call` pasa por guard; `session_start` registra MCPs; TUI instala header/footer vía `deu-tui`.

## Invariants

- INV-001: un solo `bin deu` efectivo; el otro redirige o no publica
- INV-002: un solo `configDir .deu`; un solo lector (runtime, decisión 0003)
- INV-003: bloque `pi` solo con claves `extensions/skills/prompts/themes`; `files[]` sin fantasmas
- INV-004: cero renombres de `pi-*` externo, imports `@earendil-works/pi-*`, `.agents/skills/pi-agent/**`
- INV-005: deu-tui no diverge de `packages/tui` sin ADR
- INV-006: sin secretos/PII en código, logs o prompts; vault/env únicamente

## Non-Functional Requirements

- Performance: arranque sin regresión perceptible; suite unitaria <30s
- Availability: rollback por revert de un commit; sin migración
- Security: threat checklist en guard + MCP; postura a confirmar por security

## The 4-line note

Una línea: `SPEC:<file>#<section> / HARD:<rules> / GATE:<verdict> / DOMAINS:[<list>]`. `anchors = req-id *( "," req-id )`. Sin REQ-ID aún, la nota va sin ancla; con REQs, lleva `#REQ-001,...`. `HARD` incluye siempre `subagents` más constraints. `GATE` es el veredicto vigente. `DOMAINS` es la lista tocada.
