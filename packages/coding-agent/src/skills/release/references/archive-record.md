# ARCHIVE-RECORD — Release Evidence Index

One `ARCHIVE-RECORD.md` per archived spec, at `docs/specs/archive/<spec-id>/ARCHIVE-RECORD.md`. Written in `release` step 6.3, BEFORE the `work/` purge (step 6.4) — it is the index that makes the purge safe: it says what was promoted (survives) and what was purged (gone, but accounted for).

**Singleton:** create-if-missing else update-in-place, never suffix — one record per `<spec-id>` dir.

**Forward references:** the record is written in step 6.3, BEFORE the release commit (step 7) and the annotated tag (step 8) exist, so `**Commit(s):**` and `**Tag object:**` are forward references. Record the planned tag name in `**Tag:**` and `pending` in the two sha fields; `release` step 10 backfills the real values in a separate commit after the tag is confirmed on the remote (see `tagging.md` §5). This is the **only** sanctioned edit to `archive/`: INV-007 permits a same-release backfill of values the release itself creates, and nothing else — a shipped record is otherwise immutable.

## Template

```markdown
# ARCHIVE-RECORD: <spec-id>

**Spec:** docs/specs/archive/<spec-id>/<spec-file>.md
**Date:** YYYY-MM-DD
**Gate verdict:** OPEN | CONDITIONAL | CLOSED+exception
**Commit(s):** pending            # backfilled in release step 10 (git rev-parse HEAD)
**Tag:** vX.Y.Z                   # planned name, written here; confirmed in step 10
**Tag object:** pending           # backfilled in step 10 (git rev-parse vX.Y.Z, not ^{commit})
**Backfilled by:** pending         # role that ran step 10, e.g. automation specialist
**Ship type:** deploy | filing | launch | close | rollout | policy-enable

## Promoted (survive in archive/<spec-id>/)

- [x] <spec-file>.md          — moved via git mv (R rename)
- [x] REVIEW.md          — from work/reviews/<spec-id>/
- [x] HANDOFF.md              — from work/<domain>/
- [ ] DECISION-###-<slug>.md       — link if this spec created/amended one (decisions/, not copied)

## Purged (allowlist only, this <spec-id>)

- work/<domain>/PROPOSAL.md
- work/<domain>/PLAN.md
- work/<domain>/TESTS.md
- work/<domain>/HANDOFF.md
- work/reviews/<spec-id>/   (all <reviewer>.md; REVIEW.md promoted first)

## Rollback plan

<revert + retract/void/reverse/disable with owner — from RELEASE_NOTES.md>

## Notes

- Other SPEC lanes active during this archive: <none | list> — purge aborted if any.
- Residual risk / open conditions: <none | COND-00x with owner + expiry>
```

## Rules

- Promote BEFORE purge: if `REVIEW.md` or `HANDOFF.md` is not in `archive/<spec-id>/`, the purge must not run.
- The purged list must exactly equal the allowlist in `release` SKILL step 6.4 — any extra path in the purge is a violation.
- `**Commit(s):**`, `**Tag object:**` and `**Backfilled by:**` must be backfilled in step 10 before the ship closes: a literal `pending` in a shipped record is a gate violation. The backfill is a separate commit that is **pushed** — never amend the release commit once it is tagged, and never leave the backfill local.
- The backfill is the only edit allowed to `archive/` after archival (INV-007 same-release exemption). Any other change to a shipped record is a violation — supersede with a new numbered spec instead.
- No PII/secrets/tokens in the record (Ley 172-13 (Dominican privacy law)): owners by role, evidence by path.
