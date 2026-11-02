# Editable-project import through the web interface

Use this only for an explicitly selected webpage import/verification or authorized fallback. General FilterBlade generation defaults to [offline processing](filterblade.md). Follow the shared [interaction policy](filterblade.md#interaction-policy), [cache/isolation rules](filterblade-offline.md), and [rate limits](filterblade-rate-limits.md).

## Isolate and capture the baseline

Use a fresh disposable profile/context for temporary import tests. Do not attach, reload, or replace the original user project, copy a personal browser profile, or use its account session as scratch space. Retain the authentic `.filterBladeSaveFile`, its matching complete `.filter` export, selected game/branch/strictness/style, and source hashes/modification times. A game export alone cannot recover project history. Prefer an already verified native detached project when account identity is unnecessary; do not manufacture or repair persistence JSON.

Record the isolated page's initial native project state, full export, dirty/active-project status, local storage, and session storage. An isolated tab sharing the original context is not storage isolation. Restore or discard the test context without affecting the original.

For a cached webpage, reuse a complete compatible approved snapshot and supply its real full HTML/native scripts/data locally. Keep FilterBlade's `isHeadlessServerSideExecution` flag `false` so normal DOM startup and UI loading run; Chrome itself may run headlessly. A core-model bootstrap is not proof of webpage import. The verified webpage snapshot used frontend `1.1.6730`, PoE 1 SSF/NeverSink `8.20.2`, Semi-Strict, Normal; check other selections separately.

A cached localhost interface exercises different account/version/resource branches from the live production origin. State which environment ran. Apply request controls before startup: cached tests deny upstream I/O and writes; live navigation must bound actual request fan-out under the shared budgets. Do not navigate first and treat later inspection as prevention. Missing CSS, images, news, or dictionaries must be disclosed; do not invent replacement filter/configuration data or certify features that need unavailable resources. Fetching missing cached assets still requires its own authorization.

## Exercise the actual import control

1. Wait for native webpage initialization. Confirm the intended game and compatible base, no unintended active project/account, and an available writable MCP evaluator.
2. Open **Advanced → Load filter from saveFile** using the page's controls. Use MCP `upload_file` on the actual button or generated file input with the selected local `.filterBladeSaveFile`. Resolve current element IDs from a fresh snapshot; do not use system file-dialog automation.
3. Require the real input-change/FileReader and full native loading path. Calling the project helper's fresh-model replay or assigning imported fields directly does not test the webpage import. Optional tracing may delegate to original functions while preserving their behavior; retain and remove instrumentation afterward.
4. Wait for asynchronous loading to finish. A start boolean, fulfilled upload call, unchanged count, or success banner is insufficient. Require settled loading, zero failed/invalidated changes, the correct selection, and content checks. Stop on unexpected modules, migration, scope changes, or unresolved dependencies.

## Verify the rendered rule and complete output

Resolve the target from the imported project. Compare its actual Customizer controls with the native conditions, visibility, placement/priority, and requested appearance. For a compatible loaded page, the verified JavaScript reveal is:

```javascript
const entry = gFilterBlade.filterData.getEntryById(resolvedEntryId);
await gFilterBlade.customizeTree.jumpToEntry(entry, null);
```

This opens the native Customizer and lazy parent accordions. Check the current method before using it; otherwise use verified page controls. Do not force visibility by editing CSS. Inspect committed control values and computed preview styles; scaled preview font size need not equal the filter's numeric font setting.

Compare the complete native customization content, ordered records, and generated game filter with the selected baseline. For an unchanged import, require exact UTF-8 export bytes and preserved native content, not just equal record counts or one matching rule. For an edited candidate, use the [complete-edit acceptance workflow](filterblade-complete.md) and review its full requested/non-target diff.

Use guarded export generation: compilation and serialization can mutate native formatting or metadata. The verified native game-export entry is `gFilterBlade.download()`, which creates a Blob and download anchor; it is distinct from saving Download/Quick Save/Direct Write workflows. Confirm the current path and traffic before invoking it. An approved Blob-capture adapter must preserve compiler state, restore browser-boundary descriptors, revoke temporary object URLs, and verify exact bytes/hash. If the anchor click is suppressed, report **native export Blob captured**, not a completed browser disk download. Actual browser downloads need an approved destination and a separately verified saved file.

## Restore and report

For a temporary isolated test, restore captured storage and verify the initial model, active/dirty status, and complete initial export where available, then close the test page/context and stop task-owned services/connections. Preserve original inputs and their modification times. Never use a fresh-model loader as a general in-place rollback for an unsaved original page; use a separately verified transaction for that case.

A fresh webpage initialization can regenerate timestamps. Record strict equality results and each source-confirmed difference; do not strip metadata or broadly normalize it to claim exact restoration. The verified disposable test refreshed only the empty UserChanges group's creation time and the last-used-version date; its rules/export/session state were restored before disposal. This is not permission to ignore differences in actual user records, ownership, dirty state, or autosave.

Report the imported project and selection, rendered-rule checks, native-content comparison, complete export bytes/hash, actual export destination, cleanup, and limitations. Distinguish core replay, cached webpage import, live production-origin import, Blob capture, browser disk download, and game activation. Do not claim that an untested stage ran. Keep raw evidence private/local; this skill does not bundle website assets, account data, research catalogs, or per-run logs.
