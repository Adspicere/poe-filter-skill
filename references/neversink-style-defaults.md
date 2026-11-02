# NeverSink-based style defaults

Profile: `NS-DEFAULT-1`. Verified: 2026-11-01. Game: PoE 1, normal mode.

Reference: NeverSink **8.20.2**, **2-SEMI-STRICT**, **DEFAULT** style, as identified by the [source file header](https://github.com/NeverSinkDev/NeverSink-Filter/blob/master/NeverSink%27s%20filter%20-%202-SEMI-STRICT.filter). The upstream branch can change. These stable local presets summarize selected appearance rules; they are not a full NeverSink filter or an economy snapshot. Upstream-derived values retain the [MIT notice](neversink-license.txt).

## Application policy

- Precedence: explicit user preference, applicable upstream/existing effective styling, then a preset for a missing property or new style. A single-property request preserves all other properties.
- Choose an established category/tier; labels describe appearance, not current prices or permanent item membership. Use H00 for a new unpriced highlight, or R01 for baseline equipment. Preserve accessibility choices and keep this local profile stable unless a refresh is requested.
- Presets affect presentation only. They do not change visibility, strictness, membership, conditions, or matching priority. For derived rules, use the [ownership and inheritance rules](customization-markers.md).

## Palette

Tokens below expand to four integer arguments for `SetTextColor`, `SetBorderColor`, or `SetBackgroundColor`. They are reference labels, not filter-language variables.

| Token | RGBA |
| --- | --- |
| WHITE | `255 255 255 255` |
| BLACK | `0 0 0 255` |
| RED | `255 0 0 255` |
| ORANGE | `240 90 35 255` |
| AMBER | `249 150 25 255` |
| GOLD | `213 159 0 255` |
| TAN | `210 178 135 255` |
| MUTED | `190 178 135 255` |
| DARK | `20 20 0 255` |
| UNIQUE | `175 96 37 255` |
| UNIQUE_DARK | `53 13 13 255` |
| TEAL | `30 190 190 255` |
| TEAL_DIM | `40 130 130 255` |
| MAP_LIGHT | `235 235 235 255` |
| MAP_MID | `200 200 200 255` |

## Presets

Column mapping: Size = `SetFontSize`; Text/Border/Background = the corresponding color actions; Alert = `PlayAlertSound ID Volume`; Beam = `PlayEffect`; Icon = `MinimapIcon Size Color Shape`.

### Currency appearance

These values follow upstream section `4000`, tiers `t1exalted` through `t8trans`, in order. Do not copy the source's item lists or hide decisions.

| ID | Role | Size | Text | Border | Background | Alert | Beam | Icon |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C01 | Jackpot | 45 | RED | RED | WHITE | `6 300` | `Red` | `0 Red Star` |
| C02 | High | 45 | WHITE | WHITE | ORANGE | `1 300` | `Red` | `0 Red Circle` |
| C03 | Valuable | 45 | BLACK | BLACK | ORANGE | `2 300` | `Yellow` | `1 Yellow Circle` |
| C04 | Standard | 45 | BLACK | BLACK | AMBER | `2 300` | `White` | `2 White Circle` |
| C05 | Basic | 45 | BLACK | BLACK | GOLD | `2 300` | `White` | `2 White Circle` |
| C06 | Lower | 45 | BLACK | BLACK | TAN | `2 300` | `Grey` | `2 Grey Circle` |
| C07 | Quiet | 45 | BLACK | BLACK | TAN | OFF | OFF | OFF |
| C08 | Subdued | 45 | MUTED | MUTED | DARK | OFF | OFF | OFF |

### Category appearance

U01/U02 follow section `4802`; U03 follows `multispecial`; U04 follows ordinary tier-3 unique appearance. Map rows follow section `3302`. G01/G02 follow section `3003`. R01 follows regular endgame rare appearance in section `2201`. KEEP/OFF retain omission semantics rather than inventing additional source directives.

| ID | Role | Size | Text | Border | Background | Alert | Beam | Icon |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| U01 | Established top unique tier | 45 | UNIQUE | UNIQUE | WHITE | `6 300` | `Red` | `0 Red Star` |
| U02 | Established high unique tier | 45 | WHITE | WHITE | UNIQUE | `1 300` | `Red` | `0 Yellow Star` |
| U03 | Known ambiguous shared unique base | 45 | BLACK | BLACK | UNIQUE | `2 300` | `Blue` | `1 Blue Star` |
| U04 | Established ordinary unique tier | 45 | UNIQUE | UNIQUE | UNIQUE_DARK | `3 300` | `Brown` | `2 Brown Star` |
| M01 | Ordinary maps, tier 14+ | 45 | BLACK | KEEP | MAP_LIGHT | `5 300` | `Yellow` | `1 Red Square` |
| M02 | Ordinary maps, tiers 11-13 | 45 | BLACK | KEEP | MAP_MID | `5 300` | `Yellow` | `1 Red Square` |
| M03 | Ordinary maps, tiers 6-10 | 45 | WHITE | KEEP | DARK | `4 300` | `White` | `1 Yellow Square` |
| M04 | Ordinary maps, tiers 1-5 | 45 | WHITE | KEEP | DARK | `4 300` | `White` | `2 White Square` |
| G01 | Established useful gem tier | 45 | TEAL | TEAL | KEEP | `2 300` | `Grey` | `1 White Triangle` |
| G02 | Established routine gem tier | 45 | TEAL | TEAL_DIM | KEEP | OFF | `Grey Temp` | `1 Grey Triangle` |
| R01 | Baseline equipment | 40 | KEEP | KEEP | DARK | OFF | OFF | OFF |

H00 is a **local adaptation**, not an upstream tier or price signal. It gives an unpriced custom target a visible label, a temporary beam, and a neutral marker without adding an alert.

| ID | Role | Size | Text | Border | Background | Alert | Beam | Icon |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| H00 | Unpriced custom highlight | 45 | WHITE | WHITE | DARK | OFF | `White Temp` | `1 White Diamond` |

## Usage constraints

- Palette tokens, KEEP, and OFF are reference conventions, not filter syntax. Expand colors to numeric arguments. KEEP/OFF preserve inherited or user settings; omission in a new independent style leaves the default or adds no effect. Removing an existing effect requires the corresponding user intent.
- Label size does not change font family; use documented actions rather than inventing font, bold, or blinking directives.
- Preserve custom audio and volume preferences. A custom alert can mask a built-in alert; resolve effective sound behavior within the request. Muting a filter alert does not imply disabling the ordinary drop sound. Built-in IDs are neither a loudness ranking nor guaranteed musical names.
- Preserve map-progression and special-map exceptions. Generic map rows do not classify unique/special maps, and an unidentified shared base does not identify a unique item.
- Check action arguments against the target's official constraints. Report a preset ID when used and any deviations; the [shared completion policy](../SKILL.md) governs validation claims.
