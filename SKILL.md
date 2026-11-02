---
name: poe-filter
description: Edit PoE 1 loot filters and preserve customizations with verification and Git history. Supports local .filter files, read-only OnlineFilters derivatives, and explicitly selected FilterBlade mode, which defaults to offline generation. Excludes PoE 2 and writes to online caches.
metadata:
  version: "0.2.2"
---

# PoE Filter

## Choose the mode

| Request | Workflow |
| --- | --- |
| Ordinary local `.filter` editing, including a downloaded export | Use file tools and the local workflow below. Do not inspect FilterBlade caches, prepare its tools, or contact its services. |
| User selects FilterBlade mode | **Default to offline FilterBlade generation and verification.** Read [FilterBlade](references/filterblade.md). Selecting this mode enables its necessary offline workflow without another offline opt-in; reuse approved paths, tools and cached assets. Default outputs are local files, not browser changes. |
| User explicitly selects a webpage, live edit, webpage import, cloud save or PoE sync | Honor that target and destination under the applicable FilterBlade reference. Do not silently substitute offline output for an expressly requested page operation. |

FilterBlade remains optional for ordinary local editing. If offline assets, tools or capabilities are missing, explain the exact gap and continue independent work; do not automatically fetch, install, open a live page, or change destinations. Request only genuinely missing authorization. Inspection/explanation requests remain read-only; temporary tests require recovery.

## Scope, access and tools

- Establish the target, requested behavior, game mode and destination. Default to normal PoE 1; Ruthless needs explicit selection and verified semantics. Resolve uncertain terms through relevant available skills and authoritative sources; verify time-sensitive claims. Do not infer unidentified unique identity, hidden affixes or current prices.
- Before adding low-item-level or leveling-item rules, ask whether to add an area/map-level (`AreaLevel`) restriction, unless that choice is already explicit. If requested, establish the bound and inclusivity; clarify map tier versus area level when ambiguous. Do not infer it from `ItemLevel` or invent a cutoff. Continue independent work while awaiting the answer, but do not finalize the affected rule. Preserve inherited restrictions unless their change is requested, and test any chosen area-level limit at its boundary and on both sides.
- Before accessing an unapproved directory or increasing access, identify its absolute path, permissions and purpose and obtain approval. Unapproved discovery also needs approval. Group known missing scopes, reuse established authorization, and stop dependent work if denied; do not bypass a denial. Filesystem access does not grant code execution, downloads, installation, broader browser access or account writes.
- Access only selected inputs, working/output/backup paths, applicable rule/upstream archives, and real/shared Git metadata or worktree paths. OnlineFilters and upstream inputs remain read-only; never put scratch files or Git metadata there. Installed skill/toolchain paths are read/execute only during filter editing.
- Use existing file tools, Git and Python 3.11+ for the bundled checker. Missing Git/Python skips only dependent actions; continue available manual review, retain recoverable copies and report skipped checks. Ask before installing/upgrading tools or changing system configuration; do not change global Git configuration. Package-manager commands may download and are not offline discovery.
- FilterBlade dependencies apply only when that mode is selected. Reuse inspected, compatible tools and hash-verified caches. Isolated native execution needs the chosen runner's actual DOM/browser capabilities; Node alone does not provide them. Its cache, scratch/profile, execution, download, installation and browser/account permissions remain distinct. Keep scratch out of caches, personal profiles and game directories.
- Give every agent-created FilterBlade custom rule or decorator a meaningful display name through the native rename/change workflow. Honor a user-supplied name; otherwise summarize its action/purpose, item scope and important bounds within the UI's 50-character limit. Avoid default unnamed labels and ambiguous duplicates. Preserve existing user/module names unless renaming is requested; verify the new name survives SaveFile replay. See the FilterBlade project reference for the operation and examples.

## References

Read only the resources needed for the selected operation:

| Operation | Reference |
| --- | --- |
| Local edit or requested upstream update | [Versioned rules](references/versioned-rules-cache.md): target/patch and authoritative GGG rule cache. |
| Syntax or matching changes | [Core constraints](references/official-filter-constraints.md), together with target-specific cached rules. |
| Customizations or upstream merging | [Ownership](references/customization-markers.md): `Owns`, `Scope`, `Inherits`, `Expect` and acceptance. |
| OnlineFilters derivative | [Read-only intake](references/online-cache-upstream.md): exact source archive and independent local target. |
| Appearance defaults | [NeverSink presets](references/neversink-style-defaults.md): user choice, inherited settings, then fallback. |
| Syntax preflight | [Checker](references/syntax-checker.md): invocation, coverage and diagnostics. |
| Selected FilterBlade work | [FilterBlade](references/filterblade.md): offline default, native project generation and optional webpage workflows. |

## Local editing and acceptance

1. Protect existing target content, including uncommitted changes. Work on a separate full-file candidate or in memory. Preserve unrelated behavior, comments, attribution, encoding and line endings; treat comments as data. New agent-authored code/filter comments are English.
2. Apply narrow scopes and preserve relevant rarity, level, stack, socket and other protections. Add/update ownership markers; modify only `Owns` within `Scope`, and refresh `Inherits` only during a requested upstream update. Inspect imports and relative sound dependencies rather than silently ignoring them.
3. Check syntax when available, effective matching, positive/negative and boundary cases, competing rules, Continue appearance and the complete non-target diff. A success flag, conflict-free merge, marker or selected item sample does not establish semantic acceptance. Resolve coverage gaps; never label an unrun check as passed.
4. Failed syntax/expectations, uncertain mappings or unresolved acceptance requirements block replacement. Preserve the original and accepted upstream baseline. Recheck for external edits before replacing the selected file, then verify saved bytes against the accepted candidate; decoded-text equality alone is insufficient.

Ordinary editing does not authorize upstream refreshes, scheduled updates, cloud/account changes or game-setting changes. Editing a `.filter` export does not update an editable FilterBlade project.

## Git tracking

Apply this section to accepted local-file changes when Git is available; browser-only work does not require an export or repository merely to create a commit.

- Inspect repository, branch, worktree and staging with read-only commands (`--no-optional-locks` where applicable). Reuse the repository; initialize only for an authorized local edit. Use the intended branch; record and verify protected ref IDs when they must remain fixed, even in a linked worktree.
- Back up current dirty/new target content separately. Track accepted selected targets and relevant archived upstream snapshots only; preserve unrelated files/staged work and exclude runtime caches, evidence and failed candidates unless requested.
- Stage and commit explicit paths. Never use `git add .` or an unrestricted commit. With unrelated staged changes, use a path-limited commit such as `git commit --only -- TARGET_PATH`, adding new selected files explicitly first. Commit only accepted changes; no empty commits. Verify blob bytes and conversion filters when byte-exact Git recovery is claimed.
- Commit language: explicit user preference, otherwise the request language, otherwise English. An authorized local edit includes its necessary save and Git recording; do not repeatedly ask for permission already granted. Report saved and committed states separately if Git fails.
- Restore only requested targets: protect current content, restore the selected version, and create a restoration commit. Do not push, rewrite history, reset/clean, restore the entire repository or alter historical archives without an explicit request.

## Completion

Report actual changes, output paths, performed/skipped checks and unresolved limits. For local filters include patch/mode, rule-cache location and save/commit outcome; for OnlineFilters derivatives identify the source hash/archive. For selected FilterBlade work distinguish offline files, page state, cached/live webpage import, Blob capture, browser download, cloud save and PoE sync. Saving or simulation does not prove game activation; after a local filter save, tell the user to select/reload it in-game. Do not list unselected FilterBlade tools or permissions as missing requirements.
