# Read-only OnlineFilters upstream

Use only for a requested local derivation or sync. Apply the shared [directory permissions, toolchain, Git, and publication rules](../SKILL.md) before source discovery or other dependent access, and use the [ownership acceptance criteria](customization-markers.md).

## Source and immutability

- Locate the actual PoE 1 user directory; Documents can be redirected. The common Windows suffix is `My Games/Path of Exile/OnlineFilters`; cache names need not end in .filter.
- Select by the requested identity, name, realm, mode, strictness, and provenance, not modification time alone. Ask if multiple sources remain plausible. Missing caches require a client-downloaded source or export; this task does not authorize forcing game downloads or scraping internal APIs.
- Confirm target compatibility through the [versioned rules](versioned-rules-cache.md). Snapshot metadata does not prove client version, current economy, or latest online state.
- Treat the cache as strictly read-only. Targets, candidates, archives, backups, and Git metadata must resolve outside OnlineFilters and must not alias cache entries through symlinks, junctions, or hard links. Do not normalize, rename, delete, lock, change permissions, repair metadata, or restore into the cache.
- Capture stable bytes and compare source fingerprints around capture; the archive must match the captured bytes. Use bounded retries for concurrent source changes; if no stable capture is possible, keep the accepted local filter. Never write to the cache to restore a fingerprint.

Observed samples reviewed on 2026-11-01 were UTF-8 text with a `#Online Item Filter` envelope, metadata comments, and ordinary filter rules. This is not a public format contract. Inspect unfamiliar headers; a cache-provided hash is separate from locally computed SHA-256.

## Independent local output

Archive the exact raw header and body outside the cache, by default:

```text
.filteragent/upstream/poe1/CACHE_ID/REVISION/source.filter
```

Reuse a verified identical snapshot or create a distinct revision; never overwrite earlier snapshots. This source archive is separate from the official rule-document cache.

Build a candidate for the explicitly identified local .filter target. Remove only the recognized cache envelope in the derivative; retain ordinary upstream comments, attribution, rule behavior, encoding, and line endings except for requested changes. Record English provenance: cache/source identity, archive path and SHA-256, observed upstream revision/date, target patch/mode, and derivation time. Do not impersonate a managed online cache or retain stale cache-validation claims.

Use the archived previous upstream and accepted local filter as merge context under the ownership reference. Check imported filters and relative audio dependencies in the destination context; moving text does not supply those files.

## Acceptance and recording

Publish only after the shared acceptance requirements are satisfied. Track the accepted target and selected raw snapshot with explicit Git paths when available; excluded paths and fallback behavior are defined in the main skill.

Report source identity, captured hash/archive, observed age, retained IDs, actual checks, and save/commit outcome. Recheck source fingerprints for the report; distinguish legitimate client updates from agent writes rather than trying to undo them. Do not claim cache immutability from a single earlier hash.

A later cache update does not change the selected snapshot or trigger another sync. The user must select/reload the independent local file for its customizations to apply. This operation does not update GGG account filters, FilterBlade saves, game settings, or schedules.
