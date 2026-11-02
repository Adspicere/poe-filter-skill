# Customization ownership and acceptance

These English comments identify custom intent inside the filter. They are an agent convention, not executable metadata or protection against external overwrites.

## Marker contract

Use paired, non-overlapping boundaries with unique stable IDs:

```text
# FILTERAGENT CUSTOM BEGIN id=STABLE_ID kind=rule
# FILTERAGENT CUSTOM END id=STABLE_ID
```

- `kind=rule`: surrounds complete custom rules or related contiguous rules.
- `kind=field`: surrounds only owned directives inside a rule. The completed rule must have the intended scope.
- Update existing IDs instead of duplicating overrides. For multiple separate parts, retain the existing ID on one part, assign distinct IDs to additional parts, and use a shared `Group`. The combined scopes must preserve the original intent; IDs must never appear twice.

Record inside each boundary:

| Field | Meaning |
| --- | --- |
| Intent | User-requested behavior, in English. |
| Owns | Explicitly user-controlled directives. Include visibility or conditions only when intentionally overridden. |
| Scope | Canonical target selectors and user-requested bounds/exclusions. Upstream-only guards are inherited, not frozen user preferences. |
| Inherits | Properties supplied by the applicable base, except those owned by another applicable customization. |
| Expect | Effective outcomes for owned properties only. Do not pin inherited values. |
| Group | Optional association between parts of one customization. |

The boundary kind describes placement, not ownership of every directive inside it. In a derived rule, copied visibility, conditions, colors, sounds, and other support settings remain inherited unless explicitly owned. A field edit to a shared rule must not change excluded items; use a narrow derived rule or split when necessary.

Applicable customizations compose: inheritance must not erase another customization's owned fields. If overlapping scopes demand incompatible values for the same property, establish the user's intended precedence or ask before publication; keep Scope and Expect consistent with that precedence.

## Merge principles

- Use the previous uncustomized upstream, accepted local filter, and new upstream as evidence of user intent and upstream changes. Recover unmarked ownership or missing provenance from snapshots and path-limited history where possible; unexplained local changes are not automatically upstream defaults.
- Replay `Owns` only within `Scope`. Refresh `Inherits` from the new upstream's effective behavior, including visibility and economy tier. Style-only requests do not acquire visibility ownership.
- Map by canonical selectors and matching behavior. Line numbers, tags, and text similarity are clues, not sufficient identity. Moved, renamed, split, or shared rules may need a different representation while preserving the intended scope and exclusions.
- If ownership, scope, or mapping remains uncertain after investigation, ask the user before dependent replay or publication. Do not guess, widen scope, silently drop intent, or publish a partial sync while that question is unresolved.
- Git supports comparison and recovery; semantic replay does not require rewriting Git history or authorize rebasing a branch.

## Acceptance criteria

Apply these criteria to changed customizations and all retained customizations during a sync:

- **Identity:** Every prior intent is accounted for by stable IDs and any explicit Group mapping. Boundaries are valid, and intent, ownership, scope, and expectations remain established. Removal requires the user's request.
- **Matching:** Trace representative targets and relevant area, stack, rarity, and item-level boundaries through earlier rules, imports where present, `Continue`, and the final effective match. Custom behavior must be reachable and survive later overrides.
- **Outcomes:** Effective owned properties satisfy `Expect` throughout their scope, accounting for established precedence among applicable customizations. Owned visibility overrides defeat applicable upstream hiding.
- **Inheritance:** Ordinary edits preserve current effective non-owned behavior. A sync refreshes inherited properties from the new base while preserving other applicable customizations. Excluded/nearby items retain expected behavior and protections.
- **Diff:** Differences against the accepted local file and, during a sync, the new upstream are explained by requested or inherited changes.

## Publication

Keep upstream download destinations separate from the active customized file; markers cannot prevent an external overwrite. The [shared publication and Git rules](../SKILL.md) govern candidate isolation, recoverable baselines, preservation on failed acceptance, and recording. Report affected IDs and missing evidence or user decisions rather than claiming an unresolved sync is complete.
