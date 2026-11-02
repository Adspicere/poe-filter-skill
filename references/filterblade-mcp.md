# Optional FilterBlade settings through Chrome DevTools MCP

Use this only for an explicitly selected live appearance edit on an authorized loaded PoE 1 page. General FilterBlade generation defaults to [offline processing](filterblade.md); it does not require an MCP connection. Follow the [interaction policy](filterblade.md#interaction-policy), including manual browser authorization. Retain accepted page/browser changes only for the requested live task; cloud save and PoE sync remain separate destinations.

## Connect and identify

Discover the installed tool schemas; names and parameters can vary by version. The verified tools are `list_pages`, `evaluate_script`, `emulate`, and `take_screenshot`. Use the resolved page ID on every call. JavaScript evaluation must support mutations; a read-only browser evaluator cannot run the editing helper.

Prefer the selected, already-loaded project. An isolated browser profile does not inherit another Chrome session's login, unsaved changes, or custom rules. Do not reload, import a replacement, copy a personal profile, or treat a fixture as the selected project. Have the user manually complete any required browser authorization or remote-debugging settings; reuse an existing authorized connection. Do not operate browser permission prompts or native windows as a fallback. Do not expose cookies or authentication data.

Confirm project/game, strictness/mode, the actual target entry and its complete matching scope. Resolve the entry ID from this page. For an individual item in a shared rule, use a narrow native exception rather than editing the whole group. Apply the [request limits](filterblade-rate-limits.md); a navigation can cause many requests, and the MCP tools are not a request scheduler.

## Prepare recovery

Load any required controls under the request budget. Record the original emulation settings, then use `emulate` with `networkConditions: "Offline"` on the selected page for the local edit/export/restore sequence. Offline emulation supplements the destination boundary; it does not prove zero external traffic. Retain network metadata sufficient to distinguish account operations from analytics without collecting account headers or bodies.

Read the [page helper](../scripts/filterblade_page.js) from this skill and send its contents through the supported evaluator as a classic script. `sourcePath` is also usable when the MCP server can read that approved path. Do not widen filesystem access to work around a path restriction. The script exposes `window.__poeFilterFB`; it does not install a browser extension or contact account services.

Call `await prepare({entryId: resolvedEntryId, temporary: isTemporaryTest})`. Before any setter, persist the returned `editableBackup` as an editable SaveFile and `exportText` as the baseline `.filter` in the approved task directory; verify the written bytes. The backup is generated from current native records; equality between autosave and a loaded save alone cannot prove freshness. A SaveFile preserves recorded edits; retain the live recovery snapshot for unrecorded/runtime state. An exported `.filter` or screenshot is not an editable-project backup.

The helper initially supports an existing active save envelope, a unique native Customizer editor, and targets without a theme subscription. If a capability is missing, use the page's verified native controls and recovery workflow; do not force the helper onto an unsupported target. If native controls cannot preserve non-owned theme inheritance, stop before detaching it; obtain authorization for that broader change or report the requested edit as incomplete.

## Edit and verify

Invoke one phase at a time and await every result. Keep the page single-writer: no parallel agent edits or UI interaction while a helper call is pending. Save recovery artifacts before editing and inspect the candidate before accepting it.

| Page-helper operation | Use |
| --- | --- |
| `await prepare({entryId, temporary: false})` | Capture recovery, a fresh editable backup, baseline output, and target summary. Use `temporary: true` only for an expressly requested temporary test. |
| `await setAppearance({index, value})` | Run the native appearance hook and setter together. |
| `await exportCurrent()` | Obtain current generated text and preview/target information while preserving serializer state. |
| `await restore()` | Restore the native value and captured state, then return full output and recovery checks. |
| `await accept()` | Finish an accepted ordinary edit, retaining its page/browser changes. This does not save to the cloud. |
| `await release()` | Release recovery memory only after a temporary test has been fully restored and verified. |

Invoke these methods on `window.__poeFilterFB` inside `evaluate_script`. The appearance fields are:

| Index | Setting | Native value |
| --- | --- | --- |
| `0` | Text color | CSS `rgb(...)` or `rgba(...)` string |
| `1` | Border color | CSS `rgb(...)` or `rgba(...)` string |
| `2` | Background color | CSS `rgb(...)` or `rgba(...)` string |
| `3` | Font size | Numeric string within the current control's bounds |

For example, after backup, `await window.__poeFilterFB.setAppearance({index: 2, value: "rgb(255, 0, 255)"})` changes the resolved entry's background. Confirm the actual controls and accepted formats first. The live round trip verified background color; validate other fields against the current page. Use native UI controls for sounds, conditions, visibility, lists, and other settings rather than inventing index mappings.

Compare the committed control and rendered preview with the generated target rule. Review the complete baseline/candidate diff and unchanged neighbors; preserve conditions, priority, and non-owned appearance. Decode evaluator results explicitly as UTF-8, write the exact export text as UTF-8 without newline conversion, and re-read for byte equality. Preserve non-ASCII item names. Run the local syntax checker when applicable; it does not prove item matching or game-client acceptance.

`compileFullText()` and save serialization can mutate live formatting, metadata, or group content. Use the helper's guarded generation rather than repeatedly calling them as getters. Do not strip comments or normalize arbitrary whitespace to hide differences. Transferring generated text over MCP verifies a local export; report browser Download/ZIP workflows separately if actually tested.

## Finish or restore

For an ordinary edit, retain the requested settings after verification and call `accept()`. Do not restore an accepted edit merely because cloud saving was not requested.

For a temporary test, run restoration on success and failure. Verify every returned recovery check, exact baseline/restored export bytes, original preview, groups/metadata, raw autosave, dirty state, placement, and style relationships before calling `release()`. Restoring only the color or change count is insufficient. Preserve an originally dirty project as dirty.

Keep recovery when verification or restoration fails. If the user changes the project or edits concurrently, stop and reconcile that state before applying an old snapshot. On MCP disconnection, reconnect to the same page rather than reloading away its recovery memory. Do not discard a failed checkpoint or publish a failed candidate.

Restore the original emulation settings and disconnect resources opened for the task. Have the user manually disable debugging access enabled only temporarily; distinguish a closed MCP connection from confirmed permission revocation. Keep the user's project page open. Report the accepted page state or confirmed restoration, export checks, remaining limitations, and actual destinations. Default execution never invokes Quick Save, Ctrl+S, the saving Download wizard, Direct Write, or PoE sync; use the main [FilterBlade destination workflow](filterblade.md#destinations) only when that destination is authorized.
