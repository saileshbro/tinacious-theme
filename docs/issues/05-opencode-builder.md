# Issue 05 — OpenCode builder

**Type**: AFK  
**Blocked by**: Issue 01

## What to build

Update `build-opencode.mjs` to use `writeDistFile` and `v.outputBase`. The OpenCode builder accesses ANSI colors by name rather than iterating `ANSI_ORDER`, so no `ansiPairs` changes are needed — only the file I/O and filename stem need updating.

## Acceptance criteria

- [ ] `build-opencode.mjs` uses `writeDistFile('opencode', fileName, ...)` instead of `mkdirSync` + `writeFileSync`
- [ ] `build-opencode.mjs` uses `v.outputBase` instead of `v.warp.fileBase` for output filenames
- [ ] `build-opencode.mjs` no longer imports from `node:fs` or `node:path`
- [ ] `build-opencode.mjs` no longer imports `repoRoot`
- [ ] `npm run build:opencode` succeeds and `dist/opencode/` filenames and content are unchanged

## Blocked by

- Issue 01
