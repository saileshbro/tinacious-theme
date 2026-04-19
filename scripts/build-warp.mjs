/**
 * Emit Warp terminal themes under dist/warp/ from palette/tokens.json.
 * @see https://docs.warp.dev/terminal/appearance/custom-themes
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { ANSI_ORDER, loadPalette, repoRoot } from './lib/load-palette.mjs';

function warpYaml(name, v) {
  const { accent, cursor } = v.ui;
  const t = v.terminal;
  const lines = [
    `name: ${name}`,
    `accent: '${accent}'`,
    `cursor: '${cursor}'`,
    `background: '${t.background}'`,
    `foreground: '${t.foreground}'`,
    `details: ${v.warp.details}`,
    'terminal_colors:',
    '  normal:'
  ];
  for (const key of ANSI_ORDER) {
    lines.push(`    ${key}: '${t.ansi[key]}'`);
  }
  lines.push('  bright:');
  for (const key of ANSI_ORDER) {
    lines.push(`    ${key}: '${t.ansiBright[key]}'`);
  }
  return `${lines.join('\n')}\n`;
}

function main() {
  const palette = loadPalette();
  const { variants } = palette;

  const distWarp = join(repoRoot, 'dist', 'warp');
  mkdirSync(distWarp, { recursive: true });

  for (const key of Object.keys(variants)) {
    const v = variants[key];
    const fileName = `${v.warp.fileBase}.yaml`;
    writeFileSync(join(distWarp, fileName), warpYaml(v.label, v), 'utf8');
  }

  console.log('Wrote dist/warp/*.yaml from palette/tokens.json');
}

main();
