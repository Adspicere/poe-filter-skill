# Offline FilterBlade runtime and verification

Selecting FilterBlade generation mode selects offline native generation and verification by default; do not ask for a second offline opt-in. Ordinary local-file edits remain independent of this engine, and explicit webpage requests retain their chosen workflow. Missing offline support does not authorize a live fallback.

Choose the intake before initializing a model:

- **Authentic editable project or declared new project:** use [native project generation](filterblade-complete.md) with the matching canonical base/options and selection. Preserve native history and compare fresh SaveFile replay with the complete export.
- **Existing `.filter` export:** use the replay/matching steps below without regenerating strictness. This tests game rules; it does not recover the editable project or replace independent syntax/diff checks.

## Access and setup

For ordinary local-file work, offer offline item testing when useful and enable it only if selected. A general validation request alone does not choose this engine. A FilterBlade generation request already does; reuse its approved execution and path scopes.

| Needed action | Boundary |
| --- | --- |
| Reuse a cache | Read/list only approved locations; execute inspected, pinned assets in the authorized isolated runtime. Cache reuse needs no cache writes or new download approval. |
| Run and record results | Use approved runner/output/profile directories and installed compatible tools. Keep scratch out of caches, installed packages, personal profiles and game directories. |
| Fetch/refresh assets | Obtain explicit source/file-set/destination permission and obey the 24-hour hold below. Include that downloaded code will execute locally; no unapproved HEAD/version probes or background freshness checks. |
| Install/upgrade tools | Obtain separate source/install/configuration permission. Package-manager auto-downloads are installation, not runtime discovery. |

Ask only for genuinely missing scope and group known paths/sources. If declined or unavailable, report dependent work as unrun, preserve inputs, and continue independent checks. Do not replace pins, silently change modes or refresh caches to hide a compatibility/runtime failure. This policy update is not asset-download permission.

Read [rate limits](filterblade-rate-limits.md) before execution: request-free work uses the shared local budget; public downloads and backend calls retain their network budgets. A hidden fetch is not offline execution.

## Prefer cached assets and hold refreshes for 24 hours

For selected offline generation or testing, first inspect the known approved cache locations locally and choose a complete, compatible, hash-verified snapshot. Cache availability alone does not select FilterBlade, and offline generation does not replace a specifically requested live-project edit. Prefer reuse even when an old snapshot remains suitable for the requested bounded test.

Record a manifest with original source URLs, successful acquisition timestamp in timezone-qualified UTC, frontend/game/data versions, byte sizes, SHA-256 hashes, and the snapshot's completeness/verification result. For a newly acquired multi-file snapshot, record completion only after all required assets were fetched and verified; retain individual retrieval times where available. Reuse/copying/execution, a filesystem mtime, or a failed download must not reset the acquisition timestamp. Use trustworthy existing provenance to assess an older cache; do not invent a timestamp for it.

| Local cache state | Refresh decision |
| --- | --- |
| Complete/compatible; acquisition age `0 <= age < 24 hours` | Reuse it. No replacement download, HEAD/conditional request, remote version/manifest probe, or background freshness check unless the user explicitly asks to refresh this cache. A general download allowance or another item-test request does not override this hold. |
| Complete/compatible; acquisition age at least 24 hours | Still prefer reuse if sufficient. Age alone does not trigger a refresh or grant permission; fetch only when needed/requested and covered by the approved source/destination scope. |
| Missing, incomplete, hash-mismatched or incompatible | Do not execute the bad snapshot. Try another already-approved local snapshot; otherwise explain what is missing and obtain any necessary explicit acquisition/refresh and directory permissions. A failure does not silently override the 24-hour hold on a recent snapshot. |
| Acquisition timestamp missing, invalid or in the future | Mark freshness unknown. Do not declare it expired, reset its time, or contact the server to resolve local provenance. A hash-verified compatible snapshot may be used with disclosed provenance limits; obtain explicit refresh permission if a replacement is necessary. |

An explicit request such as "refresh this offline cache now" overrides the freshness hold for that requested refresh only. Reuse existing source/destination authorization when it covers the request; ask only for genuinely missing scope. The request does not waive network rate limits, cooldowns, tool-installation approval, or any no-network constraint. This skill update itself is not a request to fetch anything.

Stage an authorized fetch separately, validate a coherent complete manifest, and publish a new snapshot only after verification; retain the previous accepted snapshot. Do not mix an unverified partial refresh into it, automatically delete old caches, or change pins to hide a mismatch. Where shared work is possible, coordinate one acquisition and share its result/manifest rather than fetching the same assets in parallel. Record failed attempts separately without making old bytes appear newly downloaded.

