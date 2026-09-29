import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

import { getPackageMeta, packageRoot } from "../lib/index.ts";

// Fuente única: package.json
const { name: PKG_NAME, version: PKG_VERSION } = getPackageMeta(
  import.meta.url,
);

// Lista cerrada mínima (security-review S-002): no exhaustiva, piso fijado por T-005a.
const DESTRUCTIVE_PATTERNS = [
  "rm -rf /",
  "rm -rf ~",
  "--no-preserve-root",
  "mkfs.",
  "diskpart",
  "format c:",
];

function isDestructive(command: string): boolean {
  const lower = command.toLowerCase();
  return DESTRUCTIVE_PATTERNS.some((pattern) => lower.includes(pattern));
}

function readCommand(event: unknown): string | undefined {
  if (typeof event !== "object" || event === null) return undefined;
  const input = (event as { input?: unknown }).input;
  if (typeof input !== "object" || input === null) return undefined;
  const command = (input as { command?: unknown }).command;
  return typeof command === "string" ? command : undefined;
}

export default function (pi: ExtensionAPI) {
  const root = packageRoot(import.meta.url);
  void root;
  void PKG_NAME;
  void PKG_VERSION;
  pi.on("tool_call", async (event, ctx) => {
    if (event.toolName !== "bash") return undefined;
    const command = readCommand(event);
    if (command === undefined) return undefined;
    if (!isDestructive(command)) return undefined;
    if (!ctx.hasUI) {
      return {
        block: true,
        reason: "Bloqueado por deu-core: comando destructivo sin UI para confirmar",
      };
    }
    const confirmed = await ctx.ui.confirm("deu guard", command);
    if (confirmed) return undefined;
    return {
      block: true,
      reason: "Bloqueado por deu-core: comando destructivo no confirmado",
    };
  });
}
