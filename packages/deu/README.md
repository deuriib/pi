# deu — agente autocontenido

Agente `deu`: system prompt autocontenido que el runtime descubre desde el configDir. Fuente: `SYSTEM.md` + `APPEND_SYSTEM.md`.

## Estructura

- `package.json` — bloque `pi` (`extensions/skills/prompts` → `./extensions`, `./skills`, `./prompts`, más `node_modules/` bundleados). Sin claves `pi.system_prompt`: el runtime no las lee. Los paths propios viven en el bloque `piConfig` (`name: deu`, `configDir: .deu`).
- `skills/` — el chain frame-ship de nueve pasos (`start-here`, `agree-the-goal`, …, `release`) más el diagnóstico `deu-check`.
- `SYSTEM.md` + `APPEND_SYSTEM.md` — fuente del system prompt. Viajan con `npm:deu` como semilla; **los carga el runtime desde el configDir**, no desde la raíz del package.
- El configDir manda: `<proyecto>/.deu/SYSTEM.md` si el proyecto está trusted, si no `~/.deu/agent/SYSTEM.md` (igual para `APPEND_SYSTEM.md`). No hay loader propio — copiar un `.md` nuevo exige recargar.
- `extensions/deu-core.ts` — guard destructivo en `tool_call`: bloquea bash destructivo antes de ejecutarlo. Ya no inyecta prompt ni registra comandos.
- `docs/specs/decisions/0003-system-prompt-desde-configdir.md` — por qué el prompt vive en el configDir y no en la extensión (supera al 0002).

## Workspace (monorepo pi)

Este package vive como `packages/deu` del monorepo. Regla única: el `bin deu` lo publica `@earendil-works/pi-coding-agent`; este manifiesto no declara `bin` para no duplicarlo. `piConfig` reutiliza los mismos valores (`name: deu`, `configDir: .deu`). Dependencias externas pineadas exactas (gate `check:pinned-deps`); sin `bundleDependencies` (las absorbe el workspace).

## Uso

```bash
npm install            # dev local
# dentro del repo: /trust (una vez) + /reload → auto-instala los project packages
deu config             # deu-core + todo + memory deben aparecer enabled
```

En sesión: `/deu-check` (o `/skill:deu-check`) diagnóstico, `todo({action:"list"})`, `memory_status`.
