"""Read-only PoE 1 syntax preflight. This module also runs as a standalone script."""

from __future__ import annotations

import argparse
from dataclasses import dataclass
import json
from pathlib import Path
import re
import sys


VERIFIED = "2026-11-01"
SOURCE = "https://www.pathofexile.com/item-filter/about"
NUMERIC = set("AreaLevel ItemLevel DropLevel Quality StackSize LinkedSockets MapTier GemLevel Width Height BaseArmour BaseEnergyShield BaseEvasion BaseWard BaseDefencePercentile EnchantmentPassiveNum CorruptedMods MemoryStrands HasEaterOfWorldsImplicit HasSearingExarchImplicit".split())
BOOLEAN = set("AlternateQuality AnyEnchantment BlightedMap Corrupted ElderItem ElderMap Exceptional Foulborn FracturedItem HasCruciblePassiveTree HasImplicitMod Identified Imbued MirageMap Mirrored Replica Scourged ShapedMap ShaperItem SynthesisedItem UberBlightedMap Vestigial ZanaMemory".split())
NAMES = set("BaseType Class ArchnemesisMod EnchantmentPassiveNode".split())
POE2 = set("AlwaysShow HasVaalUniqueMod IsVaalUnique TwiceCorrupted UnidentifiedItemTier WaystoneTier".split())
COLORS = set("Red Green Blue Brown White Yellow Cyan Grey Orange Pink Purple".split())
SHAPES = set("Circle Diamond Hexagon Square Star Triangle Cross Moon Raindrop Kite Pentagon UpsideDownHouse".split())
INFLUENCES = set("Shaper Elder Crusader Hunter Redeemer Warlord None".split())
RARITIES = set("Normal Magic Rare Unique".split())
FLAGS = set("DisableDropSound EnableDropSound DisableDropSoundIfAlertSound EnableDropSoundIfAlertSound".split())
OPERATORS = {"=", "==", "!", "!=", "<", "<=", ">", ">="}
EQUALITY = {"=", "==", "!", "!="}
UNCHECKED = ["Item, class and modifier name existence", "Imported filter contents and file existence", "Custom sound file existence", "Rule priority, reachability and item matching", "Game-client loading"]


@dataclass(frozen=True)
class Token:
    value: str
    quoted: bool
    column: int


class LexError(ValueError):
    def __init__(self, message: str, column: int):
        super().__init__(message)
        self.column = column


def lex(line: str) -> list[Token]:
    """Keep quoted values distinct; backslashes in Windows paths are literal."""
    result = []
    index = 0
    while index < len(line):
        char = line[index]
        if char in " \t":
            index += 1
            continue
        if char == "#":
            break
        start = index
        if char == '"':
            index = line.find('"', start + 1)
            if index < 0:
                raise LexError("Unterminated quoted value.", start + 1)
            result.append(Token(line[start + 1:index], True, start + 1))
            index += 1
            if index < len(line) and line[index] not in " \t#":
                raise LexError("Expected whitespace after a quoted value.", index + 1)
        elif char in "<>=!":
            index += 1
            if index < len(line) and line[index] == "=":
                index += 1
            result.append(Token(line[start:index], False, start + 1))
        else:
            while index < len(line) and line[index] not in ' \t#<>=!"':
                index += 1
            if index < len(line) and line[index] == '"':
                raise LexError("Unexpected quote inside an unquoted value.", index + 1)
            result.append(Token(line[start:index], False, start + 1))
    return result


def integer(token: Token, low: int | None = None, high: int | None = None) -> bool:
    if token.quoted or not re.fullmatch(r"[+-]?[0-9]+", token.value):
        return False
    # Avoid conversion limits or excessive work for pathological numeric tokens.
    digits = token.value.lstrip("+-").lstrip("0") or "0"
    if len(digits) > 18:
        return low is None and high is None
    value = int(digits) * (-1 if token.value.startswith("-") else 1)
    return (low is None or value >= low) and (high is None or value <= high)


def arguments(tokens: list[Token]) -> tuple[str | None, list[Token]]:
    if tokens and not tokens[0].quoted and tokens[0].value in OPERATORS:
        return tokens[0].value, tokens[1:]
    return None, tokens