## Prepare an isolated, version-matched runtime

Use existing supported capabilities to launch a disposable browser/JavaScript environment with no existing account/profile attachment. Supply approved cached resources locally and deny unexpected external I/O, navigation, workers, downloads and file pickers. Keep any browser storage inside the disposable environment. Do not access a live FilterBlade project, cloud save, PoE account or real game directory as part of offline testing. Preserve source inputs unchanged and write evidence to the approved output directory.

The tested frontend `1.1.6730` needed `filterblade.min.js`, its compatible `libs.min.js`, `BasetypeStorage.csv` and `economies.json`. Specific-item matching did not need the Customizer options file, upstream base-filter download, random-loot weighting or account data. Native project generation additionally requires its matching canonical base and full Customizer options; the match-only asset set cannot initialize that workflow. Resource paths and internal APIs are version-dependent; inspect the selected source rather than assuming this list or the snippets below fit another version. If another asset is needed, include it in fetch permission before requesting it.

Inspect the chosen runner before launching it: identify its executable paths, local dependencies, required DOM/browser APIs, all writable locations and any hidden fetch/install behavior. Reuse approved installed binaries and packages. Node is useful as a launcher but does not by itself provide a DOM-capable browser realm. An installed browser, usable runner, and valid asset cache are separate prerequisites; replacing the cache cannot repair a missing runtime. Use a fresh disposable profile in the approved task directory, deny external I/O throughout evaluation, and keep source/cache reads separate from scratch/output writes. If this boundary cannot be achieved with available tools, do not execute the offline engine.

No live account, login cookie, PoE API credential or model API is required for isolated matching. Do not copy personal profiles, enable browser-wide debugging, install an MCP server/extension, or invoke an on-demand package/browser downloader as an implicit setup step. Explain the exact missing tool/package, source, installation path and required configuration changes before requesting setup approval. After an approved setup, verify it locally; if declined or unsuccessful, report only the dependent checks as unrun and continue independent work. Leave unrelated sessions open and only clean up task-created processes/profile paths after verifying their identity and approved cleanup scope.

For native project generation, initialize the real canonical branch and selection under [complete editing](filterblade-complete.md). For export-only replay below, initialize native globals/modules and command tables, select PoE 1 with Custom branch metadata, and load the pinned CSV through native `RequestedFile`/`initItemCSV`. Do not use that Custom intake to rebuild an authentic project. Supply only environment/static-I/O boundaries; do not replace native parsing, matching or appearance algorithms with mocks. Disclose adaptations. The installed skill has no standalone offline runner: use an inspected available runner or prepare a bounded adapter in the approved workspace.

## Replay the exported filter without regenerating strictness

In `1.1.6730`, full `Filter.init()` includes strictness generation and header rewriting. It rejects the tested `2-SEMI-STRICT` export with `invalid default strictness`; a headerless standalone filter also fails. Selecting Custom metadata alone does not fix that low-level path. Do not alter the user's header or reapply strictness tags merely to make an existing export load.

With the native environment initialized, the tested export-intake adapter uses these unchanged native stages:

```javascript
const filter = new Filter(requestedFile, FileSelectionHandler.getParamsForFilterStrictnessGen());
gFilterBlade.filterData = filter;
filter.generateLines();
filter.generateEntries();
filter.analyzeComments();
filter.findCommentTags();
filter.buildEntryStyleLibrary();
filter.storeInitialValues();
filter.createStructureTree();
// Existing export: omit applyStrictness() and setStrictnessHeaderComment().
```

Preserve effective rule order, conditions, active/disabled state, appearance and comments. Establish an independent no-op preservation check before trusting results: compare ordered directives and rule identity across the source and a single native export, and check the original bytes/mtime remain unchanged. Limit any allowed formatting normalization explicitly; never discard all comments or compare only rule counts. Repeated native `compileFullText()` can mutate frozen-rule comment formatting in this version; use a fresh model for each preservation export and reparse for matching.

Resolve every `Import` dependency within the authorized scope or mark the test unsupported. The existing research runner rejects unresolved imports. An unresolved dependency or changed intake semantics cannot support a confident visibility verdict.

## Define the actual item and match it

Prefer explicit condition stats with separately stated area context. For example, in the initialized runtime:

