---
name: release
description: "Writes the release notes, updates the changelog, tags the release, and moves the finished work into the archive. Use when the work is verified and ready to go out. Triggered by \"ship it\", \"release this\", \"publish\", or \"cut a release\"."
---

# Release — notes, changelog, tag, archive

> _"Haces las cosas como para Dios, por eso trabajas con excelencia, dedicación y minimalista."_

## 1. Purpose

Turn verified handoffs into a shippable release with notes, changelog,
deployment order, an annotated version tag, and archival. Never ship without
verification gates complete, and never close a release whose tag is unpushed.

## 2. Contract

- **IN** — `HANDOFF.md` + `REVIEW.md` (all `OPEN` or waived) + intact 4-line note.
- **OUT** — `docs/specs/releases/RELEASE_NOTES.md` + `CHANGELOG.md` + synced version version sync + `docs/specs/archive/<spec-id>/` (spec + promoted `REVIEW.md` + `HANDOFF.md` + `ARCHIVE-RECORD.md`) + annotated `git tag vX.Y.Z` on the release commit, published to `origin`.
- **NEXT** — none (chain close; lessons captured by owning C-level on PASS).
- **STOP** — any gate not `OPEN`/waived → no ship. Purge before promote → never (audit trail lost). Release commit untagged, step 8.3 unverified, tag unconfirmed on the remote, or `pending` in `docs/specs/archive/<spec-id>/ARCHIVE-RECORD.md` → not shipped.

## 2b. Role Binding (Org)

- **Bound to:** orchestrator delegating orchestration to the operations function
  with the owning domain lead + the engineering owner for release mechanics.
  Non-code ships delegate mechanics to the owning domain lead (e.g. legal for
  filing, marketing/revenue for launch, finance for close, automation for
  workflow enablement).
- **Every agent in the roster holds `run_command`, including the stage holder.**
  `INV-009` makes terminal execution uniform across the roster, so nothing
  blocks the stage holder from steps 8-10. The three-name restriction that
  sentence used to carry was false against the tree and is retired by
  `DECISION-019`. Steps 8-10 are still handed to a second agent, and now by
  choice rather than by permission: a tag, a push and a backfill are published
  facts, so the stage holder keeps the decision to tag and a second reader runs
  the commands. `GOAL-product-domain` AR-2 records the residual risk the
  security owner raised when the restriction was dropped.

## 3. Process

0. Pre-flight LOAD — STOP: `skill(release)` loaded? Agent templates read for orchestrator + owning domain lead + the second reader of §2b? All gates OPEN (or waived) verified? Any NO → STOP. Execution is subagents only: orchestrator hands work to the lane, ordered to read this skill.
1. Verify all the done checklist checklists + gate reports are OPEN (with `SPEC/HARD/GATE/DOMAINS` intact).
2. Produce `docs/specs/releases/RELEASE_NOTES.md` via `references/release-notes.md` (ship type: deploy | filing | launch | close | rollout | policy-enable). Singleton: create-if-missing else update-in-place, never suffix — one UPPER_SNAKE canonical per lane (only `RELEASE_NOTES.md`, never `RELEASE_NOTES-*.md`). Update it in place for every release; a stale file from a prior version is not a reason to skip, because steps 8 and 10 both read `<ship-type>` from it. N/A only when there is no spec lane — record `N/A — no spec lane` in the file.
3. Update changelog via `references/changelog-template.md` (or record N/A with justification for internal-only non-code).
4. Audit documentation via `references/documentation-checklist.md` and synchronize version version sync across the repository via `node scripts/bump-version.mjs --sync` (or bump version). README (`references/readme-template.md`), INSTALL (`references/install-template.md`), and MIGRATION (`references/migration-guide-template.md`) are CONDITIONAL: required only when `ship-type` is `deploy` with breaking changes; otherwise cited, not required.
5. Coordinate ship mechanics with rollback/undo plan: the second reader of §2b for deploys (tag, push, deploy); owning domain lead for the decision, filings/launches/closes/workflows.
6. Archive by MOVE + promote evidence + purge allowlist (never copy, never sweep) — exactly these 5 substeps, in order:
   1. `git mv docs/specs/backlog/<spec-file>.md docs/specs/archive/<spec-id>/` and verify `git status --short` shows `R` rename with the source path gone (no duplicate, no copy).
   2. Promote evidence into `archive/<spec-id>/`: copy `REVIEW.md` + `HANDOFF.md` (from `work/reviews/<spec-id>/` and `work/<domain>/`) — these prove the release and must survive the purge.
   3. Write `docs/specs/archive/<spec-id>/ARCHIVE-RECORD.md` via `references/archive-record.md`: spec, gate verdict, commit(s), tag, promoted list, purged list, DECISION link if any.
   4. Purge ONLY this allowlist for this `<spec-id>`: `work/<domain>/{PROPOSAL,PLAN,TESTS,HANDOFF}.md` + `work/reviews/<spec-id>/`. Nothing outside the allowlist is touched; if another SPEC's lane is active, STOP (do not purge across lanes).
   5. Verify before commit: purged paths absent (`ls`), other lanes untouched, `git status` clean of strays — then release commit includes the ARCHIVE-RECORD.