def is_name(token: Token) -> bool:
    return bool(token.value) and (token.quoted or token.value not in OPERATORS)


def check_directive(key: str, args: list[Token]) -> tuple[str, str] | None:
    """Return an error or unsupported diagnostic; None means recognized syntax."""
    op, values = arguments(args)
    if key in POE2:
        return "error", f"{key} is PoE 2 only; this checker targets PoE 1."
    if key == "GemQualityType":
        return "error", "GemQualityType is marked Deleted in the official reference."
    if key in NUMERIC:
        valid = bool(values) and all(integer(value) for value in values)
    elif key in BOOLEAN:
        valid = len(args) == 1 and not args[0].quoted and args[0].value in {"True", "False"}
    elif key in NAMES:
        valid = op in EQUALITY | {None} and bool(values) and all(is_name(value) for value in values)
    elif key == "HasInfluence":
        valid = op in EQUALITY | {None} and bool(values) and all(value.value in INFLUENCES for value in values)
    elif key == "Rarity":
        valid = bool(values) and all(value.value in RARITIES for value in values)
    elif key in {"HasExplicitMod", "HasEnchantment"}:
        # Counted name conditions accept compact forms such as >=2 "of Haast".
        if values and integer(values[0]):
            names = values[1:]
            valid = all(is_name(value) for value in names)
            if not names and key == "HasExplicitMod":
                return "unsupported", "A HasExplicitMod count without modifier names is not verified by this checker."
        else:
            valid = op in EQUALITY | {None} and bool(values) and all(is_name(value) for value in values)
    elif key == "TransfiguredGem":
        valid = op is None and bool(args) and all(is_name(value) for value in args)
    elif key in {"Sockets", "SocketGroup"}:
        valid = bool(values) and all(re.fullmatch(r"(?:[0-6]|[0-6]?[RGBWAD]+)", value.value) for value in values)
    elif key == "Continue":
        valid = not args
    elif key in FLAGS:
        # Boolean suffixes occur in NeverSink exports in addition to bare flags.
        valid = not args or (len(args) == 1 and not args[0].quoted and args[0].value in {"True", "False"})
    elif key in {"SetTextColor", "SetBorderColor", "SetBackgroundColor"}:
        valid = len(args) in {3, 4} and all(integer(value, 0, 255) for value in args)
    elif key == "SetFontSize":
        valid = len(args) == 1 and integer(args[0], 1, 45)
    elif key in {"PlayAlertSound", "PlayAlertSoundPositional"}:
        if args and not args[0].quoted and args[0].value.startswith("Sh"):
            return "unsupported", "Named built-in sound IDs are not verified by this checker."
        valid = len(args) in {1, 2} and (integer(args[0], 1, 16) or (not args[0].quoted and args[0].value == "None")) and (len(args) == 1 or integer(args[1], 0, 300))
    elif key in {"CustomAlertSound", "CustomAlertSoundOptional"}:
        valid = len(args) in {1, 2} and args[0].quoted and bool(args[0].value) and (len(args) == 1 or integer(args[1], 0, 300))
    elif key == "PlayEffect":
        valid = bool(args) and not any(value.quoted for value in args) and (args[0].value == "None" and len(args) == 1 or args[0].value in COLORS and (len(args) == 1 or len(args) == 2 and args[1].value == "Temp"))
    elif key == "MinimapIcon":
        valid = not any(value.quoted for value in args) and (len(args) == 1 and args[0].value == "-1" or len(args) == 3 and integer(args[0], 0, 2) and args[1].value in COLORS and args[2].value in SHAPES)
    else:
        return "unsupported", f"Unknown or unsupported keyword: {key}. Verify current official syntax before accepting it."
    if not valid:
        return "error", f"Invalid arguments for {key}."
    return None