```javascript
const item = new Item();
for (const [key, value] of Object.entries({
    BaseType: 'Astral Plate', Rarity: 'Rare', ItemLevel: 86,
    AreaLevel: 83, SocketGroup: 'R', Identified: 'False'
})) item.addStat(key, value);
item.addStaticStats();
const search = new FilterSearch(gFilterBlade.filterData, 'normal', false);
search.initSearchByItem(item);
const terminal = search.result[0];
const preview = new DefaultItemAppearanceVerifier(
    terminal, item, 0, search.continueResults.slice(), false
).getVerifiedValues();
```

- Use a physical Item without Customizer utility fields such as `itemTag`, `cName` or `searchMulti`. Tag lookup answers a different question. Construct the `FilterSearch` instance explicitly to retain both the terminal rule and `continueResults`.
- Specify relevant rarity, item/area levels, stack size, actual sockets/links, quality, identification, influence, corruption, fracture/synthesis, affixes and defense properties. Supply values in the chosen native version's format; examples use `"False"`, not a guessed boolean encoding, and `"RRRRRR"` for six linked red sockets. Spaces separate socket groups.
- Record explicit inputs and the final supplied stats. The native supplier fills defaults and CSV-derived base properties; these are assumptions, not observed rolls or affixes. If unknown relevant properties could change an earlier match, report an indeterminate result or test the relevant boundaries rather than claiming the real item is covered.
- Copied English item text can use `await ItemReCreator.parseItemString(text, areaLevel)`. In the tested version it chooses ItemLevel as AreaLevel when present, even if a different area argument was passed. Apply an explicit post-parse area override when the actual area is known, and record pre/post values. Missing sockets, rolled defenses and advanced-only properties also need explicit completion. Do not assume localized/ordinary copied text supplies all filterable properties.
- Include Continue/decorator matches and the native merged appearance. A terminal field overrides earlier Continue values; a missing terminal field can inherit from the latest matching Continue. The native appearance verifier reverses its Continue array argument, so pass a copy. Preserve raw and active/remover-filtered Continue collections when relevant.

Report terminal Show/Hide, no terminal match, native preview visibility, and effective appearance separately. In this snapshot a no-match preview defaults to Show, Quest Items have a preview exception, and a Show rule can have transparent text/border/background. None alone proves actual in-game visibility. Retain source line/header and tag as well as runtime ID; IDs are not stable across sessions.

For an appearance request, assert the requested fields on the final native merged preview, including Continue contributions, rather than using the winning rule's identity as a color test. An earlier rule can already produce the same requested colors/font. Report visibility, requested appearance, and rule/field provenance independently; a visibility-only test leaves appearance untested. Assert a particular winning rule only when that identity is itself an explicit requirement. If a true appearance mismatch remains, resolve the requested scope and competing protections before changing priority; do not promote a whole class merely to make a rule-ID check pass.

## Validate and report the evidence

Call native validation directly and inspect diagnostic records instead of relying on UI scheduling or a success string:

```javascript
gFilterBlade.notificationManager.newSession();
await global_VerifyAllFilterLines();
const syntaxMessages = gFilterBlade.notificationManager.getLastMessages(false, false);
gFilterBlade.notificationManager.newSession();
const valuableResult = verifyValuableItems();
const valuableMessages = gFilterBlade.notificationManager.getLastMessages(false, false);
```

`DownloadScreen.verifyFilter()` schedules work in a timer. `global_VerifyAllFilterLines()` returned `"testSuccess"` even when it logged errors. The tested validator detected unknown identifiers/bases, bad sound IDs and missing parameters, but **missed `SetFontSize 99` and `SetTextColor 999 0 0`**. Its valuable-item list is a fixed sample, not a live economy or complete equipment test. Affix validation can be skipped or initiate an unawaited dictionary request. Preserve browser warnings/errors as well as notification records, and retain independent target-specific syntax checks.

Validate the adapter with meaningful controls for the paths used: rule priority, disabled entries, numeric/stack boundaries, exact/substring base matching, sockets, Continue appearance and area context as applicable. The research snapshot passed 18 such controls and exercised 172 built-in valuable-item cases, but those counts are historical evidence, not a universal acceptance requirement for every test.

Save a reproducible receipt with filter/source hashes, runtime/data pins, cache acquisition timestamp/age and reuse/refresh decision, item inputs and expanded stats, relevant matched rule lines/conditions, raw and active Continue results, merged appearance, native/independent diagnostics, control outcomes, I/O ledger and source-preservation check. Report unsupported cases and unrun checks. Do not claim game-client validation, FilterBlade project recovery/save, current-league compatibility, sound-file availability or game activation from this offline result.
