/**
 * Emit Zed theme family JSON under dist/zed/ from palette/tokens.json.
 * @see https://zed.dev/docs/extensions/themes
 */
import { ansiPairs, loadPalette, writeDistFile } from './lib/load-palette.mjs';

function zedHighlight(color, opts = {}) {
  const o = { color };
  if (opts.font_weight != null) o.font_weight = opts.font_weight;
  if (opts.font_style) o.font_style = opts.font_style;
  return o;
}

function zedThemeEntry(rainbow, v) {
  const syn = v.syntax;
  const t = v.terminal;
  const ui = v.ui;

  const style = {
    accents: rainbow,
    background: ui.editorBackground,
    foreground: ui.editorForeground,
    accent: ui.accent,
    'editor.background': ui.editorBackground,
    'editor.foreground': ui.editorForeground,
    'editor.gutter.background': ui.editorBackground,
    'editor.active_line.background': ui.lineHighlight,
    'editor.line_number': ui.editorForeground,
    'panel.background': ui.panelBackground,
    'status_bar.background': ui.statusBarBackground,
    'status_bar.foreground': ui.statusBarForeground,
    'title_bar.background': ui.titleBarBackground,
    'title_bar.inactive_background': ui.titleBarBackground,
    'tab_bar.background': ui.tabBarBackground,
    'terminal.background': t.background,
    'terminal.foreground': t.foreground
  };

  for (const { key, normal, bright } of ansiPairs(t)) {
    style[`terminal.ansi.${key}`] = normal;
    style[`terminal.ansi.bright_${key}`] = bright;
  }

  style.syntax = {
    comment: zedHighlight(syn.comment),
    string: zedHighlight(syn.string),
    keyword: zedHighlight(syn.keyword, { font_weight: 700 }),
    number: zedHighlight(syn.number),
    function: zedHighlight(syn.function),
    type: zedHighlight(syn.type, { font_style: 'italic' }),
    variable: zedHighlight(syn.variable)
  };

  return {
    name: v.label,
    appearance: v.appearance,
    style
  };
}

function main() {
  const { meta, rainbow, variants } = loadPalette();

  const zedDoc = {
    $schema: 'https://zed.dev/schema/themes/v0.2.0.json',
    name: meta.name,
    author: meta.author,
    themes: [zedThemeEntry(rainbow, variants.dark), zedThemeEntry(rainbow, variants.light)]
  };

  writeDistFile('zed', 'tinacious-design.json', `${JSON.stringify(zedDoc, null, 2)}\n`);

  console.log('Wrote dist/zed/tinacious-design.json from palette/tokens.json');
}

main();