def check_text(text: str, *, mode: str = "normal", source: str = "<text>") -> dict:
    if mode not in {"normal", "ruthless"}:
        raise ValueError("mode must be normal or ruthless")
    issues = []
    blocks = imports = 0
    in_block = False

    def issue(line: int, column: int, severity: str, code: str, message: str) -> None:
        issues.append({"file": source, "line": line, "column": column, "severity": severity, "code": code, "message": message})

    for number, line in enumerate(text.removeprefix("\ufeff").split("\n"), 1):
        line = line.removesuffix("\r")
        bad = next((index for index, char in enumerate(line, 1) if ord(char) < 32 and char != "\t"), None)
        if bad is not None:
            issue(number, bad, "error", "control_character", "Unexpected control character.")
            continue
        try:
            parts = lex(line)
        except LexError as exc:
            issue(number, exc.column, "error", "tokenization", str(exc))
            continue
        if not parts:
            continue
        head, args = parts[0], parts[1:]
        key = head.value
        if head.quoted:
            issue(number, head.column, "error", "keyword", "Keywords must not be quoted.")
            continue
        if key in {"Show", "Hide", "Minimal"}:
            in_block = True
            blocks += 1
            if args:
                issue(number, head.column, "error", "block_arguments", f"{key} does not take arguments.")
            if mode == "normal" and key == "Minimal" or mode == "ruthless" and key == "Hide":
                issue(number, head.column, "error", "mode", f"{key} is not valid in {mode} mode.")
            continue
        if key == "Import":
            in_block = False
            imports += 1
            if not (len(args) in {1, 2} and args[0].quoted and args[0].value and (len(args) == 1 or args[1].value == "Optional" and not args[1].quoted)):
                issue(number, head.column, "error", "import_arguments", 'Expected Import "filename.filter" [Optional].')
            continue
        if not in_block:
            issue(number, head.column, "error", "outside_block", "Condition or action outside a Show/Hide/Minimal block.")
            continue
        diagnostic = check_directive(key, args)
        if diagnostic:
            severity, message = diagnostic
            issue(number, head.column, severity, "unsupported" if severity == "unsupported" else "arguments", message)
        elif mode == "ruthless" and key == "SetTextColor" and len(args) == 4 and int(args[3].value) < 80:
            issue(number, args[3].column, "error", "ruthless_alpha", "Ruthless text alpha must be at least 80.")
    errors = sum(item["severity"] == "error" for item in issues)
    unsupported = sum(item["severity"] == "unsupported" for item in issues)
    status = "invalid" if errors else "incomplete" if unsupported else "valid"
    return {"status": status, "valid": status == "valid", "profile": "poe1-" + mode, "verified": VERIFIED,
            "source": SOURCE, "file": source, "rules": blocks, "imports": imports,
            "errors": errors, "unsupported": unsupported, "issues": issues, "unchecked": UNCHECKED,
            "scope": "Supported file syntax only; not a game-client validation or priority check."}


def main(argv: list[str] | None = None) -> int:
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure") and not stream.isatty():
            stream.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Read-only syntax check for a PoE 1 filter.")
    parser.add_argument("path", type=Path)
    parser.add_argument("--mode", choices=("normal", "ruthless"), default="normal")
    parser.add_argument("--json", action="store_true", help="Print machine-readable diagnostics.")
    args = parser.parse_args(argv)
    try:
        text = args.path.read_bytes().decode("utf-8-sig")
    except (OSError, UnicodeError) as exc:
        result = {"status": "unreadable", "valid": False, "file": str(args.path), "message": str(exc)}
        print(json.dumps(result, ensure_ascii=False) if args.json else f"UNREADABLE: {args.path}: {exc}")
        return 2
    result = check_text(text, mode=args.mode, source=str(args.path))
    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(f"{result['status'].upper()}: {args.path} ({result['rules']} rules, {result['errors']} errors, {result['unsupported']} unsupported)")
        for entry in result["issues"]:
            print(f"{entry['file']}:{entry['line']}:{entry['column']}: {entry['severity'].upper()}: {entry['message']}")
        if result["imports"]:
            print("NOTE: Import statements were checked; referenced files were not opened.")
        print(result["scope"])
    return {"valid": 0, "invalid": 1, "incomplete": 3}[result["status"]]


if __name__ == "__main__":
    raise SystemExit(main())
