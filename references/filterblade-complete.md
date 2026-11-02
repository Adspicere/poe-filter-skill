# Complete filter and editable-project changes

Use this for default offline FilterBlade generation from an authentic editable project or a declared new project. Follow [FilterBlade scope](filterblade.md), [runtime/cache](filterblade-offline.md), and [pacing](filterblade-rate-limits.md). Selecting this mode needs no additional offline opt-in; it does not enable fetching, installation, live browsing, cloud saving or PoE sync.

## Select the deliverables

| Deliverable | Edit and acceptance |
| --- | --- |
| Complete `.filter` | Edit a full-file candidate with ordinary file tools. Check syntax, matching, boundaries, priority, Continue appearance, and the complete non-target diff. Optional native replay tests the file without regenerating strictness. |
| Editable `.filterBladeSaveFile` | Apply native operations to an authentic project or a declared derivative on its compatible canonical base. Reload native records in a fresh context; compare both records and the complete export. |
| Both | Produce both files from the same accepted project state. Independently replay the `.filter` and verify that the fresh project generates the same complete output. |

A game export does not contain the original customization history. Parsing it and saving new changes does not recover that history. If only an export exists, keep local editing available; identify any new project as a derivative and establish its base explicitly.

To verify an editable project through the actual webpage, follow [webpage import](filterblade-import.md). Fresh core replay alone does not establish the file-input/FileReader/full-UI path or actual browser download completion.

## Stage project edits

Use a disposable project context for broad edits. Keep the original page and files untouched; retain a fresh native SaveFile, complete baseline export, base/options versions, and input hashes. The staged project must reproduce the baseline before editing. A different base, strictness, style, option version, unresolved dependency, or changed baseline is a reason to resolve compatibility; do not normalize away differences or silently update upstream.

Translate the request into narrow operations and positive, negative, boundary, and unaffected-item expectations. Record ownership, scope, inherited protections, and expected outcome. Resolve IDs from this context. Shared queries need their complete expected entry-ID lists; a single item in a shared tier normally needs a narrow custom exception.

The optional [project helper](../scripts/filterblade_project.js) needs an initialized compatible native PoE 1 context. It contains no website assets or account client. Use an authorized isolated context or supported disposable page with its own recovery boundary. It is not a general in-place rollback tool for the original live page. For the bounded live appearance transaction, use the separate [MCP workflow](filterblade-mcp.md).

| Method on `window.__poeFilterFBProject` | Purpose |
| --- | --- |
| `inspect(target)` | Check scope, values, visibility, and style relationships. |
| `preflightPlan({operations})` | Check the entire plan and custom-rule dependencies before dispatch. |
| `applyPlan({operations})` | Apply native operations with pacing. After full-plan preflight, dispatch one operation per awaited host call to stay within page-evaluation timeouts. |
| `stableExport()` | Generate the complete filter while preserving native line-formatting state. |
| `serializeProject()` | Return a local native project string while preserving serializer state; no cloud save. |
| `replayProject(serialized, {freshContext: true})` | Load records in a fresh compatible context; reject failed/invalidated changes. This does not restore a live page. |
| `itemResult(stats)` | Inspect matching and appearance; use independent export replay for final item acceptance. |
| `inspectListMember(target, field, value)` | Inspect a scoped list member's current lock state. |

The operation vocabulary is `set`, `add`, `rename`, `remove`, `target`, `priority`, and `moveList`. Use preflight and verified native field formats rather than manufacturing persistence JSON. A `set` target is `{entryId}` for a custom rule or `{queryName, expectedEntryIds}` for an ordinary query. Numeric values use `{kind: "number", operator: ">=", value: 83}`; lists use `{kind: "list", values: [...]}` with an explicit operator only when required. On `set`, `index` selects a condition line; on `priority`, it is actual custom-rule priority.

### Name new rules and decorators

Each `add` requires a meaningful `name`; the helper expands creation into native add and rename operations. For example, `{op: "add", builderName: resolvedBuilderName, entryId: newEntryId, name: "Show Warstaves - ilvl 86+ - Teal"}`. Use `{op: "rename", entryId: resolvedCustomEntryId, name: "Show Warstaves - ilvl 86+ - Teal"}` to rename a custom rule owned by the active user group. `inspect({entryId})` returns both raw `name` and native `displayName`.

