/**
 * Emit Ghostty terminal themes under dist/ghostty/ from palette/tokens.json.
 * Theme files have no extension; the filename is the theme name referenced in config.
 * @see https://ghostty.org/docs/config/reference#theme
 */
import { ansiPairs, loadPalette, writeDistFile } from './lib/load-palette.mjs';

function stripAlpha(hex) {
  return hex.length === 9 ? hex.slice(0, 7) : hex;
}

function ghosttyTheme(v) {
  const { cursor } = v.ui;
  const t = v.terminal;
  const lines = [
    `background = ${t.background}`,
    `foreground = ${t.foreground}`,
    `cursor-color = ${cursor}`,
    `selection-background = ${stripAlpha(v.ui.selectionBackground)}`,
    '',
  ];

  const pairs = ansiPairs(t);
  pairs.forEach(({ index, normal }) => lines.push(`palette = ${index}=${normal}`));
  lines.push('');
  pairs.forEach(({ index, bright }) => lines.push(`palette = ${index + 8}=${bright}`));

  return `${lines.join('\n')}\n`;
}

function appConfig(darkVariant) {
  return `split-divider-color = ${darkVariant.ui.accent}\n`;
}

function main() {
  const { variants } = loadPalette();

  for (const v of Object.values(variants)) {
    writeDistFile('ghostty', v.outputBase, ghosttyTheme(v));
  }

  writeDistFile('ghostty', 'app-config', appConfig(variants.dark));

  console.log('Wrote dist/ghostty/* from palette/tokens.json');
}

main();
