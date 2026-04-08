import { LAST_SLIDE_STORAGE_KEY } from './config.js';
import { createDomRefs, flashHintMessage, setStatus } from './dom.js';
import { renderSlides } from './markdown.js';
import {
  basenameFromPath,
  joinWorkspaceRootAndRel,
  loadSlideEntries,
  persistStoredWorkspaceRoot,
  processLoadedEntries,
  readStoredWorkspaceRoot,
  resolveAbsoluteSlidePath
} from './slides-loader.js';

const dom = createDomRefs();

let slidesRaw = [];
let slidePaths = [];
let deckWorkspaceRoot = null;
let current = 0;
let isReloading = false;
let reloadDebounceTimer = null;
let initialBootFinished = false;
let previewEverBackgrounded = false;

function readSavedSlideIndex() {
  try {
    const raw = localStorage.getItem(LAST_SLIDE_STORAGE_KEY);
    if (raw == null) return null;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : null;
  } catch (e) {
    return null;
  }
}

function persistSlideIndex() {
  if (slidesRaw.length === 0) return;
  try {
    localStorage.setItem(LAST_SLIDE_STORAGE_KEY, String(current));
  } catch (e) { /* ignore */ }
}

function syncPrintPdfButton() {
  if (!dom.printPdfBtn) return;
  const canPrint = slidesRaw.length > 0 && !dom.stage.querySelector('.status.error');
  dom.printPdfBtn.disabled = !canPrint;
}

async function copyPathToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) { /* fallback */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch (e) {
    return false;
  }
}

async function printDeck() {
  if (!dom.printPdfBtn || dom.printPdfBtn.disabled) return;
  try {
    window.focus();
  } catch (e) { /* ignore */ }
  if (window.self !== window.top) {
    const url = location.href;
    const copied = await copyPathToClipboard(url);
    flashHintMessage(
      dom.hintEl,
      dom.hintDefaultHtml,
      copied
        ? 'Deck URL copied — paste into Chrome or Edge, load the page, click PDF again. In the print dialog choose Save as PDF; you pick the folder and filename.'
        : 'For PDF, open this URL in Chrome or Edge (not the editor preview): ' + url + ' — then PDF → Save as PDF (you choose where it saves).',
      false,
      10000
    );
  }
  window.print();
}

async function openCurrentSlideSource() {
  if (slidesRaw.length === 0 || !slidePaths.length || current < 0 || current >= slidePaths.length) return;
  if (dom.stage.querySelector('.status')) return;
  const rel = slidePaths[current];
  let abs = resolveAbsoluteSlidePath(rel, deckWorkspaceRoot);

  if (!abs) {
    const guess = readStoredWorkspaceRoot() || '';
    const msg =
      'Open slide in Cursor: paste the absolute path to the folder that contains `.slides`\n' +
      '(example on Windows: C:\\work\\cursor\\glides)';
    const input = window.prompt(msg, guess);
    if (input != null && String(input).trim()) {
      persistStoredWorkspaceRoot(String(input).trim());
      abs = joinWorkspaceRootAndRel(readStoredWorkspaceRoot(), rel);
    }
  }

  if (abs) {
    const copied = await copyPathToClipboard(abs);
    flashHintMessage(
      dom.hintEl,
      dom.hintDefaultHtml,
      copied
        ? 'Path copied — Quick Open (Ctrl+P or Cmd+P), paste, Enter → ' + basenameFromPath(rel)
        : 'Could not copy path. Try Quick Open and open: ' + rel,
      !copied
    );
    return;
  }

  const copyRel = rel.replace(/\\/g, '/');
  const copied = await copyPathToClipboard(copyRel);
  flashHintMessage(
    dom.hintEl,
    dom.hintDefaultHtml,
    copied
      ? 'Path copied: ' + copyRel + ' — add workspace: in 00-configuration.md (`workspace: …`) or paste the repo root when prompted on right-click.'
      : 'Could not copy path. Add `workspace` to 00-configuration.md (repo root). File: ' + copyRel,
    !copied
  );
}

function updateUI() {
  dom.totalEl.textContent = slidesRaw.length;
  dom.curEl.textContent = slidesRaw.length === 0 ? 0 : current + 1;
  dom.progressEl.style.width = slidesRaw.length === 0
    ? '0%'
    : ((current + 1) / slidesRaw.length * 100) + '%';
  syncPrintPdfButton();
}

