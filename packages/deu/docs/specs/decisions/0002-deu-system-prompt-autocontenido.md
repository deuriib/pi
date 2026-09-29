# 0002 — System prompt deu autocontenido vía extensión

- Fecha: 2026-09-29
- Estado: superseded por 0003
- Contexto: `pi.system_prompt` / `pi.append_system_prompt` en `package.json` no son claves válidas del manifiesto Pi (solo `extensions/skills/prompts/themes`). Pi las ignoraba en silencio y `SYSTEM.md` / `APPEND_SYSTEM.md` en raíz nunca cargaban. `deu-core.ts` tenía el handler `before_agent_start` como stub (`return {}`).
- Opciones: (A) archivos en `.deu/SYSTEM.md` (mecanismo nativo por ruta fija). (B) inyección autocontenida desde el package vía `before_agent_start`.
- Decisión: opción B. Fuente única `SYSTEM.md` + `APPEND_SYSTEM.md` en raíz del package. Loader `lib/system-prompts.ts` (utf8, best-effort, missing → `""`). `deu-core.ts` retorna `{ systemPrompt }` en modo replace. Pi lo proyecta al head del request y conserva sections/tools del transcript.
- Composición: `SYSTEM + "\n\n" + APPEND + "\n\n" + customPrompt? + "\n\n" + appendSystemPrompt?`. Partes vacías se omiten. `customPrompt` (`--system-prompt`) y `appendSystemPrompt` (`--append-system-prompt`) siempre como sufijo para no romper CLI.
- No usar `.deu/SYSTEM.md` ni `~/.deu/agent/SYSTEM.md` para evitar doble carga. `AGENTS.md` sigue cargando como `contextFiles` (deseado).
- Consecuencias: `npm:deu` viaja con su prompt a cualquier repo. `/deu` muestra chars y fuentes para diagnóstico. Cambio de contrato documentado aquí según guardrails.
