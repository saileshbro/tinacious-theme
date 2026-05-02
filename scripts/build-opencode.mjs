/**
 * Emit OpenCode theme JSON under dist/opencode/ from palette/tokens.json.
 * @see https://dev.opencode.ai/docs/themes
 */
import { loadPalette, writeDistFile } from './lib/load-palette.mjs';

function withAlpha(hex, alpha = '22') {
  const normalized = hex.trim();
  if (!/^#[\da-fA-F]{6}$/.test(normalized)) {
    throw new Error(`Expected 6-digit hex color, got: ${hex}`);
  }
  return `${normalized}${alpha}`;
}

function opencodeTheme(v) {
  const ui = v.ui;
  const syn = v.syntax;
  const term = v.terminal;

  return {
    $schema: 'https://opencode.ai/theme.json',
    defs: {
      bg: ui.editorBackground,
      fg: ui.editorForeground,
      accent: ui.accent,
      primary: term.ansi.red,
      secondary: term.ansi.green,
      warning: term.ansi.yellow,
      info: term.ansi.blue,
      number: syn.number,
      comment: syn.comment,
      sidebar: ui.sidebarBackground,
      panel: ui.panelBackground,
      line: ui.lineHighlight,
      selection: ui.selectionBackground,
      diffAddedBg: withAlpha(term.ansi.green),
      diffRemovedBg: withAlpha(term.ansi.red)
    },
    theme: {
      primary: { dark: 'primary', light: 'primary' },
      secondary: { dark: 'secondary', light: 'secondary' },
      accent: { dark: 'accent', light: 'accent' },
      error: { dark: 'primary', light: 'primary' },
      warning: { dark: 'warning', light: 'warning' },
      success: { dark: 'secondary', light: 'secondary' },
      info: { dark: 'info', light: 'info' },
      text: { dark: 'fg', light: 'fg' },
      textMuted: { dark: 'comment', light: 'comment' },
      background: { dark: 'bg', light: 'bg' },
      backgroundPanel: { dark: 'panel', light: 'panel' },
      backgroundElement: { dark: 'sidebar', light: 'sidebar' },
      border: { dark: 'line', light: 'line' },
      borderActive: { dark: 'accent', light: 'accent' },
      borderSubtle: { dark: 'line', light: 'line' },
      diffAdded: { dark: 'secondary', light: 'secondary' },
      diffRemoved: { dark: 'primary', light: 'primary' },
      diffContext: { dark: 'comment', light: 'comment' },
      diffHunkHeader: { dark: 'info', light: 'info' },
      diffHighlightAdded: { dark: 'secondary', light: 'secondary' },
      diffHighlightRemoved: { dark: 'primary', light: 'primary' },
      diffAddedBg: { dark: 'diffAddedBg', light: 'diffAddedBg' },
      diffRemovedBg: { dark: 'diffRemovedBg', light: 'diffRemovedBg' },
      diffContextBg: { dark: 'line', light: 'line' },
      diffLineNumber: { dark: 'comment', light: 'comment' },
      diffAddedLineNumberBg: { dark: 'diffAddedBg', light: 'diffAddedBg' },
      diffRemovedLineNumberBg: { dark: 'diffRemovedBg', light: 'diffRemovedBg' },
      markdownText: { dark: 'fg', light: 'fg' },
      markdownHeading: { dark: 'accent', light: 'accent' },
      markdownLink: { dark: 'info', light: 'info' },
      markdownLinkText: { dark: 'secondary', light: 'secondary' },
      markdownCode: { dark: 'warning', light: 'warning' },
      markdownBlockQuote: { dark: 'comment', light: 'comment' },
      markdownEmph: { dark: 'warning', light: 'warning' },
      markdownStrong: { dark: 'accent', light: 'accent' },
      markdownHorizontalRule: { dark: 'line', light: 'line' },
      markdownListItem: { dark: 'info', light: 'info' },
      markdownListEnumeration: { dark: 'primary', light: 'primary' },
      markdownImage: { dark: 'info', light: 'info' },
      markdownImageText: { dark: 'secondary', light: 'secondary' },
      markdownCodeBlock: { dark: 'fg', light: 'fg' },
      syntaxComment: { dark: 'comment', light: 'comment' },
      syntaxKeyword: { dark: syn.keyword, light: syn.keyword },
      syntaxFunction: { dark: syn.function, light: syn.function },
      syntaxVariable: { dark: syn.variable, light: syn.variable },
      syntaxString: { dark: syn.string, light: syn.string },
      syntaxNumber: { dark: syn.number, light: syn.number },
      syntaxType: { dark: syn.type, light: syn.type },
      syntaxOperator: { dark: syn.keyword, light: syn.keyword },
      syntaxPunctuation: { dark: 'fg', light: 'fg' }
    }
  };
}

function main() {
  const { variants } = loadPalette();

  for (const v of Object.values(variants)) {
    writeDistFile('opencode', `${v.outputBase}.json`, `${JSON.stringify(opencodeTheme(v), null, 2)}\n`);
  }

  console.log('Wrote dist/opencode/*.json from palette/tokens.json');
}

main();
