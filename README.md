# PoE Filter Skill

[English](README.md) | [简体中文](README.zh-CN.md)

A Codex skill for editing Path of Exile 1 loot filters, preserving customizations, verifying changes, and recording accepted files with Git.

Current skill version: **0.2.2**. Read [SKILL.md](SKILL.md) for the complete workflow and boundaries.

## Capabilities

- Edit local `.filter` files while preserving unrelated rules, comments, sounds, and formatting.
- Preserve owned customizations during explicitly requested upstream updates.
- Create independent local derivatives from read-only `OnlineFilters` inputs.
- Check syntax with a bundled, read-only Python script and verify rule behavior separately.
- Use optional FilterBlade workflows for native editable projects, offline generation, and explicitly selected webpage operations.
- Record accepted local filter changes in Git with explicit file selection.

This skill targets **PoE 1**. Ruthless requires explicit selection and compatible rules. PoE 2 and writes to online filter caches are outside its scope.

FilterBlade is optional for ordinary local editing. Selecting FilterBlade generation defaults to offline work using compatible, approved assets. Website assets, browser runtimes, and MCP dependencies are not bundled or installed automatically. Cloud saves and PoE synchronization are separate destinations.

## Installation

Clone this repository as the `poe-filter` folder in your personal skills directory. For the existing Windows setup using `~/.agents/skills`:

```powershell
git clone https://github.com/WhiT-Eboard/poe-filter-skill.git "$env:USERPROFILE\.agents\skills\poe-filter"
```

If that destination already exists, review it before updating or replacing it. You can also copy this repository's files into a `poe-filter` skill folder, keeping `SKILL.md`, `agents`, `references`, and `scripts` together. Restart Codex if the skill does not appear.

## Usage

Invoke `$poe-filter` and describe the target file, desired behavior, game mode, and output destination. Examples:

```text
Use $poe-filter to review my local filter and explain which rules hide rare rings.

Use $poe-filter to increase the font size of currency stacks of at least 10
in my local PoE 1 filter. Preserve all unrelated behavior and verify the boundaries.

Use $poe-filter in FilterBlade mode to generate a local filter and an editable
project from my approved cached assets. Verify both outputs through fresh replay.
```

For a filter edit, provide the relevant paths and PoE 1 patch or league context. The skill checks scope and compatibility, protects existing content, validates a candidate, and records accepted local changes when Git is available. Reload or select the saved filter in the game to activate it.

## Requirements and syntax preflight

Ordinary editing uses the agent's file tools. Git supports local history; **Python 3.11+** runs the bundled syntax checker. The checker uses only the Python standard library and needs no model API, project checkout, or network access.

Run from this repository or the installed skill folder:

```powershell
python scripts/check_filter.py "C:\path\to\MyFilter.filter" --json
```

Add `--mode ruthless` only for a selected Ruthless filter. The checker does not modify its input. Exit codes are `0` for valid within its profile, `1` for invalid, `2` for unreadable input or usage errors, and `3` for incomplete coverage.

A syntax pass does not establish correct item matching, rule priority, imported-file availability, or game-client acceptance. See [checker coverage and limitations](references/syntax-checker.md).

## Repository contents

| Path | Purpose |
| --- | --- |
| [SKILL.md](SKILL.md) | Skill entry point, mode selection, scope, verification, and Git workflow |
| [agents/openai.yaml](agents/openai.yaml) | Skill display metadata and default prompt |
| [references](references/) | Focused guidance for rules, customization ownership, syntax, and FilterBlade modes |
| [scripts/check_filter.py](scripts/check_filter.py) | Standalone, read-only PoE 1 syntax preflight |
| [scripts/filterblade_page.js](scripts/filterblade_page.js) | Optional helper for supported FilterBlade page operations |
| [scripts/filterblade_project.js](scripts/filterblade_project.js) | Optional helper for compatible native FilterBlade project operations |

This Git repository tracks the standalone skill, its documentation, and repository metadata. Development prototypes, research artifacts, downloaded website assets, and generated filters are excluded. Helper compatibility and operational limits are documented in the corresponding [FilterBlade references](references/filterblade.md).

## License and attribution

This project is licensed under the [MIT License](LICENSE). The NeverSink-derived style reference retains its separate [MIT notice](references/neversink-license.txt).

This is an independent project, unaffiliated with FilterBlade, NeverSink, or their teams. Please consider supporting their work through the [official FilterBlade website](https://www.filterblade.xyz/) or [NeverSink's profile](https://github.com/NeverSinkDev).
