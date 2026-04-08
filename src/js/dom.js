export function createDomRefs() {
  const stage = document.getElementById('stage');
  const curEl = document.getElementById('cur');
  const totalEl = document.getElementById('total');
  const progressEl = document.getElementById('progress');
  const deckTitleEl = document.getElementById('deck-title');
  const hintEl = document.getElementById('hint');
  const printPdfBtn = document.getElementById('print-pdf-btn');
  const prevBtn = document.getElementById('nav-prev');
  const nextBtn = document.getElementById('nav-next');
  const hintDefaultHtml = hintEl ? hintEl.innerHTML : '';

  return {
    stage,
    curEl,
    totalEl,
    progressEl,
    deckTitleEl,
    hintEl,
    hintDefaultHtml,
    printPdfBtn,
    prevBtn,
    nextBtn
  };
}

export function flashHintMessage(hintEl, hintDefaultHtml, message, isError, durationMs) {
  if (!hintEl) return;
  hintEl.innerHTML = '';
  hintEl.textContent = message;
  if (isError) hintEl.style.color = 'var(--accent2)';
  const ms = durationMs != null ? durationMs : 5000;
  window.setTimeout(() => {
    hintEl.innerHTML = hintDefaultHtml;
    hintEl.style.color = '';
  }, ms);
}

export function setStatus(stage, message, isError) {
  stage.innerHTML = '<div class="status' + (isError ? ' error' : '') + '">' + message + '</div>';
}
