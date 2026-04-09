(() => {
  if (window.__elementCaptureActive !== undefined) return;
  window.__elementCaptureActive = false;

  let hoveredEl  = null;
  let overlay    = null;
  let tooltip    = null;

  /* ─── Inject minimal styles once ─── */
  function injectStyles() {
    if (document.getElementById('__ec_styles')) return;
    const s = document.createElement('style');
    s.id = '__ec_styles';
    s.textContent = `
      #__ec-overlay {
        position: fixed;
        pointer-events: none;
        z-index: 2147483646;
        border: 1.5px solid rgba(255, 255, 255, 0.55);
        border-radius: 8px;
        box-shadow: 0 0 0 1px rgba(0,0,0,0.15);
        transition: left 0.07s ease, top 0.07s ease, width 0.07s ease, height 0.07s ease, opacity 0.12s ease;
        opacity: 0;
      }
      #__ec-overlay.visible {
        opacity: 1;
      }
      #__ec-tooltip {
        position: fixed;
        z-index: 2147483647;
        pointer-events: none;
        background: rgba(0, 0, 0, 0.72);
        border-radius: 5px;
        padding: 4px 9px;
        font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
        font-size: 11.5px;
        font-weight: 400;
        color: #ffffff;
        letter-spacing: 0.01em;
        white-space: nowrap;
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        transition: opacity 0.1s ease;
      }
      #__ec-toast {
        position: fixed;
        z-index: 2147483647;
        pointer-events: none;
        bottom: 20px;
        right: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
        font-size: 12px;
        font-weight: 500;
        padding: 9px 14px;
        border-radius: 8px;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        transition: opacity 0.25s ease, transform 0.25s ease;
      }
    `;
    document.documentElement.appendChild(s);
  }

  /* ─── Create overlay div ─── */
  function createOverlay() {
    if (document.getElementById('__ec-overlay')) {
      overlay = document.getElementById('__ec-overlay');
      return;
    }
    overlay = document.createElement('div');
    overlay.id = '__ec-overlay';
    document.documentElement.appendChild(overlay);
  }

  /* ─── Create tooltip ─── */
  function createTooltip() {
    if (document.getElementById('__ec-tooltip')) {
      tooltip = document.getElementById('__ec-tooltip');
      return;
    }
    tooltip = document.createElement('div');
    tooltip.id = '__ec-tooltip';
    tooltip.textContent = 'Click to capture';
    document.documentElement.appendChild(tooltip);
  }

  /* ─── Find the best "section" target by walking up to the nearest multi-child container ─── */
  function findBestTarget(startEl) {
    if (!startEl || startEl === document.body || startEl === document.documentElement) return startEl;
    if (startEl.id && startEl.id.startsWith('__ec-')) return null;

    let el = startEl;

    // Step 1: walk up from inline elements to nearest block
    while (el && el !== document.body) {
      const cs = window.getComputedStyle(el);
      const d  = cs.display;
      if (d === 'block' || d === 'flex' || d === 'grid' || d === 'inline-block' || d === 'inline-flex' || d === 'table-cell' || d === 'list-item') break;
      el = el.parentElement;
    }
    if (!el || el === document.body) return startEl;

    // Step 2: walk upward until we find a container with 2+ visible children
    // Return the element just BELOW that container (i.e. the "card/item")
    let current   = el;
    let candidate = el;
    const MAX = 8;
    let i = 0;

    while (current && current !== document.body && i < MAX) {
      const visChildren = Array.from(current.children).filter(c => {
        const cs = window.getComputedStyle(c);
        return cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0';
      });

      if (visChildren.length >= 2) {
        // `candidate` is the item inside this multi-child container
        return candidate;
      }

      candidate = current;
      current   = current.parentElement;
      i++;
    }

    return candidate;
  }

  /* ─── Position overlay over element ─── */
  function positionOverlay(el) {
    if (!overlay || !el) return;
    const rect = el.getBoundingClientRect();
    overlay.style.left   = rect.left   + 'px';
    overlay.style.top    = rect.top    + 'px';
    overlay.style.width  = rect.width  + 'px';
    overlay.style.height = rect.height + 'px';
    overlay.classList.add('visible');
  }

  /* ─── Move tooltip to top-right of cursor ─── */
  const TW = 120, TH = 24;
  function moveTooltip(e) {
    if (!tooltip) return;
    let x = e.clientX + 12;
    let y = e.clientY - TH - 10;
    if (x + TW > window.innerWidth)  x = e.clientX - TW - 8;
    if (y < 4)                        y = e.clientY + 18;
    tooltip.style.left = x + 'px';
    tooltip.style.top  = y + 'px';
  }

  /* ─── Event handlers ─── */
  function onMouseMove(e) {
    moveTooltip(e);
    const raw = document.elementFromPoint(e.clientX, e.clientY);
    if (!raw || raw.id === '__ec-overlay' || raw.id === '__ec-tooltip') return;
    const target = findBestTarget(raw);
    if (!target || target === hoveredEl) return;
    hoveredEl = target;
    positionOverlay(hoveredEl);
  }

  function onClick(e) {
    if (!window.__elementCaptureActive || !hoveredEl) return;
    e.preventDefault();
    e.stopPropagation();

    const rect = hoveredEl.getBoundingClientRect();
    const dpr  = window.devicePixelRatio || 1;

    // Hide overlay before screenshot so it doesn't appear in capture
    if (overlay) overlay.classList.remove('visible');

    setTimeout(() => {
      chrome.runtime.sendMessage({
        type: 'CAPTURE_ELEMENT',
        rect: { x: rect.left, y: rect.top, width: rect.width, height: rect.height },
        devicePixelRatio: dpr
      });
    }, 60);
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') deactivate();
  }

  /* ─── Activate / Deactivate ─── */
  function activate() {
    if (window.__elementCaptureActive) return;
    window.__elementCaptureActive = true;
    injectStyles();
    createOverlay();
    createTooltip();
    document.addEventListener('mousemove', onMouseMove, true);
    document.addEventListener('click',     onClick,     true);
    document.addEventListener('keydown',   onKeyDown,   true);
    chrome.runtime.sendMessage({ type: 'TAB_ACTIVATED' });
  }

  function deactivate() {
    if (!window.__elementCaptureActive) return;
    window.__elementCaptureActive = false;
    hoveredEl = null;

    document.removeEventListener('mousemove', onMouseMove, true);
    document.removeEventListener('click',     onClick,     true);
    document.removeEventListener('keydown',   onKeyDown,   true);

    if (overlay)  { overlay.classList.remove('visible'); }
    if (tooltip)  { tooltip.style.opacity = '0'; setTimeout(() => { tooltip && tooltip.remove(); tooltip = null; }, 150); }

    chrome.runtime.sendMessage({ type: 'TAB_DEACTIVATED' });
  }

  /* ─── Message handler ─── */
  function handleMessage(msg, _sender, sendResponse) {
    if (msg.type === 'ACTIVATE')   { activate();   sendResponse({ ok: true }); }
    if (msg.type === 'DEACTIVATE') { deactivate(); sendResponse({ ok: true }); }

    if (msg.type === 'DO_CLIPBOARD') {
      // Restore overlay
      if (overlay && hoveredEl) positionOverlay(hoveredEl);

      const byteStr = atob(msg.base64);
      const arr = new Uint8Array(byteStr.length);
      for (let i = 0; i < byteStr.length; i++) arr[i] = byteStr.charCodeAt(i);
      const blob = new Blob([arr], { type: 'image/png' });

      navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        .then(() => showToast('Copied to clipboard!'))
        .catch(err => showToast('Clipboard failed: ' + err.message, true));
    }

    if (msg.type === 'CAPTURE_ERROR') {
      if (overlay && hoveredEl) positionOverlay(hoveredEl);
      showToast('Capture failed: ' + msg.error, true);
    }

    return true;
  }

  chrome.runtime.onMessage.addListener(handleMessage);

  /* ─── On-page toast ─── */
  function showToast(msg, isError = false) {
    const old = document.getElementById('__ec-toast');
    if (old) old.remove();
    const t = document.createElement('div');
    t.id = '__ec-toast';
    Object.assign(t.style, {
      background: isError ? 'rgba(30,4,4,0.9)' : 'rgba(4,18,10,0.9)',
      border: `1px solid ${isError ? 'rgba(220,38,38,0.5)' : 'rgba(0,200,100,0.4)'}`,
      color: isError ? '#f87171' : '#4ade80',
      opacity: '0',
      transform: 'translateY(8px)',
    });
    t.textContent = msg;
    document.documentElement.appendChild(t);
    requestAnimationFrame(() => { t.style.opacity = '1'; t.style.transform = 'translateY(0)'; });
    setTimeout(() => {
      t.style.opacity = '0'; t.style.transform = 'translateY(8px)';
      setTimeout(() => t.remove(), 280);
    }, 2600);
  }
})();
