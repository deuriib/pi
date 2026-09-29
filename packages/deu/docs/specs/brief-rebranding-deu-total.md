# BRIEF — Rebranding total pi → deu (CEO-owned)

- Fecha: 2026-09-29
- Dueño BRIEF: CEO. Dueño SPEC/proposal/HANDOFF: `vasquez` (CTO).
- Estado: congelado para dispatch único a `vasquez`.

## 1. Intención estratégica

Cerrar el rebranding a **deu total**: todo lo visible y todo el código propio dice
`deu`. `Pi` queda solo como dependencia técnica invisible (`node_modules/pi-*`,
imports `@earendil-works/pi-*`, `.agents/skills/pi-agent` como docs vendor).
Nada visible dice "Pi agent", "Muse Spark" ni "deu-pi-agent".

## 2. Alcance congelado (decisión usuario 2026-09-29)

- Nombre final: **deu total (recomendado)**.
- Profundidad: **visible + código propio** (no profundo total, no solo visible).
- Externos: **dejar `pi-*` externo** — `dependencies`, `peerDependencies`,
  `bundleDependencies`, imports y `.agents/skills/pi-agent/**` NO se renombran.
- Cierre: **verificación primero según skill `pi-agent`** antes de cambiar.

## 3. Verificación previa exigida (skill pi-agent, ya leída por CEO)

Referencias aplicadas: `references/packages.md`, `references/development.md`
(Forking and Rebranding: `piConfig.name`, `configDir`, `bin`), `references/themes.md`,
`references/prompt-templates.md`, `references/overview.md`.

El C-level debe verificar y reportar ANTES de mutar:

1. Manifiesto `package.json`: bloque `pi` (solo claves válidas
   `extensions/skills/prompts/themes`), `piConfig { name: "deu", configDir: ".deu" }`,
   `bin { deu }`, `files[]` sin fantasma (`themes/` declarado pero inexistente).
2. Inventario de restos visibles: `README.md` ("deu-pi-agent v0 — Pi agent"),
   `description`, `lib/pkg-meta.ts` fallback `"deu-pi-agent"`, identidad en
   `SYSTEM.md` (sin nombre deu — el asistente aún se presenta como Muse Spark/pi),
   `extensions/deu-tui/*` (header/mensajes visibles), `index.ts` (mensajes + comentario
   engines/strip-types), `skills/deu-check`, `prompts/deu-check.md`, `agents/*.md`.
3. Confirmar qué NO se toca: `node_modules/pi-*`, `@earendil-works/pi-*`,
   `.agents/skills/pi-agent/**`.

## 4. Trabajo ordenado (single-primary-owner: vasquez)

1. Verificación previa (lista §3) → SPEC breve + propuesta.
2. Mutación mínima reversible: README, `description`, fallback `pkg-meta`,
   identidad deu en SYSTEM (una línea, sin romper router CEO), header/mensajes
   `deu-tui`, mensajes `index.ts`, `themes/` (crear o des-declarar — default:
   des-declarar si no hay tema propio), `.deu/` local si aplica.
3. Calidad: `npm run typecheck` (suite verde, blocking). Adverso `skeptic` antes de QA.
4. HANDOFF con evidencia por referencia + decisión/ADR si cambia contrato
   (`docs/specs/decisions/`).

## 5. Non-goals explícitos

- No renombrar paquetes externos `pi-*` ni imports.
- No tocar `.agents/skills/pi-agent/**` (docs vendor).
- No reescribir prompts del router CEO ni agentes C-level más allá de la línea de identidad.
- No tercer retry: gate FAIL tras 2 retries escala aquí, nunca sideways.

## 6. Paquete de dispatch (solo referencia)

- Spec ref: este BRIEF + `docs/specs/decisions/0002-deu-system-prompt-autocontenido.md`.
- Constraints: §2 + §5. Skill obligatoria: `pi-agent` (packages/development).
- Reviewers exigidos: gate propio CTO + `run-the-tests` verde + `skeptic` previo a QA.
