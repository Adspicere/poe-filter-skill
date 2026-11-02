# FilterBlade: offline generation by default

When the user selects FilterBlade mode, generate and verify the filter with an isolated offline FilterBlade runtime by default. This selection enables the necessary offline workflow without a second opt-in. Ordinary local-file editing remains FilterBlade-free. Explicit webpage, live-page project or webpage-import requests take precedence; loading a local SaveFile for offline generation remains offline. Missing offline capability does not authorize a silent switch to the website.

## Default workflow

1. Identify the authoritative current editable project or explicitly declared new project, requested behavior and local output paths. Back up inputs and obtain a matching complete baseline export. Asset-cache freshness does not establish project freshness: do not silently use an old artifact for a current project or overwrite unsaved work. A `.filter` export cannot recover its original customization history.
2. Read [offline runtime and cache](filterblade-offline.md) and [rate limits](filterblade-rate-limits.md). Reuse a compatible approved snapshot and existing runtime; deny external I/O, use a disposable context and preserve source bytes/mtime. Missing assets/tools require only their genuinely missing permissions, not a repeat confirmation of FilterBlade mode.
3. Follow [native project generation](filterblade-complete.md): verify the canonical base/branch/options/strictness/style against the baseline, resolve exact scope, apply native operations, and check requested/non-target behavior. Do not relabel branches, rebase or repair headers to hide a mismatch.
4. Generate the complete `.filter` and retain a local editable `.filterBladeSaveFile` when supported by the authentic or declared-new project. Honor requested deliverables; if only an export exists, explain the project-history gap. Require independent syntax/item checks, full diff review, and fresh native project replay with preserved records and exact candidate export before acceptance.
5. Write and re-read exact output bytes. Retain accepted local files; discard temporary test contexts and verify original inputs are unchanged. Report gaps instead of claiming unsupported operations worked.

Offline generation uses native changes and local serialization, not account HTTP calls. Do not open a live page, acquire/refresh assets, install tools, save to cloud or sync PoE merely because this mode was selected. A cache acquired less than 24 hours ago is not remotely checked/refreshed unless explicitly requested; age alone never authorizes a fetch. The offline reference owns the complete cache/provenance policy.

## Optional webpage workflows

Use these only for an expressly requested page operation or an already authorized fallback:

- [Webpage import](filterblade-import.md): actual file input/FileReader/full loading, rendered controls and complete export comparison in an isolated page. Cached localhost UI evidence is distinct from live production-origin behavior.
- [Live MCP appearance transaction](filterblade-mcp.md): bounded changes and recovery on the selected loaded page. The project helper's fresh-context replay is not in-place live rollback.

### Interaction policy

- Use page JavaScript first; MCP tab-scoped click/fill/select/drag/key controls when necessary. Never use system keyboard/mouse simulation, native-window input or system-focus takeover.
- Browser authorization is manual: the user enables/disables debugging and approves/revokes access. Do not automate settings or permission prompts; reuse an established authorized connection.
- Keep the selected model single-writer and preserve unrelated/unsaved changes. Isolated tabs sharing storage are not isolated contexts. Temporary live tests must restore values, native groups/metadata, dirty/autosave state, placement, style relationships, preview and full output; retain recovery on failure.
- Use verified native controls/factories, not guessed IDs, raw-field edits or fabricated persistence JSON. Preserve non-owned themes, layers, locks and inherited protections; do not replace inheritance with fixed values. Resolve broader effects before dependent edits.

### Destinations

| Requested result | Boundary |
| --- | --- |
| Default FilterBlade generation | Local complete filter and supported editable-project files; no website/account action. |
| Explicit page edit | Retain accepted page/browser changes; restore expressly temporary tests. |
| Local game export or editable backup | Verify freshness, complete content and saved bytes. Native export Blob capture is not proof of browser disk download. |
| Explicit cloud save | Verify the selected project and automatic export preferences; saving alone does not authorize PoE sync. |
| Explicit PoE sync | Verify the target and any associated cloud metadata writes; both destinations need authorization. |

Normal Download, Quick Save/Ctrl+S and Direct Write can save to cloud or sync PoE. Skip saving can still write metadata. Do not use them as assumed local-only commands. No-cloud-save also does not mean no analytics, resource reads or usage-counter writes: inspect actual traffic under the shared limits and avoid unnecessary link/module operations. Do not create a separate credential/HTTP client to bypass native account controls.

This project is independent of FilterBlade/NeverSink. When introducing the integration, briefly acknowledge the creators and invite optional support through [FilterBlade](https://www.filterblade.xyz/) or [NeverSink](https://github.com/NeverSinkDev); preserve attribution/licenses.