7. Close with a release commit. Example: `chore(release-0.4.0): ship SPEC-003 with notes, ARCHIVE-RECORD and rollback plan`. The release commit lands on `main` via the normal branch + review path — never a direct push to `main`.
8. Tag the release via `references/tagging.md` — exactly these 4 substeps, in order, AFTER the release commit (run by the second reader of §2b, who keeps the decision with the stage holder):
   1. Pre-check: `git status --short` empty, `git tag -l vX.Y.Z` empty, `git ls-remote --tags origin refs/tags/vX.Y.Z` prints nothing, `git var GIT_COMMITTER_IDENT` succeeds, `node scripts/bump-version.mjs --check` exit 0. Any failure → STOP.
   2. Create the annotated tag: `git tag -a vX.Y.Z -m "<annotation>"` (version + ship-type + every included spec + gate verdict + highlights + `Refs: <REQ-IDs>`). Annotated, never lightweight.
   3. Verify locally: `git cat-file -t vX.Y.Z` prints `tag`, `git rev-parse vX.Y.Z^{commit}` equals the release commit sha, `git for-each-ref refs/tags/vX.Y.Z --format='%(contents:subject)'` first line matches the annotation shape, `git describe --tags --exact-match HEAD` prints exactly `vX.Y.Z`.
   4. Publish: state the assumption (this pushes `<branch>` + tag to `origin`), then `git push origin <branch>` and `git push origin vX.Y.Z`. If the remote is unreachable or push access is missing, the release does not close — record the blocker, owner and the exact commands in `RELEASE_NOTES.md` §Known Issues and leave the tag local.
9. Confirm the tag on the remote: `git ls-remote --tags origin refs/tags/vX.Y.Z "refs/tags/vX.Y.Z^{}"` must print **two** lines — the tag object sha and the `^{}` commit sha. A single line is not confirmation (git filters the peeled line out for a bare pattern, so an annotated tag is indistinguishable from a lightweight one). This is the terminal condition: the ship closes only when the `^{}` line equals the release commit sha and no `pending` remains in `docs/specs/archive/<spec-id>/ARCHIVE-RECORD.md`. N/A when there is no spec lane — record `N/A — no spec lane` in `RELEASE_NOTES.md`.
10. Backfill `docs/specs/archive/<spec-id>/ARCHIVE-RECORD.md` (per `references/tagging.md` §5): replace the `pending` in `**Commit(s):**` and `**Tag object:**` with `git rev-parse HEAD` and `git rev-parse vX.Y.Z`, and confirm the planned name already in `**Tag:**`. Separate commit, after the tag is confirmed on the remote, and **push it** — `chore(release-0.4.0): backfill archive record with commit + tag`. Never amend the release commit once tagged. N/A when there is no spec lane.

## 4. What I won't do

- Ship without verification gates complete (OPEN or waived CONDITIONAL/CLOSED with record).
- Skip changelog for user-facing changes (any domain — code or non-code).
- Ship with out-of-sync documentation or unverified install instructions (README, INSTALL, or migration guides lagging behind released behavior).
- Ship with version mismatch or drift between manifest, plugin runtime, rules, and context hooks.
- Ship without a rollback/undo plan (revert + retract/void/reverse/disable with owner).
- Leave the allowlisted drafts in `docs/specs/work/` after archival, or purge anything OUTSIDE the allowlist (parallel SPEC lanes must survive).
- Archive evidence: `REVIEW.md` + `HANDOFF.md` must be promoted to `archive/<spec-id>/` BEFORE the purge — purging them silently loses the audit trail.
- Tag with a lightweight ref — an unauditable tag is not a release truth; use `git tag -a`.
- Tag before the release commit, or tag over version drift — the tag must point at the tree that contains the notes, changelog, archive record and synced version sync.
- Close a release without the step 8.3 local verification, or on a single-line `ls-remote` — one line cannot distinguish an annotated tag from a lightweight one.
- Push the tag, or the step 10 backfill commit, only locally — a backfill that never reaches `origin` leaves `pending` on the remote forever, which is the violation it exists to close.
- Run steps 8-10 yourself and publish on your own reading — a tag, a push and a backfill are published facts, so the second reader of §2b is the control. Holding the tool is not what makes the step safe; INV-009 gives every agent `run_command`, and the separation is kept on purpose.
- Force-move, re-tag, or delete a published tag without explicit owner approval — a published version is immutable; revert forward and cut a new one instead.
- Amend the release commit after it is tagged, or leave a `pending` in a shipped `ARCHIVE-RECORD.md`.

## 5. References

- `references/release-notes.md` — Highlights/features/fixes/breaking/rollback.
- `references/changelog-template.md` — Keep-a-Changelog format.
- `references/documentation-checklist.md` — Pre-release documentation audit + the exact purge allowlist.
- `references/archive-record.md` — `archive/<spec-id>/ARCHIVE-RECORD.md`: what was promoted, purged, tagged.
- `references/tagging.md` — tag identity (3-way check), annotated-tag creation, verification, remote confirmation, backfill, rollback (3 situations), concurrency.
- Conditional (only `ship-type=deploy` with breaking changes): `references/readme-template.md`, `references/install-template.md`, `references/migration-guide-template.md`.
