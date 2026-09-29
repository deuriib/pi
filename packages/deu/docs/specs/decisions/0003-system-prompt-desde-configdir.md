# 0003 — System prompt desde el configDir (supera al 0002)

- Fecha: 2026-09-29
- Estado: aceptado — supersedes 0002
- Contexto: la opción B del 0002 (inyección vía extensión) exigía un loader propio (`lib/system-prompts.ts`) y un handler `before_agent_start` en `deu-core.ts`. Ambos se retiraron en `24c090f`, junto con las claves `pi.system_prompt` / `pi.append_system_prompt` del manifiesto. Quedó un solo lector posible: el del runtime.
- Opciones: (A) descubrimiento nativo desde el configDir. (B) mantener la inyección por extensión. (C) convivencia de ambas.
- Decisión: opción A. `ResourceLoader.discoverSystemPromptFile()` y `discoverAppendSystemPromptFile()` resuelven `<cwd>/<configDir>/SYSTEM.md` cuando el proyecto está trusted, y si no `<agentDir>/SYSTEM.md` — es decir `.deu/` en el proyecto o `~/.deu/agent/`. Igual para `APPEND_SYSTEM.md`.
- Por qué no (C): reintroduce justamente la doble carga que el 0002 quería evitar. Con la extensión fuera del juego solo hay un lector y no hay pisa-que-otro.
- Consecuencias:
  - La raíz del package deja de ser la fuente en runtime. `files[]` conserva `SYSTEM.md` + `APPEND_SYSTEM.md` como semilla que se copia al configDir, no como entrada de carga.
  - Copiar un `.md` nuevo al configDir no surte efecto hasta recargar.
  - `deu-core.ts` queda únicamente con el guard destructivo de `tool_call`; caen los comandos `/deu` y `/deu-config`.
  - `lib/system-prompts.ts` eliminado junto con sus re-exports en `lib/index.ts`.
- Verificación: `~/.deu/agent/APPEND_SYSTEM.md` byte a byte igual al del repo, y su contenido frame-ship aparece en el system prompt de la sesión viva.
- Resuelto 2026-09-29: `~/.deu/agent/SYSTEM.md` sincronizado con el repo, byte a byte. Copia previa en `~/.deu/agent/SYSTEM.md.bak-20260929-072007`. El cambio de identidad surte efecto al recargar la sesión — la sesión que ejecutó la copia seguía corriendo con el prompt anterior, como es esperado de un system prompt ya cargado.
