# Documentation checklist for the release step

Use this checklist during `release` to guarantee that all project documentation, install instructions, version markers, and knowledge base files remain synchronized with shipped behavior.

---

## 1. Release Documentation Audit Matrix

| Documentation Target | Reference Template | Responsibility | Verification Method | Pass Criteria |
|---|---|---|---|---|
| **RELEASE_NOTES.md** | `references/release-notes.md` | Release Manager / Ops | Inspection & diff | Highlights, fixes, domain ships, and rollback plan documented. |
| **CHANGELOG.md** | `references/changelog-template.md` | Release Manager / Dev | Diff review | `[Unreleased]` promoted to `[vX.Y.Z] — YYYY-MM-DD` with Keep-a-Changelog format. |
| **README.md** | `references/readme-template.md` | Owning Specialist / Dev | Read-back + command test | Version badges, install snippets `#vX.Y.Z`, and feature lists updated. |
| **INSTALL.md** | `references/install-template.md` | Dev / Ops | Clean install dry-run | Platform requirements, verify commands, and banner markers aligned. |
| **MIGRATION.md** | `references/migration-guide-template.md` | Engineering Owner | Review / dry-run | Required if breaking changes exist; rollback steps documented. |
| **Code & Header Markers** | `scripts/bump-version.mjs` | Automated script | `node scripts/bump-version.mjs --check` | 8 targets: plugin header, `VERSION` constant, parity comments, and the `CHANGELOG.md` release header (assert-only leg). |
| **Context & Rules** | `rules/frame-ship.md` | Automated script / Dev | Marker grep | Version version sync note and persistent cards updated. |
| **Knowledge Base** | `AGENTS.md` (root & subdirs) | Engineering Owner | Read-back & grep | Package version and toolchain commands aligned; no stale stage-step or file-count claims anywhere. |
| **Spec Lifecycle** | `docs/specs/` | Release Manager | Git status check | Spec `git mv` to `archive/<spec-id>/` (R rename, source gone); `ARCHIVE-RECORD.md` written; allowlisted scratch in `work/` purged (nothing outside the allowlist). |

---

## 2. Pre-Ship Step-by-Step Verification Flow

```
1. Run Version Sync Tool
   └── node scripts/bump-version.mjs vX.Y.Z (or --sync)
       ├── package.json
       ├── plugins/opencode/shared.ts
       ├── plugins/antigravity/hooks/context-inject.ts
       ├── rules/frame-ship.md
       ├── README.md
       ├── plugins/opencode/INSTALL.md
       ├── AGENTS.md (version sync line)
       └── CHANGELOG.md (assert-only in --check; header written by --changelog)

2. Audit User-Facing Documentation
   ├── Verify README.md quickstart snippets
   ├── Verify INSTALL.md installation pathways
   ├── Update CHANGELOG.md release block
   └── If breaking changes: produce or update MIGRATION.md
   (Ship-type source: RELEASE_NOTES.md is updated in step 2, BEFORE the tag step —
    a stale RELEASE_NOTES.md means step 8 tags with the wrong <ship-type>.)

3. Validate Toolchain & Gate Integrity
   ├── mise run typecheck (must exit 0)
   ├── Run automated tests / evidence collection
   └── node scripts/bump-version.mjs --check (must report 0 drift)

4. Spec Archival & Workspace Hygiene (promote before purge — see SKILL §3 step 6)
   ├── mkdir docs/specs/archive/<spec-id>/ && git mv docs/specs/backlog/<spec>.md docs/specs/archive/<spec-id>/
   ├── Copy REVIEW.md + HANDOFF.md into archive/<spec-id>/ (evidence survives)
   ├── Write archive/<spec-id>/ARCHIVE-RECORD.md (references/archive-record.md)
   ├── Purge allowlist ONLY: work/<domain>/{PROPOSAL,PLAN,TESTS,HANDOFF}.md + work/reviews/<spec-id>/
   └── Verify: purged paths absent, OTHER SPEC lanes untouched, git status clean

5. Tag, Confirm & Backfill the Release (see SKILL §3 steps 8-10)
   ├── Execute references/tagging.md §3 verbatim (4 substeps) — do NOT re-derive the commands here;
   │   a partial copy of that procedure silently drops guard checks.
   ├── Evidence required before the ship closes:
   │   ├── local: cat-file -t == tag, rev-parse ^{commit} == release sha,
   │   │          for-each-ref contents:subject matches the annotation shape,
   │   │          describe --exact-match HEAD == vX.Y.Z
   │   ├── remote: ls-remote --tags prints TWO lines (tag object + ^{} commit)
   │   └── record:  no `pending` left in archive/<spec-id>/ARCHIVE-RECORD.md, backfill committed AND pushed
   └── N/A (no spec lane): record `N/A — no spec lane` in RELEASE_NOTES.md; the tag steps still run.
```

---

## 3. Strict Prohibitions (What I won't do)

- **Never ship with version drift:** Leaving any plugin header, context hook, or manifest on an older version is a gate violation.
- **Never ship with dead documentation links:** Every link in `README.md`, `INSTALL.md`, and `RELEASE_NOTES.md` must resolve.
- **Never skip changelog for user-facing changes:** Even non-code ships must document operational, legal, or financial changes.
- **Never leave the allowlisted drafts lingering in `work/` after archive:** The 4 lane singletons for THIS spec + `review/<spec-id>/` are purged before the release commit — but ONLY after `REVIEW.md` + `HANDOFF.md` are promoted to `archive/<spec-id>/`, and NEVER across other SPECs' lanes.
- **Never ship without a matching annotated tag on the release commit, published to `origin`:** The tag is the release truth. A lightweight tag, a tag over a drifted version, a tag on a pre-release commit, or a tag that exists only locally is a gate violation.
