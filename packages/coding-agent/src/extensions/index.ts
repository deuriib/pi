import type { InlineExtension } from "../core/extensions/types.ts";
import llamaExtension from "./llama/index.ts";
import deuTuiExtension from "./deu-tui/index.ts";

export const builtInExtensions: InlineExtension[] = [
  { name: "llama.cpp", factory: llamaExtension, hidden: true },
  { name: "deu-tui", factory: deuTuiExtension, hidden: true }
];
