import assert from "node:assert/strict";
import { describe, it } from "node:test";
import registerGuard from "../extensions/deu-core.ts";

type Handler = (event: unknown, ctx: unknown) => Promise<unknown>;
let handler: Handler | undefined;
const fakePi = {
	on(_name: string, cb: Handler) {
		handler = cb;
	},
};
registerGuard(fakePi as never);
assert.ok(handler, "deu-core registra handler tool_call");

const noUI = { hasUI: false };
const uiAllow = { hasUI: true, ui: { confirm: async () => true } };
const uiDeny = { hasUI: true, ui: { confirm: async () => false } };

describe("T-005a guard deu-core (REQ-005)", () => {
	for (const cmd of [
		"rm -rf /",
		"rm -rf ~",
		"mkfs.ext4 /dev/sda",
		"diskpart",
		"format c:",
		"tar --no-preserve-root -xf a.tar",
	]) {
		it(`bloquea sin UI: ${cmd}`, async () => {
			const res = await handler!({ toolName: "bash", input: { command: cmd } }, noUI);
			assert.deepEqual(res, {
				block: true,
				reason: "Bloqueado por deu-core: comando destructivo sin UI para confirmar",
			});
		});
	}

	it("permite comando inocuo", async () => {
		assert.equal(await handler!({ toolName: "bash", input: { command: "ls -la" } }, noUI), undefined);
		assert.equal(await handler!({ toolName: "user_bash", input: { command: "echo hola" } }, noUI), undefined);
	});

	it("con UI respeta la confirmación", async () => {
		assert.equal(await handler!({ toolName: "bash", input: { command: "rm -rf /" } }, uiAllow), undefined);
		const denied = await handler!({ toolName: "bash", input: { command: "rm -rf /" } }, uiDeny);
		assert.deepEqual(denied, { block: true, reason: "Bloqueado por deu-core: comando destructivo no confirmado" });
	});

	it("ignora comandos no string", async () => {
		assert.equal(await handler!({ toolName: "bash", input: {} }, noUI), undefined);
	});
});
