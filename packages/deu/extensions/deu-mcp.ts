import { registerMcpServer } from "pi-mcp-adapter";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { packageRoot } from "../lib/index.ts";

function registerMcps(pi: ExtensionAPI) {
  registerMcpServer({
    pi,
    name: "context7",
    definition: {
      url: "https://mcp.context7.com/mcp",
      directTools: true,
      protocolVersion: "auto",
    },
  });

  registerMcpServer({
    pi,
    name: "parallel-search",
    definition: {
      url: "https://search.parallel.ai/mcp",
      directTools: true,
      protocolVersion: "auto",
    },
  });
}

function isMissingAdapter(err: unknown): boolean {
  return err instanceof Error && err.message.includes("not installed for this Pi instance");
}

async function installAdapter(pi: ExtensionAPI): Promise<void> {
  // El bloque `pi` declara el adapter como extensión, pero en instancias donde
  // esa entrada no resuelve (p. ej. package instalado sin su node_modules)
  // nos auto-instalamos: la default export es la extensión del adapter.
  const { default: installMcpAdapter } = await import("pi-mcp-adapter");
  installMcpAdapter(pi);
}

export default function (pi: ExtensionAPI) {
  const root = packageRoot(import.meta.url);

  pi.on("session_start", async (_event, ctx) => {
    try {
      try {
        registerMcps(pi);
      } catch (err) {
        if (!isMissingAdapter(err)) throw err;
        await installAdapter(pi);
        registerMcps(pi);
      }
    } catch (err) {
      if (ctx.hasUI) {
        ctx.ui.notify(
          `deu-mcp: no se pudo registrar MCP (${err instanceof Error ? err.message : String(err)})`,
          "warning",
        );
      }
    }
  });
}
