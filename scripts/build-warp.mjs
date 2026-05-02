/**
 * Emit Warp terminal themes under dist/warp/ from palette/tokens.json.
 * @see https://docs.warp.dev/terminal/appearance/custom-themes
 */
import { ANSI_ORDER, ansiPairs, loadPalette, writeDistFile } from './lib/load-palette.mjs';

function warpYaml(name, v) {
  const { accent, cursor } = v.ui;
  const t = v.terminal;
  const pairs = ansiPairs(t);
  const normalLines = pairs.map(({ key, normal }) => `    ${key}: '${normal}'`);
  const brightLines = pairs.map(({ key, bright }) => `    ${key}: '${bright}'`);
  const lines = [
    `name: ${name}`,
    `accent: '${accent}'`,
    `cursor: '${cursor}'`,
    `background: '${t.background}'`,
    `foreground: '${t.foreground}'`,
    `details: ${v.warp.details}`,
    'terminal_colors:',
    '  normal:',
    ...normalLines,
    '  bright:',
    ...brightLines,
  ];
  return `${lines.join('\n')}\n`;
}

function main() {
  const { variants } = loadPalette();

  for (const v of Object.values(variants)) {
    writeDistFile('warp', `${v.outputBase}.yaml`, warpYaml(v.label, v));
  }

  console.log('Wrote dist/warp/*.yaml from palette/tokens.json');
}

main();
