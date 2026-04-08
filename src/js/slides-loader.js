import {
  CONFIG_BASENAME,
  FRONTMATTER_STYLE_KEYS,
  SLIDES_DIR,
  SLIDES_EXT,
  WORKSPACE_ROOT_STORAGE_KEY
} from './config.js';

const SLIDE_SEARCH_DIRS = [
  { fetchDir: SLIDES_DIR, canonicalDir: SLIDES_DIR },
  { fetchDir: '../.slides/', canonicalDir: SLIDES_DIR }
];

function basenameFromPath(path) {
  const p = path.replace(/\\/g, '/');
  const i = p.lastIndexOf('/');
  return i >= 0 ? p.slice(i + 1) : p;
}

function isConfigSlidePath(path) {
  return basenameFromPath(path).toLowerCase() === CONFIG_BASENAME;
}

function stripYamlQuotes(value) {
  if (value.length >= 2) {
    const a = value[0];
    const b = value[value.length - 1];
    if ((a === '"' && b === '"') || (a === "'" && b === "'")) return value.slice(1, -1);
  }
  return value;
}

function splitFrontmatter(raw) {
  const lines = raw.split('\n');
  if (lines.length === 0 || lines[0].trim() !== '---') return { meta: null, body: raw };
  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      end = i;
      break;
    }
  }
  if (end < 0) return { meta: null, body: raw };
  const meta = lines.slice(1, end).join('\n');
  const body = lines.slice(end + 1).join('\n').replace(/^\n+/, '');
  return { meta, body };
}

function parseFrontmatterYaml(block) {
  const out = {};
  const lines = block.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed === '' || trimmed.startsWith('#')) {
      i++;
      continue;
    }
    if (/^styles:\s*$/.test(trimmed)) {
      i++;
      while (i < lines.length && /^\s{2,}/.test(lines[i]) && /:/.test(lines[i])) {
        const sub = lines[i].replace(/^\s+/, '');
        const colon = sub.indexOf(':');
        if (colon > 0) {
          const k = sub.slice(0, colon).trim();
          let v = sub.slice(colon + 1).trim();
          v = stripYamlQuotes(v);
          if (k) out[k] = v;
        }
        i++;
      }
      continue;
    }
    const colon = line.indexOf(':');
    if (colon > 0) {
      const k = line.slice(0, colon).trim();
      let v = line.slice(colon + 1).trim();
      if (k === 'styles') {
        i++;
        continue;
      }
      v = stripYamlQuotes(v);
      if (k) out[k] = v;
    }
    i++;
  }
  return out;
}

function normalizeWorkspaceRoot(root) {
  if (!root || typeof root !== 'string') return '';
  return root.replace(/\\/g, '/').replace(/\/+$/, '');
}

function workspaceRootFromQuery() {
  try {
    const q = new URLSearchParams(location.search).get('workspace');
    if (q == null || !String(q).trim()) return null;
    const s = normalizeWorkspaceRoot(String(q).trim());
    return s.length ? s : null;
  } catch (e) {
    return null;
  }
}

function readStoredWorkspaceRoot() {
  try {
    const s = localStorage.getItem(WORKSPACE_ROOT_STORAGE_KEY);
    if (s == null || !String(s).trim()) return null;
    const n = normalizeWorkspaceRoot(String(s).trim());
    return n.length ? n : null;
  } catch (e) {
    return null;
  }
}

function persistStoredWorkspaceRoot(root) {
  const r = normalizeWorkspaceRoot(root);
  if (!r) return;
  try {
    localStorage.setItem(WORKSPACE_ROOT_STORAGE_KEY, r);
  } catch (e) { /* ignore */ }
}

