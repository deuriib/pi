# TAGGING — Release Tag Mechanics

Canonical procedure for the release tag, executed in `release` step 8. The tag is the release truth (`README.md` Contributing #6): a `CHANGELOG.md` release section with no matching tag on the release commit is an unshipped release.

## 1. Tag identity

Tag name, `package.json` version, and the `CHANGELOG.md` release header must be the same version. Check all three before creating the tag:

| Source | Expected literal | Example |
|---|---|---|
| `package.json` | `"version": "X.Y.Z"` — **no `v` prefix** in the field | `"version": "0.13.0"` |
| `CHANGELOG.md` | `## [vX.Y.Z] — YYYY-MM-DD` section header | `## [v0.13.0] — 2026-09-26` |
| Tag | `vX.Y.Z` — **with** the `v` prefix | `v0.13.0` |

The `v` asymmetry is deliberate and load-bearing: only the changelog header and the tag carry the prefix. An agent that writes `"version": "v0.13.0"` fails `--check` and trips its own STOP in §3.1.

`node scripts/bump-version.mjs --check` (or `npm run version:check`) asserts all three — 8 targets, the 8th being `CHANGELOG.md` on the assert-only leg, which is why a version with no `## [vX.Y.Z]` section is drift rather than a silent pass. A non-zero exit means the tag would lie about the version. **STOP** on drift.

**Changelog N/A exception:** step 3 of the SKILL permits an internal-only non-code ship to record `N/A — [justification + owner sign-off]` instead of a release section. In that case there is no header to match, so the `CHANGELOG.md` leg is satisfied by the N/A line naming the same version. `--check` cannot verify this, so the agent asserts it by reading `CHANGELOG.md` and stating the N/A in the release notes. Everything else in §1 still applies.

## 2. Tag type

**Annotated, unsigned.** `git tag -a vX.Y.Z -m "<annotation>"`.

- Annotated: carries the tagger identity and a message, and resolves under `git describe --tags`. A lightweight tag is a bare ref with no message and no author — it cannot be audited, so it is never used here.
- Unsigned: no GPG/SSH key is required, so the step cannot fail on a missing key. Provenance is the release commit sha recorded in `ARCHIVE-RECORD.md`, not the signature.

Annotation message shape (first line must contain the version, ship type, every included spec, and the gate verdict):

```
vX.Y.Z — <ship-type> — <spec-id> | <spec-id> — gate <verdict>

<one-line highlights>

Refs: <REQ-IDs>
```

`<ship-type>` is one of `deploy | filing | launch | close | rollout | policy-enable` (from `RELEASE_NOTES.md`). For a multi-spec release, list every included spec id separated by ` | ` — one release tag can cover several archived specs, and each spec's own `ARCHIVE-RECORD.md` carries that same tag. For a release with no spec lane, write `no spec lane` and the gate is not applicable. `Refs:` lists the REQ-IDs the release satisfies, or `none`.

## 3. Procedure

Four substeps, in order. Tag **after** the release commit (step 7) — never before, or the tag points at the pre-release tree.

### 3.1 Pre-checks

```
git status --short                        # must be empty — no strays, no half-staged archive
git tag -l vX.Y.Z                         # local collision — must be empty
git ls-remote --tags origin refs/tags/vX.Y.Z   # remote collision — must print nothing
git var GIT_COMMITTER_IDENT               # must succeed — unset user.name/email makes `git tag -a` hang on a prompt
node scripts/bump-version.mjs --check      # must exit 0 (8/8 synchronized)
```

Any check fails → STOP. Do not create a tag over a dirty tree, a drifted version, or a name that already exists locally **or on the remote** (a remote-only tag is invisible to `git tag -l`; a partial prior run from another clone leaves exactly that).

### 3.2 Create the annotated tag

```
git tag -a vX.Y.Z -m "<annotation from §2>"
```

### 3.3 Verify locally

| Check | Command | Pass criteria |
|---|---|---|
| Annotated, not lightweight | `git cat-file -t vX.Y.Z` | prints `tag` (a lightweight tag prints `commit`) |
| Points at the release commit | `git rev-parse vX.Y.Z^{commit}` | equals `git rev-parse HEAD` |
| Message is present and correct | `git for-each-ref refs/tags/vX.Y.Z --format='%(contents:subject)'` | first line matches the §2 shape — contains the version, the ship type and the gate verdict |
| Resolves in history | `git describe --tags --exact-match HEAD` | prints exactly `vX.Y.Z` |

`git tag -l -n99` is **not** a valid substitute for the message check: per git's own docs it prints the *commit* message when the tag is not annotated, so it cannot distinguish the two. `git describe --tags` without `--exact-match` is not a valid substitute for the resolve check: it succeeds on a *different* tag and fails spuriously on a shallow clone.

### 3.4 Publish

Push the release commit first, then the tag. Publishing touches the remote, so state the assumption before acting: *"this pushes `<branch>` and tag `vX.Y.Z` to `origin`."* Confirm with the owner when the release is a non-code ship, and always when the branch is not `main` (branch-protection and no-direct-push-to-`main` rules apply — see `agents/espinoza.md`, `agents/vasquez.md`).

```
git push origin <branch>
git push origin vX.Y.Z
```

An offline agent, a missing `origin`, or a fork without push access is a legitimate dead end, not a failure to route around. If the tag cannot be published, the release does **not** close: record the blocker, the owner, and the exact push commands in `RELEASE_NOTES.md` §Known Issues, and leave the tag local. Do not delete a correct local tag to make the state look clean.

## 4. Confirm on the remote, then close

Only after `git ls-remote` prints **two** lines is the tag confirmed on the remote:

```
git ls-remote --tags origin refs/tags/vX.Y.Z "refs/tags/vX.Y.Z^{}"
```

Expected output is the tag object sha on the `refs/tags/vX.Y.Z` line **and** the release commit sha on the `refs/tags/vX.Y.Z^{}` line. A single line is not confirmation: with a bare pattern, git filters the peeled line out and an annotated tag looks identical to a lightweight one. Passing both patterns is what makes the annotated property verifiable from the remote (verified against this repo — a bare `vX.Y.Z` pattern returns one line only).

The `^{}` line equalling the release commit sha closes the loop: the published tag dereferences to the commit that carries the notes, changelog, archive record and synced version sync.

## 5. Backfill evidence

`ARCHIVE-RECORD.md` is written in step 6.3, before the release commit (step 7) and the tag (step 8) exist, so `**Commit(s):**` and `**Tag object:**` are forward references. Backfill after §4 confirms the tag on the remote:

| Field | Value | Command |
|---|---|---|
| `**Commit(s):**` | release commit sha | `git rev-parse HEAD` |
| `**Tag:**` | tag name (already written at 6.3) | — confirm, do not rewrite |
| `**Tag object:**` | annotated tag object sha | `git rev-parse vX.Y.Z` (the tag object, **not** `^{commit}`) |

Backfill is a **separate commit** from the release commit, and it is **pushed** — otherwise the record on `origin` keeps reading `pending` forever, which is the exact violation the backfill exists to close. Never amend the release commit once it is tagged: the tag would silently point at a rewritten commit. A `pending` left in a shipped `ARCHIVE-RECORD.md` is a gate violation.

Backfill is N/A when the release has no spec lane: there is no `archive/<spec-id>/` to write, so record `N/A — no spec lane` in `RELEASE_NOTES.md` instead.

## 6. Rollback

Three distinct situations; the shipped text used to cover only the first two, which left a bad release with no documented exit.

| Situation | Action |
|---|---|
| Tag not pushed, created by mistake | `git tag -d vX.Y.Z` — local ref only |
| Tag pushed, the release must be withdrawn | `git push --delete origin vX.Y.Z` — **requires explicit owner approval**; then roll `package.json` + the 8 version sync targets back with `node scripts/bump-version.mjs <target-version> --changelog` and correct the `CHANGELOG.md` block so the published section matches reality |
| **Tagged content is wrong** (the tag itself is fine) | **Never** move or delete the tag, and **never** revert on `main` alone. `git revert <release-commit-sha>` as a new commit, then `node scripts/bump-version.mjs patch --changelog`, re-run `--check`, move the `README.md` / `INSTALL.md` install pins to the new tag, and add a `CHANGELOG.md` line marking the old version superseded. The old tag stays forever — that is what makes it a record |

Deleting a tag never rolls back a deployment, and a revert on `main` never changes what a consumer pinned at the old tag resolves to. Deployed code ships are reverted separately (`git revert`), and any registry or package publication is its own undo. Record which of the three situations applied, with the owner, in `RELEASE_NOTES.md` §Rollback/Undo and in the `ARCHIVE-RECORD.md` §Notes.

## 7. Concurrency

Tag refs are repository-global, not per-worktree or per-lane, so two parallel release lanes both pass §3.1 and race. Before tagging, confirm no other lane is mid-release: the same cross-lane guard that stops the step 6.4 purge across lanes also stops step 8. When two lanes genuinely must ship, they serialize — one release, one tag, both spec ids in the annotation.

## 8. Prohibitions

- **No lightweight tag.** `git tag vX.Y.Z` without `-a` is never used — no message, no tagger, unauditable.
- **No tag before the release commit.** The tag must point at the tree that contains `RELEASE_NOTES.md`, the changelog block, the archive record, and the synced version sync.
- **No force over an existing tag.** `git tag -f` and `git push --force origin vX.Y.Z` are forbidden; a published version is immutable.
- **No re-tagging a published version.** If the release was wrong, use §6 row 3 — revert forward, never rewrite history.
- **Never push a tag without its commit.** `git push origin vX.Y.Z` on an unpushed commit leaves the remote tag dangling; push the branch first.
- **Never accept a single-line `ls-remote` as confirmation.** Both patterns are required (§4), or the annotated property is unverified.
- **Never delete a published tag without explicit owner approval.** See §6.
- **No tag over version drift.** If `bump-version.mjs --check` fails, the tag would disagree with the manifest; fix the drift first.
- **Never backfill after the tag and leave the commit local.** An unpushed backfill leaves `pending` on the remote forever.
