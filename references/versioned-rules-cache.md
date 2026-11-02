# Target version and rule cache

Confirm the intended PoE 1 patch, league/release context, and normal/Ruthless mode before a filter edit or upstream sync. Include platform/realm when release timing differs. Headers and NeverSink versions describe the file; they do not prove the installed client version. An announced release is not automatically the target. Resolve uncertain applicability using the [knowledge policy](../SKILL.md) before dependent edits.

## Authority

| Source | Role |
| --- | --- |
| [GGG filter syntax](https://www.pathofexile.com/item-filter/about) | Authoritative grammar, conditions, actions, and limits applicable to the target. |
| Corresponding GGG Item Filter Information announcement, corrections, and patch notes | Authoritative seasonal changes and release applicability. Resolve and record the actual target's verified URLs. |
| [RePoE repository](https://github.com/repoe-fork/repoe) and [data index](https://repoe-fork.github.io/) | Supplementary item/category data only, with independently verified game/patch and immutable source revision. |
| [GGG export documentation](https://www.pathofexile.com/developer/docs/data) | Describes official export scope; an export or GitHub repository is not automatically a filter grammar. |

Use GGG syntax together with the corresponding announcement and applicable corrections. Announcements describe changes, not a complete grammar; the live syntax page can contain later-patch or PoE 2 entries. Verify historical applicability rather than substituting the newest documentation. Read actual official content, including relevant expanded sections; search snippets and community exports cannot resolve conflicting official evidence.

RePoE must not override GGG or establish undocumented syntax. Distinguish internal IDs from filter-facing names. A current branch, commit date, or download date does not establish dataset compatibility. Do not assume a versioned GGG GitHub filter schema exists; verify any linked file's purpose and target before using it.

## Local cache contract

Reuse a suitable project cache location, otherwise use the target filter repository/directory:

```text
.filteragent/rules/poe1/PATCH/MODE/REVISION/
    metadata.json
    rules.md
    sources/ggg/
    sources/repoe/
```

Keep patches, modes, and changed source revisions separate; add a platform discriminator if needed. Use a timestamp/content digest or another distinct revision identifier. Retain prior verified revisions and keep runtime caches outside the installed skill. Create `sources/repoe/` only when consulted.

- **metadata.json:** target game/patch, league/release context, mode, relevant platform, live/pre-release status and evidence; source authority, URLs, dates when known, retrieval/last-verification times, local paths and SHA-256 hashes; normalized-rules hash, coverage gaps, and verification status. Record RePoE's immutable revision and declared dataset game/patch separately. Use null for unknown data; optional supplement verification is independent of official verification.
- **sources/ggg/:** actual official source snapshots or faithful, labeled excerpts with section boundaries. Preserve source wording as data, exclude unrelated replies, and identify partial captures. URLs alone are not cached rule content.
- **sources/repoe/:** only consulted supplementary files, pinned to a target-compatible revision with separate provenance. Unverified supplements must not support dependent edits.
- **rules.md:** English normalized constraints with stable IDs, target applicability, relevant syntax/parameter and seasonal name changes, source/section mappings, and explicit gaps. Reuse applicable F01-F11 IDs; label additional seasonal constraints and community notes separately. Do not present a partial summary as the complete grammar.

Before dependent edits, verify the source snapshots, hashes, and normalized rules. A revision is verified only when its target applicability and local artifacts are established. Missing or conflicting evidence blocks changes depending on it; preserve the last verified cache.

## Reuse and scope

Check matching official sources for revisions before reusing a cache. Unchanged content can reuse its revision with an updated verification time; changed content receives a new revision. If sources cannot be reached, disclose the freshness limit and do not proceed where applicable rules remain uncertain.

Read the matching cached constraints when preparing changes. Cache creation does not authorize filter edits, upstream refreshes, checker changes, or software installation. Read-only requests create no cache unless explicitly requested; preparation-only caching may use the requested workspace.

Rule-document caches are excluded from default filter commits under the [Git policy](../SKILL.md); do not alter ignore rules merely to enforce this. Report the selected target and cache path. The checker has a separate, fixed profile; see [its coverage rules](syntax-checker.md).