function fileUrlToFsPath(fileUrl) {
  try {
    const u = typeof fileUrl === 'string' ? new URL(fileUrl) : fileUrl;
    if (u.protocol !== 'file:') return null;
    let p = u.pathname || '';
    try {
      p = decodeURIComponent(p);
    } catch (e) { /* keep raw */ }
    if (/^\/[a-zA-Z]:\//.test(p)) p = p.slice(1);
    return p.replace(/\//g, '/');
  } catch (e) {
    return null;
  }
}

function joinWorkspaceRootAndRel(root, relSlidePath) {
  const r = normalizeWorkspaceRoot(root);
  const rel = String(relSlidePath || '').replace(/\\/g, '/').replace(/^\.?\/+/, '');
  if (!r || !rel) return null;
  return (r + '/' + rel).replace(/\/+/g, '/');
}

export function resolveAbsoluteSlidePath(relSlidePath, deckWorkspaceRoot) {
  if (location.protocol === 'file:') {
    try {
      const u = new URL(relSlidePath, location.href);
      return fileUrlToFsPath(u);
    } catch (e) {
      return null;
    }
  }
  const fromQuery = workspaceRootFromQuery();
  if (fromQuery) persistStoredWorkspaceRoot(fromQuery);
  const fromYaml = deckWorkspaceRoot && normalizeWorkspaceRoot(deckWorkspaceRoot);
  const fromStore = readStoredWorkspaceRoot();
  const root = fromQuery || fromYaml || fromStore || null;
  if (!root) return null;
  return joinWorkspaceRootAndRel(root, relSlidePath);
}

export { basenameFromPath, joinWorkspaceRootAndRel, readStoredWorkspaceRoot, persistStoredWorkspaceRoot };

function normalizeSlidePath(href, targetDir) {
  if (!href) return null;
  let cleaned = href.split('#')[0].split('?')[0];
  if (!cleaned || cleaned === '../' || cleaned.endsWith('/')) return null;
  try {
    cleaned = decodeURIComponent(cleaned);
  } catch (e) {
    return null;
  }
  cleaned = cleaned.replace(/\\/g, '/').replace(/\/+/g, '/');
  cleaned = cleaned.replace(/^(\.\/)+/, '');
  if (!cleaned.toLowerCase().endsWith(SLIDES_EXT)) return null;
  if (/^(https?:)?\/\//i.test(cleaned)) return null;
  const lower = cleaned.toLowerCase();
  const dir = targetDir;
  if (lower.startsWith(dir.toLowerCase())) return dir + cleaned.slice(dir.length).replace(/^\/+/, '');
  if (lower.startsWith('/' + dir.toLowerCase())) return dir + cleaned.slice(('/' + dir).length).replace(/^\/+/, '');
  if (lower.startsWith('slides/')) return dir + cleaned.slice('slides/'.length);
  if (lower.startsWith('/slides/')) return dir + cleaned.slice('/slides/'.length);
  if (cleaned.startsWith('/')) return cleaned;
  if (!cleaned.includes('/')) return dir + cleaned;
  return dir + cleaned.replace(/^\.?\//, '');
}

function slideSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

function discoverFromDirectoryListing(html, targetDir) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const files = Array.from(doc.querySelectorAll('a[href]'))
    .map((a) => normalizeSlidePath(a.getAttribute('href'), targetDir))
    .filter(Boolean);
  return Array.from(new Set(files)).sort(slideSort);
}

async function discoverSlideFiles() {
  for (let i = 0; i < SLIDE_SEARCH_DIRS.length; i++) {
    const { fetchDir, canonicalDir } = SLIDE_SEARCH_DIRS[i];
    const listingRes = await fetch(fetchDir, { cache: 'no-store' });
    if (listingRes.ok) {
      const discoveredFetchPaths = discoverFromDirectoryListing(await listingRes.text(), fetchDir);
      if (discoveredFetchPaths.length > 0) {
        return discoveredFetchPaths.map((fetchPath) => {
          const suffix = fetchPath.slice(fetchDir.length).replace(/^\/+/, '');
          return {
            fetchPath,
            sourcePath: canonicalDir + suffix
          };
        });
      }
    }

    const manifestRes = await fetch(fetchDir + 'slides.json', { cache: 'no-store' });
    if (manifestRes.ok) {
      const manifest = await manifestRes.json();
      if (Array.isArray(manifest)) {
        const manifestPaths = manifest
          .map((entry) => (typeof entry === 'string' ? normalizeSlidePath(entry, fetchDir) : null))
          .filter(Boolean)
          .sort(slideSort);
        if (manifestPaths.length > 0) {
          return manifestPaths.map((fetchPath) => {
            const suffix = fetchPath.slice(fetchDir.length).replace(/^\/+/, '');
            return {
              fetchPath,
              sourcePath: canonicalDir + suffix
            };
          });
        }
      }
    }
  }
  throw new Error('No slides found. Checked .slides/ and ../.slides/. Ensure one is served with directory listing or add slides.json.');
}

export async function loadSlideEntries() {
  const files = await discoverSlideFiles();
  return Promise.all(
    files.map(async ({ fetchPath, sourcePath }) => {
      const res = await fetch(fetchPath, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load ' + fetchPath);
      return { path: sourcePath, text: await res.text() };
    })
  );
}

export function processLoadedEntries(entries, deckTitleEl) {
  const slidesRaw = [];
  const slidePaths = [];
  let deckWorkspaceRoot = null;

  const applyDeckMeta = (meta) => {
    if (!meta || typeof meta !== 'object') return;
    const root = document.documentElement;
    if (meta.title != null && String(meta.title).length) {
      const t = String(meta.title);
      document.title = t;
      deckTitleEl.textContent = t;
    }
    for (const key of Object.keys(meta)) {
      if (key === 'title') continue;
      if (FRONTMATTER_STYLE_KEYS.has(key)) {
        const val = meta[key];
        if (val != null && String(val).length) root.style.setProperty('--' + key, String(val));
      }
    }
  };

  for (let e = 0; e < entries.length; e++) {
    const { path, text } = entries[e];
    slidePaths.push(path);
    if (isConfigSlidePath(path)) {
      const { meta, body } = splitFrontmatter(text);
      if (meta != null) {
        try {
          const parsed = parseFrontmatterYaml(meta);
          if (parsed.workspace != null && String(parsed.workspace).trim()) {
            deckWorkspaceRoot = normalizeWorkspaceRoot(String(parsed.workspace).trim());
            persistStoredWorkspaceRoot(deckWorkspaceRoot);
          }
          applyDeckMeta(parsed);
        } catch (err) {
          console.warn('Frontmatter parse failed for ' + path, err);
        }
        slidesRaw.push(body);
      } else {
        slidesRaw.push(text);
      }
    } else {
      slidesRaw.push(text);
    }
  }
  return { slidesRaw, slidePaths, deckWorkspaceRoot };
}
