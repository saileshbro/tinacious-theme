# Issue 03 — Ghostty builder

**Type**: AFK  
**Blocked by**: Issue 01

## What to build

Update `build-ghostty.mjs` to use `ansiPairs`, `writeDistFile`, and `v.outputBase`. The Ghostty theme format keeps normal and bright ANSI groups separated by a blank line, so the builder iterates `ansiPairs(v.terminal)` twice — once for normal, once for bright. It also emits a separate `app-config` file derived from the dark variant's accent color.

## Acceptance criteria

- [ ] `build-ghostty.mjs` uses `ansiPairs(v.terminal)` iterated twice (normal pass, blank line, bright pass) to preserve the Ghostty group format
- [ ] `build-ghostty.mjs` uses `writeDistFile('ghostty', ...)` for both theme files and `app-config`
- [ ] `build-ghostty.mjs` uses `v.outputBase` instead of `v.warp.fileBase` for theme filenames
- [ ] `build-ghostty.mjs` no longer imports from `node:fs` or `node:path`
- [ ] `build-ghostty.mjs` no longer imports `ANSI_ORDER` or `repoRoot`
- [ ] `npm run build:ghostty` succeeds; `dist/ghostty/` filenames and file content are unchanged
- [ ] `make sync-themes` in the dotfiles repo succeeds and Ghostty reads the synced theme correctly

## Blocked by

- Issue 01