Prefer the user's explicit name; otherwise choose a short description of the action/purpose, actual item scope and important level/area/rarity bounds. Use the user's preferred language; names are user-facing labels, not agent-authored source comments. Examples include `Show Warstaves - ilvl 86+ - Teal`, `Hide Wisdom Scrolls - area 68+`, and `Rare Maces - teal decorator`. Stay within 50 UTF-16 code units, avoid markup/control characters, placeholder names and confusing duplicates, and do not claim broader coverage than the rule actually has. Add a concise qualifier when two rule names would be ambiguous. Do not bulk-rename unrelated existing rules or module-owned rules.

The pinned native workflow is `VisualElement.createChange("CustomUserEntryDisplayName", {newName}, entry, ...)`, followed by `changeStorage.addAndApplyChange`. The name is project metadata: a DOM-only title edit, raw metadata assignment, rule ID change or a new `.filter` comment is not an equivalent persisted rename. Retain the stable entry ID, conditions, order, style and ownership. Require the expected display name and its native change record after fresh SaveFile replay; the plain game export need not contain this project-only label. An unsupported rename is an incomplete naming step, not permission to forge persistence JSON.

`lockList` additionally supports an existing ordinary-list member when its native control is rendered. Verify the exact list scope and lock state before and after fresh replay. A missing control is a preflight refusal; use the verified native rendering/page workflow rather than replacing its UI updater. Ordinary list locks do not establish matrix or whole-category locking support.

After resolving and backing up a custom target:

```javascript
const api = window.__poeFilterFBProject;
const plan = {operations: [
  {op: "set", target: {entryId: resolvedCustomEntryId},
   field: "ItemLevel", value: {kind: "number", operator: ">=", value: 83}},
  {op: "set", target: {entryId: resolvedCustomEntryId},
   field: "SetBackgroundColor", value: "rgb(255, 0, 255)"}
]};
api.preflightPlan(plan);
for (const operation of plan.operations) {
  await api.applyPlan({operations: [operation]});
}
```

Verify each requested behavior; a generic setter does not establish every field's support. Preserve builder-inherited guards, list locks, themes, and layers. Hide, Disable, and deletion differ; Hide can clear sound/icon/beam settings. GUI order does not establish matching priority. A native sound filename does not deploy its audio file or prove playback.

On the verified frontend, reset font size to an explicit intended/backed-up value; null font removal is refused. `CustomAlertSoundOptional` and direct Continue toggling are also refused. Create Continue through the native decorator workflow and fill its required Class and Rarity controls; that builder does not offer a BaseType selector. Preserve the requested scope rather than silently broadening it to a whole class. Ordinary custom-sound exports need their actual local audio files; the workspace runner accepts an explicit sound-assets manifest without discovering or fetching assets.

Do not bypass theme/frozen-target refusals or guess unsupported matrix, module, theme, Continue, or migration behavior. If offline representation/replay fails, report the limitation; a correct raw-file edit alone does not count as editable-project support. Verified page controls are available only for an explicitly selected webpage workflow or authorized fallback.

## Accept, export, or discard

1. Review the complete diff, non-target rules, and preexisting records. Native loading may migrate records; equal output does not establish preserved history.
2. Independently check syntax and requested items on the complete export, including bounds, exclusions, competing rules, and Continue appearance. Inspect diagnostics. Verify sound/import dependencies or refuse dependent checks. Selected item probes and a no-op compile do not establish the full non-target diff.
   For appearance requests, assert the final requested colors/font/sound fields separately from visibility and winning-rule identity. An earlier rule with identical requested appearance passes the appearance check unless use of the new rule is itself required. Record terminal/Continue provenance; do not infer a color failure from a different rule ID or treat a Show result as proof of the requested styling. Narrow any necessary priority change to the accepted scope while preserving earlier special-item protections.
3. Serialize locally; reload on the same canonical base/options and selection. Require zero failed/invalidated changes, preserved stored records, and exact complete export equality. This proves the pinned replay path, not compatibility with any newer site base or game-client activation.
   For each newly created or expressly renamed rule, also require the intended name in native metadata/display and the persisted rename record after replay. Naming must not change matching conditions, priority or appearance.
4. Write both outputs as exact UTF-8 bytes and re-read them. Preserve original input bytes/mtime. Replace/import only after acceptance. A detached local project need not retain cloud identity or automatic-sync preferences.
5. For a temporary staged test, discard the disposable context and verify original files/page state are unchanged. On the original live page, use the bounded helper's full restore checks. Fresh-context replay does not restore original dirty/autosave/UI state.

Report both paths, runtime/base pins, checks and unsupported cases. Distinguish staging, automated checks, full diff acceptance, local import, cloud save, and PoE synchronization. Default retention is local artifacts or expressly requested page changes.
