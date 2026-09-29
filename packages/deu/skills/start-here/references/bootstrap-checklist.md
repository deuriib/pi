# Bootstrap Checklist — start-here

> Session-start and post-compaction checks. Keep it short — detail lives in stage skills.

## Session start

- [ ] Bootstrap (`start-here`) active in context via hook — NEVER re-load via skill tool.
- [ ] Chain order stated: `agree-the-goal → write-the-requirements → propose → review-* → build → review → verify → release`.
- [ ] Current stage identified by trigger (see SKILL.md §3.2), stage skill loaded ONCE via `skill` tool at stage start (never re-loaded on every read/edit/bash).
- [ ] Domain owner/specialist role understood — skill + role per stage, subagents full-wave. Path cited in output.
- [ ] Execution declared: Execution is subagents only — the natural process: orchestrator hands work to the entire team; domain leads/specialists do the work or brief back. Reference-only SPEC/HARD/GATE/DOMAINS 4-line notes, full-wave always. Trivial reversible work (<50 lines) lives outside methodology as CEO small-task shortcut (checkpoint-only), never as a chain branch. Sequential degradation, same contract: harnesses without task run lanes sequentially in the same thread — same 4-line note, same reviewers, same full-wave gate. No min-gate, no silent downgrade.
- [ ] Hard rules acknowledged:
  - [ ] NEVER code without approved `PROPOSAL.md`.
  - [ ] NEVER skip `check-security` for auth/data/API.
  - [ ] NEVER modify contracts without ADR.
  - [ ] NEVER hand off on CLOSED gate without domain leads + orchestrator documented exception record.
  - [ ] ALWAYS trace `REQ-ID → test → file → gate verdict`.
  - [ ] ALWAYS produce `HANDOFF.md` before shipping.
  - [ ] Reference-only 4-line notes between stages.

## Post-compaction resume

- [ ] Active stage + spec ID + gate verdicts + `execution_mode` restored from trace.
- [ ] Stage skill loaded ONCE before continuing (do not re-load on every command/edit).
- [ ] No code written until proposal approval is re-confirmed.

## Domain catalogue (canonical — 8, full chain for all)

- [ ] Domains resolved from `skills/AGENTS.md`: engineering (engineering owner), security (security owner), finance (finance owner), legal (legal owner), marketing/brand (marketing owner), people (people owner), revenue (revenue owner), automation/ops (automation owner + engineering owner).
- [ ] Spec 4-line note carries `SPEC:<path>#REQ / HARD:<mode+constraints> / GATE:<verdicts> / DOMAINS:[<list>]` — never paste full context.
- [ ] Data (`check-data`) treated as cross-cutting angle, not a tenth domain.
