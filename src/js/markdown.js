function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escHtmlTrunc(s, maxLen) {
  const m = maxLen == null ? Infinity : maxLen;
  if (s.length <= m) return escHtml(s);
  return escHtml(s.slice(0, m)) + '\n…';
}

function safeLangClass(lang) {
  return String(lang).replace(/[^a-z0-9_-]/gi, '');
}

function formatFencedCodeBlock(code, langRaw) {
  const esc = escHtml;
  const lang = (langRaw || '').trim().toLowerCase();
  const HL_AUTO_MAX = 12000;
  const HL_KNOWN_MAX = 120000;
  const CODE_ESC_HTML_MAX = 350000;
  if (code.length > CODE_ESC_HTML_MAX) {
    return '<pre><code>' + escHtmlTrunc(code, 200000) + ' (code block truncated for preview)</code></pre>';
  }
  if (typeof hljs === 'undefined') {
    return '<pre><code>' + esc(code) + '</code></pre>';
  }
  if (lang && hljs.getLanguage(lang)) {
    if (code.length > HL_KNOWN_MAX) {
      return '<pre><code>' + esc(code) + '</code></pre>';
    }
    try {
      const { value } = hljs.highlight(code, { language: lang, ignoreIllegals: true });
      const cls = safeLangClass(lang);
      return '<pre><code class="hljs language-' + cls + '">' + value + '</code></pre>';
    } catch (e) { /* fall through */ }
  }
  if (code.length > HL_AUTO_MAX) {
    return '<pre><code>' + esc(code) + '</code></pre>';
  }
  try {
    const { value, language } = hljs.highlightAuto(code);
    const extra = language ? ' language-' + safeLangClass(language) : '';
    return '<pre><code class="hljs' + extra + '">' + value + '</code></pre>';
  } catch (e) {
    return '<pre><code>' + esc(code) + '</code></pre>';
  }
}

export function md(src) {
  const MD_INPUT_MAX = 500000;
  if (src.length > MD_INPUT_MAX) {
    return '<p><em>Slide is very large; preview truncated.</em></p><pre><code>' +
      escHtmlTrunc(src, 200000) + ' (truncated)</code></pre>';
  }
  let html = '';
  const lines = src.split(/\r\n|\n|\r/);
  let i = 0;
  const esc = escHtml;
  const inline = (s) => {
    const imgs = [];
    s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, urlRaw) => {
      const url = String(urlRaw).trim().split(/\s+/)[0];
      const id = imgs.length;
      imgs.push('<img class="slide-img" src="' + esc(url) + '" alt="' + esc(alt.trim()) + '">');
      return '{{IMG' + id + '}}';
    });
    s = esc(s);
    for (let j = 0; j < imgs.length; j++) {
      s = s.replace('{{IMG' + j + '}}', imgs[j]);
    }
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    return s;
  };

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '') { i++; continue; }

    if (line.trim().startsWith('```')) {
      const open = line.trim().slice(3).trim();
      const fenceLang = open ? open.split(/\s+/)[0] : '';
      let code = '';
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        code += lines[i] + '\n';
        i++;
      }
      i++;
      html += formatFencedCodeBlock(code.trimEnd(), fenceLang);
      continue;
    }

    const hMatch = line.match(/^(#{1,3})(?:\s+(.*))?$/);
    if (hMatch) {
      const lvl = hMatch[1].length;
      const raw = hMatch[2] != null ? hMatch[2] : '';
      html += '<h' + lvl + '>' + inline(raw.trim()) + '</h' + lvl + '>';
      i++;
      continue;
    }

    if (line.trim().startsWith('>')) {
      let bq = '';
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        bq += lines[i].trim().replace(/^>\s?/, '') + ' ';
        i++;
      }
      html += '<blockquote><p>' + inline(bq.trim()) + '</p></blockquote>';
      continue;
    }

    if (/^\s*[-*]\s/.test(line)) {
      html += '<ul>';
      while (i < lines.length && /^\s*[-*]\s/.test(lines[i])) {
        html += '<li>' + inline(lines[i].replace(/^\s*[-*]\s+/, '')) + '</li>';
        i++;
      }
      html += '</ul>';
      continue;
    }

    if (/^\s*\d+\.\s/.test(line)) {
      html += '<ol>';
      while (i < lines.length && /^\s*\d+\.\s/.test(lines[i])) {
        html += '<li>' + inline(lines[i].replace(/^\s*\d+\.\s+/, '')) + '</li>';
        i++;
      }
      html += '</ol>';
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      html += '<hr>';
      i++;
      continue;
    }

    let para = '';
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^#{1,3}\s/.test(lines[i]) &&
      !/^>\s/.test(lines[i]) &&
      !/^\s*[-*]\s/.test(lines[i]) &&
      !/^\s*\d+\.\s/.test(lines[i]) &&
      !lines[i].trim().startsWith('```') &&
      !/^---+$/.test(lines[i].trim())
    ) {
      para += lines[i] + ' ';
      i++;
    }
    html += '<p>' + inline(para.trim()) + '</p>';
  }
  return html;
}

export function renderSlides(stage, slidesRaw, current) {
  stage.innerHTML = '';
  slidesRaw.forEach((src, idx) => {
    const div = document.createElement('div');
    div.className = 'slide' + (idx === current ? ' active' : '');
    try {
      div.innerHTML = md(src);
    } catch (e) {
      const msg = e && e.message ? String(e.message) : String(e);
      div.innerHTML = '<div class="status error">' + escHtml(msg) + '</div>';
    }
    stage.appendChild(div);
  });
}
