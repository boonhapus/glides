export const SLIDES_DIR = '.slides/';
export const SLIDES_EXT = '.md';
export const CONFIG_BASENAME = '00-configuration.md';

/** Frontmatter keys (other than title / styles) map to CSS custom properties. */
export const FRONTMATTER_STYLE_KEYS = new Set([
  'font-display', 'font-body', 'font-mono',
  'bg', 'fg', 'dim', 'body', 'accent', 'accent2',
  'link', 'link-hover', 'link-visited',
  'code-bg', 'code-border', 'slide-max',
  'topbar-border', 'surface', 'surface-hover', 'surface-active',
  'nav-border', 'nav-border-hover',
  'hint-fg', 'hint-kbd-bg', 'hint-kbd-border'
]);

export const LAST_SLIDE_STORAGE_KEY = 'glides:lastSlideIndex:' + (location.pathname || '/');
export const WORKSPACE_ROOT_STORAGE_KEY = 'glides:workspaceRoot';
