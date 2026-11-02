# Official filter constraints

Source: [GGG](https://www.pathofexile.com/item-filter/about). Verified: 2026-11-01.
Profile: PoE 1 core summary, not an exhaustive or patch-specific grammar. Confirm target applicability through [versioned-rules-cache.md](versioned-rules-cache.md); verified target-specific GGG rules take precedence over this dated summary.

| ID | Constraint |
| --- | --- |
| F01 | Normal blocks: `Show`/`Hide`. Ruthless uses `Show`/`Minimal`; `Hide` is normal-only. |
| F02 | Evaluate blocks top to bottom; conditions within a block all must match. Stop on a matching block unless `Continue` is present; later matches can override earlier effects. |
| F03 | Operators: `=` equality; `!`/`!=` inequality; `<`, `<=`, `>`, `>=` comparisons; `==` exact matching. |
| F04 | Numeric examples: `ItemLevel`, `AreaLevel`, `DropLevel`, `Quality`, `StackSize`. Boolean examples: `Identified`, `Corrupted`, `Mirrored`: `True`/`False`. |
| F05 | `Rarity`: `Normal`, `Magic`, `Rare`, `Unique`. `BaseType`/`Class`: documented names. |
| F06 | `SetFontSize`: 1–45. `SetTextColor`/`SetBorderColor`/`SetBackgroundColor`: RGB[A], channels 0–255; default alpha 255/255/240 respectively. Ruthless text alpha >=80. |
| F07 | `PlayAlertSound`/`PlayAlertSoundPositional`: ID 1–16, volume 0–300 (default 50); disable: `None`. |
| F08 | `CustomAlertSound`: quoted filename/path, optional volume 0–300 (default 100); overrides built-in alerts. `CustomAlertSoundOptional`: missing files leave built-in alerts unchanged. |
| F09 | `MinimapIcon`: size 0–2, documented color/shape; disable: -1. `PlayEffect`: documented color, optional `Temp`; disable: `None`. |
| F10 | `Import` includes another filter; trailing `Optional` tolerates absence. |
| F11 | Exclude PoE2-only and Deleted entries. Recheck unfamiliar, New, or Updated entries online before use. |

Verify omitted enums and specialized conditions at the source.
