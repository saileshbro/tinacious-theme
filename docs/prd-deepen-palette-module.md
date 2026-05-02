# PRD: Deepen the Palette Module

## Problem Statement

As a theme maintainer, every time a new platform builder is added, the same structural boilerplate must be copied across: directory creation, file writing, and a double-loop over the 16 ANSI color slots. This boilerplate is repeated across all five existing builders and obscures the format logic — the only part that is genuinely platform-specific.

Additionally, all platform builders that emit one file per variant reach into `variant.warp.fileBase` to name their output files. Warp metadata is being used as the identity of the variant across every platform. If the Warp builder is ever removed or the `warp` key is restructured, Ghostty and OpenCode silently break.

## Solution

Deepen the palette library module so that each builder only needs to contain its format logic. Two new functions cover the shared structural work:

- **`ansiPairs(terminal)`** — takes a variant's terminal color set and returns a flat, ordered array of `{ key, index, normal, bright }` objects, eliminating the double ANSI loop from every builder that handles terminal colors.
- **`writeDistFile(platform, filename, content)`** — takes a platform name, output filename, and content string; handles directory creation and writing. Builders stop owning file I/O entirely.

Separately, each variant in the palette schema gains a top-level `outputBase` field — the shared filename stem used by all platform builders. The `warp.fileBase` field is removed.

## User Stories

1. As a theme maintainer, I want ANSI color iteration encapsulated in the palette library, so that I don't have to remember to loop over normal and bright separately when writing a new builder.
2. As a theme maintainer, I want file writing encapsulated in the palette library, so that a new builder only needs to call one function to emit its output file.
3. As a theme maintainer, I want each variant to declare its own output filename stem, so that no platform builder depends on another platform's metadata.
4. As a theme maintainer, I want to add a new platform builder by writing only the format logic, so that the structural scaffolding is already handled by the library.
5. As a theme maintainer, I want `ansiPairs` to be scoped to `variant.terminal`, so that it cannot accidentally grow to access UI or syntax colors without a visible signature change.
6. As a theme maintainer, I want `writeDistFile` to accept a plain platform string, so that adding a new platform requires no registration or configuration change.
7. As a theme maintainer, I want `ANSI_ORDER` to remain exported, so that any future tool that needs the ordered slot list does not have to re-declare it.
8. As a theme maintainer, I want the Warp-specific `details` field to remain inside `warp`, so that Warp metadata stays clearly separated from shared variant identity.
9. As a theme maintainer, I want builders to drop their `node:fs` and `node:path` imports entirely, so that the import list reflects only palette domain concerns.
10. As a theme maintainer, I want each builder to log its own completion message, so that log output remains format-specific and meaningful.
11. As a theme maintainer, I want `ansiPairs` to return `{ key, index, normal, bright }` per entry, so that builders can destructure exactly what they need without accessing the raw terminal object.
12. As a theme maintainer, I want the Ghostty builder to keep normal and bright ANSI groups separated by a blank line, so that the generated theme file remains human-readable.
13. As a theme maintainer, I want the Terminal.app builder to emit normal and bright ANSI properties interleaved per color, so that the AppleScript block groups logically related settings together.

## Implementation Decisions

### Schema change: `outputBase` promoted to variant root

Each variant in `palette/tokens.json` gains a top-level `outputBase` string (e.g. `"tinacious-design-dark"`). This is the filename stem shared across all platform outputs. The `warp.fileBase` field is removed. The `warp` key retains only `details`.

### `ansiPairs(terminal)` — new export on palette module

- Accepts the `terminal` sub-object of a variant (i.e. `variant.terminal`), not the full variant. The interface is scoped to what the function actually uses.
- Returns a flat array of `{ key, index, normal, bright }`, where `key` is the color name (e.g. `"red"`), `index` is the ANSI slot number (0–7), `normal` is the hex color from `terminal.ansi`, and `bright` is from `terminal.ansiBright`.
- Ordering is determined internally by `ANSI_ORDER`. Callers receive consistent ordering without needing to import or reference `ANSI_ORDER`.

### `writeDistFile(platform, filename, content)` — new export on palette module

- Accepts a platform name (string matching the `dist/` subdirectory), a filename, and a content string.
- Handles `mkdirSync` with `{ recursive: true }` and `writeFileSync` with `'utf8'` encoding internally.
- Does not log. Each builder retains its own `console.log` for format-specific messages.
- Lives in `load-palette.mjs` alongside the existing palette exports. No new library file is introduced.

### `ANSI_ORDER` remains exported

`ANSI_ORDER` stays as a named export for external use. After this refactor, no builder imports it — it becomes an internal dependency of `ansiPairs` — but removing the export would be a breaking change for any future tool.

### No `eachVariant` helper

Builders retain their own `Object.values(variants)` iteration. The one-line loop is not complex enough to warrant hiding behind a helper, and keeping it visible preserves the data model's clarity.

### Builders drop all `node:fs`, `node:path`, and `repoRoot` imports

After the refactor, all file I/O is delegated to `writeDistFile`. Builders import only from the palette module.

### Ghostty builder iterates `ansiPairs` twice

Ghostty's theme format groups normal colors first, then bright colors, separated by a blank line. The builder iterates `ansiPairs(v.terminal)` twice — once for normal, once for bright — to preserve that grouping. This is intentional and format-specific.

### Terminal.app builder iterates `ansiPairs` once (interleaved)

The AppleScript builder collapses two separate ANSI loops into one, emitting the normal and bright AppleScript property assignments for each color back-to-back. AppleScript does not care about property ordering, so this is functionally equivalent.

## Testing Decisions

No automated tests exist in this codebase. The primary verification for this refactor is:

- Run `npm run build` and confirm all five "Wrote dist/…" log lines appear without errors.
- Inspect `dist/` to confirm all expected output files are present and have correct content.
- Run `make sync-themes` in the dotfiles repo to confirm Ghostty picks up the synced theme files.

If tests are added in future, the right surface is each builder's pure formatter function (e.g. `ghosttyTheme(v)`, `warpYaml(name, v)`) — these are pure string transformations over a known input shape and can be unit-tested with fixture data from `palette/tokens.json`.

## Out of Scope

- Adding automated tests to the build system (tracked separately as Candidate 4 from the architecture review).
- Normalizing alpha channel handling in `tokens.json` (tracked separately as Candidate 3).
- Renaming `load-palette.mjs` to reflect its broader scope.
- Adding a new platform builder.
- Changes to the VS Code theme JSON files or the existing `generate_json_support.js` script.

## Further Notes

The `warp.fileBase` → `outputBase` promotion also unlocks a cleaner path to Candidate 3 (alpha normalization): once the palette schema is being touched, storing all colors without embedded alpha bytes becomes a natural follow-on change.

The grilled design decisions in this PRD were reached through the `/grill-with-docs` session. A `CONTEXT.md` capturing the domain vocabulary (Palette, Variant, Platform, ANSI pairs) should be written before the next architecture review session.
