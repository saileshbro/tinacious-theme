# Issue 01 — Foundation: schema + palette library + Warp builder

**Type**: AFK  
**Blocked by**: None — can start immediately

## What to build

Add `outputBase` to each variant in `tokens.json` and remove `warp.fileBase`. Deepen `load-palette.mjs` with two new exports: `ansiPairs(terminal)` (ordered flat array of ANSI color pairs) and `writeDistFile(platform, filename, content)` (handles directory creation and file writing). Update `build-warp.mjs` as the first end-to-end proof that the new helpers and `outputBase` work correctly together.

## Acceptance criteria

- [ ] Each variant in `palette/tokens.json` has a top-level `outputBase` field (e.g. `"tinacious-design-dark"`)
- [ ] `warp.fileBase` is removed from both variants in `palette/tokens.json`; `warp` retains only `details`
- [ ] `load-palette.mjs` exports `ansiPairs(terminal)` returning `[{ key, index, normal, bright }]` for each of the 8 ANSI slots in `ANSI_ORDER` order
- [ ] `load-palette.mjs` exports `writeDistFile(platform, filename, content)` that creates `dist/<platform>/` and writes the file
- [ ] `ANSI_ORDER` remains exported from `load-palette.mjs`
- [ ] `build-warp.mjs` uses `ansiPairs(v.terminal)` instead of two separate `ANSI_ORDER` loops
- [ ] `build-warp.mjs` uses `writeDistFile` instead of `mkdirSync` + `writeFileSync`
- [ ] `build-warp.mjs` uses `v.outputBase` instead of `v.warp.fileBase`
- [ ] `build-warp.mjs` no longer imports from `node:fs` or `node:path`
- [ ] `npm run build:warp` succeeds and `dist/warp/` filenames are unchanged

## Blocked by

None — can start immediately
