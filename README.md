# glides

Simple markdown slides with zero build step.

## How it works

- Put slide files in `.slides/` (for example: `01-intro.md`, `02-why.md`)
- Open `slides.html` through a local web server
- The page discovers and loads `.slides/*.md` at runtime

## Run locally

From the project root:

```bash
python3 -m http.server
```

Then open `http://localhost:8000/slides.html`.

## Slide ordering

Slides are sorted by filename (numeric-aware), so prefixed names like `01-...`, `02-...` keep a predictable order.

## Optional fallback

If your static host does not expose directory listings, add `.slides/slides.json` with an array of markdown files:

```json
["01-intro.md", "02-why.md", "03-syntax.md"]
```