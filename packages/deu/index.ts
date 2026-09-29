#!/usr/bin/env node
/**
 * deu — lanzador `deu` sobre el runtime Pi.
 *
 * - Config home: `DEU_CODING_AGENT_DIR` → `~/.deu/agent` (acepta legacy `PI_CODING_AGENT_DIR`)
 *   (solo si el usuario no lo fijó ya; se respeta override explícito).
 * - Todo lo demás (argv, stdio, env, exit code) se hereda tal cual.
 *
 * Sintaxis TypeScript borrable a propósito: corre con `node index.ts`
 * en Node ≥23.6 (strip-types por defecto) y vía jiti sin compilar.
 * En Node 22 requiere `NODE_OPTIONS=--experimental-strip-types`.
 */

import { mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { argv, env, execPath, exit } from "node:process";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { delimiter } from "node:path";

/**
 * Localiza `pi-launcher.js` (trampolín JS del binario `pi`) barriendo PATH.
 * Ejecutarlo con el node actual evita shell, DEP0190 y problemas de
 * quoting en todos los sistemas operativos.
 */
function findPiLauncher(): string | undefined {
  const pathEnv = env["PATH"] ?? env["Path"] ?? "";
  for (const dir of pathEnv.split(delimiter)) {
    if (dir.length === 0) continue;
    const candidate = join(dir, "pi-launcher.js");
    try {
      if (existsSync(candidate)) return candidate;
    } catch {
      // dir ilegible: se ignora y se sigue barriendo
    }
  }
  return undefined;
}

function agentDir(): string {
  const over = env["DEU_CODING_AGENT_DIR"] ?? env["PI_CODING_AGENT_DIR"];
  if (over !== undefined && over.length > 0) return over;
  const dir = join(homedir(), ".deu", "agent");
  mkdirSync(dir, { recursive: true });
  return dir;
}

function main(): void {
  const launcher = findPiLauncher();
  const child =
    launcher !== undefined
      ? spawn(execPath, [launcher, ...argv.slice(2)], {
          stdio: "inherit",
          env: { ...env, PI_CODING_AGENT_DIR: agentDir() },
        })
      : // Fallback: `pi` en PATH (puede emitir DEP0190 en win32, inofensivo).
        spawn("pi", argv.slice(2), {
          stdio: "inherit",
          shell: true,
          env: { ...env, PI_CODING_AGENT_DIR: agentDir() },
        });
  child.on("error", (err) => {
    console.error(`deu: no se pudo lanzar el runtime (${err.message})`);
    exit(1);
  });
  child.on("exit", (code, signal) => {
    if (signal !== null) {
      try {
        process.kill(process.pid, signal);
      } catch {
        exit(1);
      }
      return;
    }
    exit(code ?? 0);
  });
}

main();
