import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** VS Code / Warp / Zed ANSI slot order (black … white). */
export const ANSI_ORDER = [
  'black',
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'white'
];

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Repository root (directory that contains `palette/`). */
export const repoRoot = join(__dirname, '..', '..');

export function loadPalette() {
  const palettePath = join(repoRoot, 'palette', 'tokens.json');
  return JSON.parse(readFileSync(palettePath, 'utf8'));
}

export function ansiPairs(terminal) {
  return ANSI_ORDER.map((key, index) => ({
    key,
    index,
    normal: terminal.ansi[key],
    bright: terminal.ansiBright[key],
  }));
}

export function writeDistFile(platform, filename, content) {
  const dir = join(repoRoot, 'dist', platform);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, filename), content, 'utf8');
}
