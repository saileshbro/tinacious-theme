# Issue 04 — Terminal.app builder

**Type**: AFK  
**Blocked by**: Issue 01

## What to build

Update `build-terminal.mjs` to use `ansiPairs` and `writeDistFile`. The Terminal.app builder emits AppleScript, where ANSI property order does not matter — so it collapses the two separate ANSI loops into one interleaved pass, setting normal and bright properties for each color back-to-back. The builder writes a single `.applescript` file covering all variants.

## Acceptance criteria

- [ ] `build-terminal.mjs` uses a single `for...of ansiPairs(v.terminal)` loop in place of the two separate `ANSI_ORDER` loops, emitting normal and bright AppleScript property assignments interleaved per color
- [ ] `build-terminal.mjs` uses `writeDistFile('terminal', 'setup-profile.applescript', ...)` instead of `mkdirSync` + `writeFileSync`
- [ ] `build-terminal.mjs` no longer imports from `node:fs` or `node:path`
- [ ] `build-terminal.mjs` no longer imports `ANSI_ORDER` or `repoRoot`
- [ ] `npm run build:terminal` succeeds and the generated AppleScript is valid
- [ ] `make setup-terminal` in the dotfiles repo runs without errors and Terminal.app profile is set correctly

## Blocked by

- Issue 01