function navigate(dir) {
  if (slidesRaw.length === 0) return;
  const next = current + dir;
  if (next < 0 || next >= slidesRaw.length) return;
  const els = dom.stage.querySelectorAll('.slide');
  const prev = current;
  els[prev].classList.remove('active');
  if (dir > 0) els[prev].classList.add('exit-up');
  setTimeout(() => els[prev].classList.remove('exit-up'), 450);
  current = next;
  els[current].classList.remove('exit-up');
  els[current].classList.add('active');
  updateUI();
  persistSlideIndex();
}

function applySavedSlideIndex() {
  const saved = readSavedSlideIndex();
  if (saved == null || slidesRaw.length === 0) return;
  const idx = Math.max(0, Math.min(saved, slidesRaw.length - 1));
  if (idx === current) return;
  const els = dom.stage.querySelectorAll('.slide');
  if (!els.length || !els[current] || !els[idx]) return;
  els[current].classList.remove('active');
  current = idx;
  els[current].classList.add('active');
  els.forEach((el) => el.classList.remove('exit-up'));
}

function scheduleReloadDebounced() {
  if (reloadDebounceTimer != null) window.clearTimeout(reloadDebounceTimer);
  reloadDebounceTimer = window.setTimeout(() => {
    reloadDebounceTimer = null;
    void reloadSlides();
  }, 320);
}

async function reloadSlides() {
  if (isReloading || !initialBootFinished) return;
  isReloading = true;
  const prev = current;
  try {
    const entries = await loadSlideEntries();
    if (entries.length === 0) return;
    const loaded = processLoadedEntries(entries, dom.deckTitleEl);
    slidesRaw = loaded.slidesRaw;
    slidePaths = loaded.slidePaths;
    deckWorkspaceRoot = loaded.deckWorkspaceRoot;
    if (slidesRaw.length === 0) return;
    current = Math.max(0, Math.min(prev, slidesRaw.length - 1));
    renderSlides(dom.stage, slidesRaw, current);
    updateUI();
    persistSlideIndex();
  } catch (err) {
    console.error(err);
    flashHintMessage(dom.hintEl, dom.hintDefaultHtml, 'Could not reload slides.', true);
  } finally {
    isReloading = false;
  }
}

function wireEvents() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); navigate(1); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); navigate(-1); }
  });

  dom.stage.addEventListener('click', (e) => {
    if (slidesRaw.length === 0) return;
    const rect = dom.stage.getBoundingClientRect();
    e.clientX < rect.left + rect.width / 2 ? navigate(-1) : navigate(1);
  });

  dom.stage.addEventListener('contextmenu', (e) => {
    if (slidesRaw.length === 0) return;
    if (dom.stage.querySelector('.status')) return;
    e.preventDefault();
    void openCurrentSlideSource();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') previewEverBackgrounded = true;
    if (document.visibilityState === 'visible' && previewEverBackgrounded) scheduleReloadDebounced();
  });

  window.addEventListener('focus', () => {
    if (previewEverBackgrounded && document.visibilityState === 'visible') scheduleReloadDebounced();
  });

  dom.prevBtn?.addEventListener('click', () => navigate(-1));
  dom.nextBtn?.addEventListener('click', () => navigate(1));
  dom.printPdfBtn?.addEventListener('click', () => { void printDeck(); });
}

async function boot() {
  setStatus(dom.stage, 'Loading slides...', false);
  syncPrintPdfButton();
  try {
    const entries = await loadSlideEntries();
    if (entries.length === 0) throw new Error('No slides found in .slides/.');
    current = 0;
    const loaded = processLoadedEntries(entries, dom.deckTitleEl);
    slidesRaw = loaded.slidesRaw;
    slidePaths = loaded.slidePaths;
    deckWorkspaceRoot = loaded.deckWorkspaceRoot;
    if (slidesRaw.length === 0) throw new Error('No slides found in .slides/.');
    renderSlides(dom.stage, slidesRaw, current);
    applySavedSlideIndex();
    updateUI();
    persistSlideIndex();
  } catch (err) {
    const help = window.location.protocol === 'file:'
      ? ' Open this deck through a local web server (for example: python3 -m http.server).'
      : '';
    setStatus(dom.stage, (err && err.message ? err.message : 'Failed to load slides.') + help, true);
    updateUI();
    console.error(err);
  } finally {
    initialBootFinished = true;
  }
}

wireEvents();
void boot();
