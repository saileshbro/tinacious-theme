# Issue 02 — Zed builder

**Type**: AFK  
**Blocked by**: Issue 01

## What to build

Update `build-zed.mjs` to use `ansiPairs` and `writeDistFile` from the palette library, removing all direct `node:fs` and `node:path` usage. The Zed builder writes a single combined file for both variants, so it does not use `outputBase`.

## Acceptance criteria

- [ ] `build-zed.mjs` uses `ansiPairs(v.terminal)` for the ANSI color loop in `zedThemeEntry`
- [ ] `build-zed.mjs` uses `writeDistFile('zed', 'tinacious-design.json', ...)` instead of `mkdirSync` + `writeFileSync`
- [ ] `build-zed.mjs` no longer imports from `node:fs` or `node:path`
- [ ] `build-zed.mjs` no longer imports `ANSI_ORDER` or `repoRoot`
- [ ] `npm run build:zed` succeeds and `dist/zed/tinacious-design.json` content is unchanged

## Blocked by

- Issue 01
