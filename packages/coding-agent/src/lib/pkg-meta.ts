import { readFileSync } from "node:fs";
import { findPackageJSON } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export interface PackageMeta {
  name: string;
  version: string;
}

// Fallback si package.json no se puede leer — la extensión debe cargar igual.
const FALLBACK: PackageMeta = { name: "deu", version: "0.0.0" };

let cached: PackageMeta | undefined;

/**
 * Lee { name, version } del package.json del paquete.
 *
 * @param callerUrl - pasar `import.meta.url` del archivo que llama.
 */
export function getPackageMeta(callerUrl: string): PackageMeta {
  if (cached) return cached;
  try {
    const pkgPath = findPackageJSON(".", callerUrl);
    if (pkgPath) {
      const parsed: unknown = JSON.parse(readFileSync(pkgPath, "utf8"));
      if (typeof parsed === "object" && parsed !== null) {
        const rec = parsed as Record<string, unknown>;
        const name =
          typeof rec.name === "string" && rec.name.length > 0
            ? rec.name
            : FALLBACK.name;
        const version =
          typeof rec.version === "string" && rec.version.length > 0
            ? rec.version
            : FALLBACK.version;
        cached = { name, version };
        return cached;
      }
    }
  } catch {
    // best-effort: cae al fallback sin romper la carga de la extensión.
  }
  cached = { ...FALLBACK };
  return cached;
}

export function packageRoot(fromUrl: string): string {
  try {
    const pkgPath = findPackageJSON(".", fromUrl);
    if (pkgPath) return dirname(pkgPath);
  } catch {
    // best-effort: cae al fallback de un nivel
  }
  return resolve(dirname(fileURLToPath(fromUrl)), "..");
}
