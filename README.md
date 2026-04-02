# glides

Simple markdown slides with zero build step.

## How it works

- Put slide files in `.slides/` (for example: `01-intro.md`, `02-why.md`)
- Serve and open `slides.html` in a browser context (not `file://`)
- The page discovers and loads `.slides/*.md` at runtime
- Fenced code blocks can use a language after the opening fence (for example ` ```javascript` ) for syntax highlighting via [Highlight.js](https://highlightjs.org/) (loaded from CDN). Unknown or missing languages fall back to auto-detect or plain text.

## Use in Cursor with Live Preview (recommended)

You can serve the slides directly inside Cursor using the VS Code extension **Live Preview** by Microsoft.

### 1) Install the extension

1. Open **Extensions** in Cursor (`Ctrl+Shift+X` / `Cmd+Shift+X`).
2. Search for **Live Preview**.
3. Install **Live Preview** by **Microsoft** (extension id: `ms-vscode.live-server`).

### 2) Open the project correctly

Open this repository root as your workspace folder in Cursor.  
This ensures `.slides/` resolves correctly when `slides.html` fetches markdown files.

### 3) Start the preview

1. Open `slides.html`.
2. Use one of these options:
   - Click the **preview** button in the editor toolbar (top-right), or
   - Right-click in the file and choose **Show Preview**, or
   - Open Command Palette and run a **Live Preview** command to show/open preview.
3. The slides should open in a Cursor preview tab (served over localhost by the extension).

### 4) Edit slides

Edit files in `.slides/` and refresh the preview tab if needed.  
Files are loaded dynamically, so new/changed `.md` files appear without rebuilding HTML.

## Alternative: run a local server in terminal

From the project root:

```bash
python3 -m http.server
```

Then open `http://localhost:8000/slides.html`.

## Slide ordering

Slides are sorted by filename (numeric-aware), so prefixed names like `01-...`, `02-...` keep a predictable order.

## Deck title and styles (`00-configuration.md`)

Optional file **`.slides/00-configuration.md`** can start with YAML frontmatter between `---` lines. It is still the **first slide** (sorted before `01-...`): everything after the closing `---` is rendered like any other markdown file.

- **`title`** — Sets the HTML document title and the top bar label.
- **Style keys** — Each key below maps to the CSS custom property with the same name (for example `accent` → `--accent`). Values are applied on load; use any valid CSS value. **Quote hex colors** in YAML (e.g. `accent: '#f0c050'`) so `#` is not treated as a comment.

Supported keys: `font-display`, `font-body`, `font-mono`, `bg`, `fg`, `dim`, `body`, `accent`, `accent2`, `code-bg`, `code-border`, `slide-max`, `topbar-border`, `surface`, `surface-hover`, `surface-active`, `nav-border`, `nav-border-hover`, `hint-fg`, `hint-kbd-bg`, `hint-kbd-border`.

You can group style keys under a nested **`styles:`** block (indented `key: value` lines) instead of listing them at the top level.

If this file is missing, the deck uses the defaults baked into `slides.html` (top bar label stays “Project Overview”).

## Optional fallback

If your static host does not expose directory listings, add `.slides/slides.json` with an array of markdown files:

```json
["00-configuration.md", "01-intro.md", "02-why.md", "03-syntax.md"]
```