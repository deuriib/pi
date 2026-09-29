---
name: deu-check
description: Verifica que el agente deu esté activo (system prompt + todo + memory) y reporta qué falta.
---

# deu-check

Úsalo cuando el usuario pregunte si deu está activo, o al inicio de una sesión para validar el paquete autocontenido.

## Pasos

1. Pide al modelo que repita el credo deu en una línea para confirmar el system prompt que el runtime cargó desde el configDir — `<proyecto>/.deu/` si el proyecto está trusted, si no `~/.deu/agent/` (fuente: `SYSTEM.md` + `APPEND_SYSTEM.md`). Si el credo no coincide con el del repo, el configDir está desfasado: copiar y recargar.
2. Reporta en 5 líneas: system, todo, memory, modo, siguiente acción. Sin azúcar: si algo falta, se dice con severidad y path out.
