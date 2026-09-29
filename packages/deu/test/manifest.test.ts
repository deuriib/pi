import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));

describe("T-003 manifest packages/deu (REQ-003)", () => {
	it("bloque pi solo con claves válidas", () => {
		assert.deepEqual(Object.keys(manifest.pi).sort(), ["extensions", "prompts", "skills"]);
	});

	it("piConfig reutiliza deu/.deu", () => {
		assert.deepEqual(manifest.piConfig, { name: "deu", configDir: ".deu" });
	});

	it("bin deu apunta al launcher compilado (Node no despoja tipos bajo node_modules)", () => {
		assert.deepEqual(manifest.bin, { deu: "./dist/index.js" });
	});

	it("files[] sin fantasmas", () => {
		for (const entry of manifest.files) {
			assert.ok(existsSync(join(dir, entry)), `falta ${entry}`);
		}
	});

	it("externas pineadas exactas y sin bundleDependencies", () => {
		const exact = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$/;
		for (const section of ["dependencies", "devDependencies"]) {
			for (const [name, spec] of Object.entries(manifest[section] ?? {})) {
				if (name.startsWith("@earendil-works/pi-")) continue;
				assert.match(String(spec), exact, `${section}.${name}`);
			}
		}
		assert.ok(!("bundleDependencies" in manifest));
	});

	it("semilla SYSTEM/APPEND presente", () => {
		assert.ok(existsSync(join(dir, "SYSTEM.md")));
		assert.ok(existsSync(join(dir, "APPEND_SYSTEM.md")));
	});
});
