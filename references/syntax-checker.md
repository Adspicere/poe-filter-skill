# Quick syntax checker

Follow the [toolchain policy](../SKILL.md). With Python 3.11+ available, run on the actual candidate:

```text
python SKILL_DIR/scripts/check_filter.py FILTER_PATH --json
```

Substitute the installed directory and detected interpreter. Default mode is normal; append `--mode ruthless` only for a selected Ruthless filter. No third-party packages, Git, network, or project checkout are needed. The script reads UTF-8 with optional BOM and never modifies the file or opens dependencies.

## Coverage

The complete file is scanned with original line/column diagnostics: block headers, directive placement, mode restrictions, comments/quoting, Import arguments, known conditions/operators, supported argument forms, enums, numeric limits, sockets, and presentation directives. Repeated numeric bounds are permitted. Unknown keywords or unverified forms produce an incomplete result.

Item/class/modifier name existence, imported contents, external file availability, priority, reachability, requested outcomes, and game-client loading are not checked. Inspect dependencies separately when relevant. The checker is a preflight, not a full GGG compiler or semantic validator.

## Results and acceptance

| Exit | Status | Meaning |
| --- | --- | --- |
| 0 | valid | No errors or unsupported forms within the declared profile. |
| 1 | invalid | Structural, compatibility, or argument errors detected. |
| 2 | unreadable / usage error | Input/encoding or command usage failed. |
| 3 | incomplete | Unsupported keywords or unverified forms prevent a complete result. |

JSON reports status, profile/review date, rule/import counts, issues, and unchecked scope. Issues include file, line, column, severity, code, and message.

Only exit 0 permits reporting that this checker passed. Correct actual syntax errors before publication. For a coverage gap, verify the construct against the target's cached GGG rules or actual client validation; an independently resolved gap does not turn exit 3 into a checker pass. An unresolved gap blocks dependent publication. If Python is unavailable, skip invocation and disclose it; absence of a checker result is not evidence of invalid syntax.

The profile was reviewed on 2026-11-01 against the [official reference](https://www.pathofexile.com/item-filter/about), with compatible drop-sound flag forms observed in NeverSink exports. This date is not a supported patch. The checker does not load the rule cache or update automatically. Establish target-version compatibility separately and apply the [customization acceptance criteria](customization-markers.md).
