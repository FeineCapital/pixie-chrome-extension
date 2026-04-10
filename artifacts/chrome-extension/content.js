(() => {
  if (window.__elementCaptureActive !== undefined) return;
  window.__elementCaptureActive = false;

  /* ═══ State ═══ */
  const S = { HOVER: 'hover', DRAG: 'drag', SELECTED: 'selected' };
  let state = S.HOVER;

  /* ═══ DOM refs ═══ */
  let tooltip   = null;
  let selBox    = null;
  let handles   = {};
  let toolbar   = null;
  let annCanvas = null;
  let annCtx    = null;
  let ovCanvas = null, dimLabel = null;

  /* ═══ Data ═══ */
  let hoveredEl    = null;
  let selRect      = null;
  let dragStart    = null;
  let potentialDrag = false;
  let activeHandle  = null;
  let resizeOrigin  = null;
  let activeTool    = 'pen';
  let activeColor   = '#ef4444';
  let isDrawing     = false;
  let drawOrigin    = null;
  let savedPixels   = null;

  /* ══════════════════════════════════
     STYLES
  ══════════════════════════════════ */
  function injectStyles() {
    if (document.getElementById('__ec_styles')) return;
    const s = document.createElement('style');
    s.id = '__ec_styles';
    s.textContent = `
      .__ec-hl {
        outline: 1.5px solid #00e676 !important;
        outline-offset: 2px !important;
      }
      #__ec-ov {
        position: fixed !important; pointer-events: none !important;
        z-index: 2147483638 !important;
        top: 0 !important; left: 0 !important;
        display: none;
      }
      #__ec-dim {
        position: fixed !important; pointer-events: none !important;
        z-index: 2147483646 !important;
        background: rgba(0,0,0,0.68) !important; color: #fff !important;
        font: 600 11px -apple-system, BlinkMacSystemFont, sans-serif !important;
        padding: 3px 8px !important; border-radius: 4px !important;
        letter-spacing: 0.03em !important; display: none;
      }
      #__ec-tip {
        position: fixed !important; z-index: 2147483645 !important;
        pointer-events: none !important;
        background: rgba(18,18,22,0.82) !important;
        backdrop-filter: blur(12px) !important;
        -webkit-backdrop-filter: blur(12px) !important;
        color: #fff !important;
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif !important;
        font-size: 13px !important;
        font-weight: 500 !important;
        font-style: normal !important;
        font-variant: normal !important;
        font-stretch: normal !important;
        line-height: 1.4 !important;
        letter-spacing: -0.01em !important;
        word-spacing: normal !important;
        text-transform: none !important;
        text-decoration: none !important;
        text-shadow: none !important;
        -webkit-font-smoothing: antialiased !important;
        padding: 8px 16px !important;
        border-radius: 10px !important;
        border: 1px solid rgba(255,255,255,0.08) !important;
        box-shadow: 0 4px 20px rgba(0,0,0,0.4) !important;
        white-space: nowrap !important;
      }
      #__ec-sel {
        position: fixed !important; z-index: 2147483641 !important;
        pointer-events: none !important;
        border: 2px dashed #00e676 !important; border-radius: 10px !important;
        background: rgba(0,230,118,0.04) !important;
        box-sizing: border-box !important; display: none;
      }
      #__ec-ann {
        position: fixed !important; z-index: 2147483642 !important;
        border-radius: 3px !important; display: none;
        cursor: crosshair !important;
      }
      .ec-hnd {
        position: fixed !important; z-index: 2147483643 !important;
        width: 9px !important; height: 9px !important;
        background: #fff !important; border: 1.5px solid #00e676 !important;
        border-radius: 2px !important; box-shadow: 0 1px 4px rgba(0,0,0,0.4) !important;
        display: none;
      }
      #__ec-tb {
        position: fixed !important; z-index: 2147483644 !important; display: none;
        align-items: center !important; gap: 3px !important;
        background: rgba(10,11,22,0.96) !important;
        border: 1px solid rgba(0,230,118,0.2) !important;
        border-radius: 10px !important; padding: 5px 7px !important;
        box-shadow: 0 6px 28px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04) !important;
        backdrop-filter: blur(14px) !important; -webkit-backdrop-filter: blur(14px) !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif !important;
        white-space: nowrap !important; user-select: none !important;
      }
      #__ec-tb button {
        border: none !important; cursor: pointer !important;
        font-family: inherit !important; line-height: 1 !important;
        padding: 5px 7px !important; border-radius: 6px !important;
        background: transparent !important; color: rgba(255,255,255,0.45) !important;
        font-size: 13px !important; transition: background 0.12s, color 0.12s !important;
        display: flex !important; align-items: center !important; justify-content: center !important;
      }
      #__ec-tb button:hover { background: rgba(255,255,255,0.08) !important; color: rgba(255,255,255,0.9) !important; }
      #__ec-tb button.ec-act { background: rgba(0,230,118,0.14) !important; color: #00e676 !important; }
      #__ec-tb .ec-sep { width: 1px !important; height: 18px !important; background: rgba(255,255,255,0.09) !important; margin: 0 2px !important; flex-shrink: 0 !important; }
      #__ec-tb .ec-col {
        width: 12px !important; height: 12px !important; border-radius: 50% !important;
        padding: 0 !important; cursor: pointer !important; border: 2px solid transparent !important;
        transition: border-color 0.12s, transform 0.12s !important; flex-shrink: 0 !important;
      }
      #__ec-tb .ec-col.ec-act { border-color: rgba(255,255,255,0.75) !important; transform: scale(1.25) !important; }
      #__ec-tb .ec-cap {
        background: linear-gradient(135deg,#065f46,#059669,#10b981) !important;
        color: #fff !important; font-size: 11px !important; font-weight: 600 !important;
        padding: 5px 11px !important; border-radius: 6px !important;
        box-shadow: 0 0 10px rgba(16,185,129,0.3) !important; letter-spacing: 0.01em !important;
      }
      #__ec-tb .ec-cap:hover { box-shadow: 0 0 18px rgba(16,185,129,0.5) !important; color: #fff !important; }
      #__ec-tb .ec-sav {
        background: rgba(99,102,241,0.18) !important; color: #a5b4fc !important;
        font-size: 11px !important; font-weight: 600 !important;
        padding: 5px 11px !important; border-radius: 6px !important;
        border: 1px solid rgba(99,102,241,0.3) !important; letter-spacing: 0.01em !important;
      }
      #__ec-tb .ec-sav:hover { background: rgba(99,102,241,0.28) !important; color: #c7d2fe !important; }
      #__ec-tb .ec-x { color: rgba(255,255,255,0.25) !important; font-size: 15px !important; }
      #__ec-toast {
        position: fixed !important; z-index: 2147483647 !important;
        pointer-events: none !important; bottom: 20px !important; right: 20px !important;
        font: 500 12px -apple-system, BlinkMacSystemFont, sans-serif !important;
        padding: 9px 14px !important; border-radius: 8px !important;
        backdrop-filter: blur(10px) !important; -webkit-backdrop-filter: blur(10px) !important;
        transition: opacity 0.25s ease, transform 0.25s ease !important;
      }
    `;
    document.documentElement.appendChild(s);
  }

  /* ══════════════════════════════════
     TOOLTIP
  ══════════════════════════════════ */
  function createTooltip() {
    tooltip = document.getElementById('__ec-tip') || null;
    if (tooltip) return;
    tooltip = document.createElement('div');
    tooltip.id = '__ec-tip';
    tooltip.textContent = 'Click to select · Drag to draw area';
    document.documentElement.appendChild(tooltip);
  }

  function moveTooltip(e) {
    if (!tooltip) return;
    const x = e.clientX + 12;
    const y = e.clientY - 30;
    tooltip.style.left = Math.min(x, window.innerWidth  - 220) + 'px';
    tooltip.style.top  = Math.max(y, 4) + 'px';
  }

  /* ══════════════════════════════════
     SELECTION BOX
  ══════════════════════════════════ */
  function ensureSelBox() {
    selBox = document.getElementById('__ec-sel') || null;
    if (selBox) return;
    selBox = document.createElement('div');
    selBox.id = '__ec-sel';
    document.documentElement.appendChild(selBox);
  }

  function posSelBox(r) {
    ensureSelBox();
    selBox.style.left    = r.left   + 'px';
    selBox.style.top     = r.top    + 'px';
    selBox.style.width   = r.width  + 'px';
    selBox.style.height  = r.height + 'px';
    selBox.style.display = 'block';
  }

  /* ══════════════════════════════════
     SCREEN OVERLAY (cmd+shift+5 style)
  ══════════════════════════════════ */
  function ensureOverlay() {
    if (ovCanvas) return;
    ovCanvas = document.createElement('canvas');
    ovCanvas.id = '__ec-ov';
    document.documentElement.appendChild(ovCanvas);
    dimLabel = document.createElement('div');
    dimLabel.id = '__ec-dim';
    document.documentElement.appendChild(dimLabel);
  }

  function showOverlay(r) {
    ensureOverlay();
    const W = window.innerWidth, H = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    const pw = Math.round(W * dpr), ph = Math.round(H * dpr);

    ovCanvas.width  = pw;
    ovCanvas.height = ph;
    ovCanvas.style.width  = W + 'px';
    ovCanvas.style.height = H + 'px';
    ovCanvas.style.display = 'block';

    const ctx = ovCanvas.getContext('2d');
    ctx.clearRect(0, 0, pw, ph);
    ctx.fillStyle = 'rgba(0,0,0,0.52)';
    ctx.fillRect(0, 0, pw, ph);

    // Cut out a rounded rectangle so only the selection is bright
    const radius = 10 * dpr;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.roundRect(r.left * dpr, r.top * dpr, r.width * dpr, r.height * dpr, radius);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // Dimension label
    const w = Math.round(r.width), h = Math.round(r.height);
    dimLabel.textContent = `${w} × ${h}`;
    dimLabel.style.display = 'block';
    const lw = dimLabel.offsetWidth || 64, lh = dimLabel.offsetHeight || 20;
    let lx = r.left + r.width / 2 - lw / 2;
    let ly = r.top + r.height + 6;
    if (ly + lh > H - 4) ly = r.top - lh - 6;
    lx = Math.max(4, Math.min(lx, W - lw - 4));
    dimLabel.style.left = lx + 'px';
    dimLabel.style.top  = ly + 'px';
  }

  function hideOverlay() {
    if (ovCanvas)  ovCanvas.style.display  = 'none';
    if (dimLabel)  dimLabel.style.display  = 'none';
  }

  /* ══════════════════════════════════
     HANDLES
  ══════════════════════════════════ */
  const HIDS = ['nw','n','ne','e','se','s','sw','w'];
  const HCUR = { nw:'nw-resize',n:'n-resize',ne:'ne-resize',e:'e-resize',se:'se-resize',s:'s-resize',sw:'sw-resize',w:'w-resize' };

  function ensureHandles() {
    for (const id of HIDS) {
      const existing = document.getElementById('__ec-h-' + id);
      if (existing) { handles[id] = existing; continue; }
      const h = document.createElement('div');
      h.id = '__ec-h-' + id;
      h.className = 'ec-hnd';
      h.style.cursor = HCUR[id];
      h.dataset.handle = id;
      h.addEventListener('mousedown', onHandleDown);
      document.documentElement.appendChild(h);
      handles[id] = h;
    }
  }

  function posHandles(r) {
    const HW = 9, HH = 4;
    const pos = {
      nw: [r.left-HH,          r.top-HH],
      n:  [r.left+r.width/2-HH, r.top-HH],
      ne: [r.left+r.width-HH,   r.top-HH],
      e:  [r.left+r.width-HH,   r.top+r.height/2-HH],
      se: [r.left+r.width-HH,   r.top+r.height-HH],
      s:  [r.left+r.width/2-HH, r.top+r.height-HH],
      sw: [r.left-HH,           r.top+r.height-HH],
      w:  [r.left-HH,           r.top+r.height/2-HH],
    };
    for (const id of HIDS) {
      handles[id].style.left    = pos[id][0] + 'px';
      handles[id].style.top     = pos[id][1] + 'px';
      handles[id].style.display = 'block';
    }
  }

  function hideHandles() { for (const id of HIDS) if (handles[id]) handles[id].style.display = 'none'; }

  /* ══════════════════════════════════
     ANNOTATION CANVAS
  ══════════════════════════════════ */
  function ensureAnnCanvas() {
    annCanvas = document.getElementById('__ec-ann') || null;
    if (!annCanvas) {
      annCanvas = document.createElement('canvas');
      annCanvas.id = '__ec-ann';
      annCanvas.addEventListener('mousedown', onAnnDown);
      annCanvas.addEventListener('mousemove', onAnnMove);
      annCanvas.addEventListener('mouseup',   onAnnUp);
      document.documentElement.appendChild(annCanvas);
    }
    annCtx = annCanvas.getContext('2d');
  }

  function posAnnCanvas(r) {
    ensureAnnCanvas();
    const dpr = window.devicePixelRatio || 1;
    const pw  = Math.round(r.width  * dpr);
    const ph  = Math.round(r.height * dpr);
    annCanvas.style.left   = r.left   + 'px';
    annCanvas.style.top    = r.top    + 'px';
    annCanvas.style.width  = r.width  + 'px';
    annCanvas.style.height = r.height + 'px';
    annCanvas.style.display = 'block';
    annCanvas.style.pointerEvents = 'auto';
    if (annCanvas.width !== pw || annCanvas.height !== ph) {
      annCanvas.width  = pw;
      annCanvas.height = ph;
      annCtx.scale(dpr, dpr);
      savedPixels = null;
    }
    annCtx.lineCap  = 'round';
    annCtx.lineJoin = 'round';
  }

  /* ══════════════════════════════════
     TOOLBAR
  ══════════════════════════════════ */
  const COLORS = ['#ef4444','#f97316','#facc15','#00e676','#60a5fa','#e879f9','#ffffff'];

  function ensureToolbar() {
    toolbar = document.getElementById('__ec-tb') || null;
    if (toolbar) return;
    toolbar = document.createElement('div');
    toolbar.id = '__ec-tb';

    function sep() { const d = document.createElement('div'); d.className = 'ec-sep'; toolbar.appendChild(d); }
    function mkBtn(label, title) {
      const b = document.createElement('button');
      b.title = title; b.textContent = label;
      return b;
    }

    // Pencil
    const penBtn = mkBtn('✏', 'Pencil');
    penBtn.dataset.tool = 'pen';
    penBtn.classList.add('ec-act');
    penBtn.addEventListener('click', e => { e.stopPropagation(); setTool('pen'); });
    toolbar.appendChild(penBtn);

    // Eraser
    const erBtn = mkBtn('⌫', 'Eraser');
    erBtn.dataset.tool = 'eraser';
    erBtn.addEventListener('click', e => { e.stopPropagation(); setTool('eraser'); });
    toolbar.appendChild(erBtn);

    sep();

    // Color dots
    for (const c of COLORS) {
      const dot = document.createElement('button');
      dot.className = 'ec-col' + (c === activeColor ? ' ec-act' : '');
      dot.style.background = c;
      dot.dataset.color = c;
      dot.title = c;
      dot.addEventListener('click', e => { e.stopPropagation(); setColor(c); });
      toolbar.appendChild(dot);
    }

    sep();

    // Copy to clipboard
    const cap = mkBtn('Copy', 'Copy to clipboard  (⌘C)');
    cap.className += ' ec-cap';
    cap.addEventListener('click', e => { e.stopPropagation(); doCapture(true); });
    toolbar.appendChild(cap);

    // Save to desktop
    const sav = mkBtn('Save', 'Save to desktop  (↵ Enter)');
    sav.className += ' ec-sav';
    sav.addEventListener('click', e => { e.stopPropagation(); doSave(true); });
    toolbar.appendChild(sav);

    sep();

    // Close
    const close = mkBtn('×', 'Cancel selection');
    close.className += ' ec-x';
    close.addEventListener('click', e => { e.stopPropagation(); clearSel(); });
    toolbar.appendChild(close);

    document.documentElement.appendChild(toolbar);
  }

  function posToolbar(r) {
    ensureToolbar();
    toolbar.style.display = 'flex';
    requestAnimationFrame(() => {
      if (!toolbar) return;
      const tw = toolbar.offsetWidth, th = toolbar.offsetHeight;
      let x = r.left + r.width / 2 - tw / 2;
      let y = r.top  + r.height + 10;
      x = Math.max(8, Math.min(x, window.innerWidth  - tw - 8));
      if (y + th > window.innerHeight - 8) y = r.top - th - 10;
      if (y < 4) y = r.top + r.height + 4;
      toolbar.style.left = x + 'px';
      toolbar.style.top  = y + 'px';
    });
  }

  function setTool(tool) {
    activeTool = tool;
    if (!toolbar) return;
    toolbar.querySelectorAll('[data-tool]').forEach(b => b.classList.remove('ec-act'));
    const btn = toolbar.querySelector(`[data-tool="${tool}"]`);
    if (btn) btn.classList.add('ec-act');
  }

  function setColor(color) {
    activeColor = color;
    if (!toolbar) return;
    toolbar.querySelectorAll('.ec-col').forEach(d => {
      d.classList.toggle('ec-act', d.dataset.color === color);
    });
  }

  /* ══════════════════════════════════
     SELECTION SHOW/HIDE
  ══════════════════════════════════ */
  function showSel(r) {
    selRect = { ...r };
    posSelBox(r);
    ensureHandles(); posHandles(r);
    posAnnCanvas(r);
    posToolbar(r);
    state = S.SELECTED;
    unhighlight();
    if (tooltip) tooltip.style.opacity = '0';
  }

  function updateSel(r) {
    selRect = { ...r };
    posSelBox(r);
    posHandles(r);
    posAnnCanvas(r);
    posToolbar(r);
  }

  function clearSel() {
    state = S.HOVER;
    selRect = null; savedPixels = null;
    if (selBox)    selBox.style.display = 'none';
    if (annCanvas) { annCanvas.style.display = 'none'; annCanvas.style.pointerEvents = 'none'; }
    if (toolbar)   toolbar.style.display = 'none';
    hideHandles();
    hideOverlay();
    if (tooltip) tooltip.style.opacity = '1';
  }

  function clearAnnotations() {
    if (!annCtx || !annCanvas) return;
    annCtx.clearRect(0, 0, annCanvas.width, annCanvas.height);
    savedPixels = null;
  }

  /* ══════════════════════════════════
     HOVER HIGHLIGHTING
  ══════════════════════════════════ */
  function highlight(el) {
    if (el === hoveredEl) return;
    unhighlight();
    if (!el || isOurs(el)) return;
    hoveredEl = el;
    el.classList.add('__ec-hl');
  }

  function unhighlight() {
    if (hoveredEl) { hoveredEl.classList.remove('__ec-hl'); hoveredEl = null; }
  }

  function findBestTarget(start) {
    if (!start || start === document.body || start === document.documentElement) return null;
    if (isOurs(start)) return null;
    let el = start;
    while (el && el !== document.body) {
      const d = window.getComputedStyle(el).display;
      if (['block','flex','grid','inline-block','inline-flex','table-cell','list-item'].includes(d)) break;
      el = el.parentElement;
    }
    if (!el || el === document.body) return start;
    let cur = el, cand = el;
    for (let i = 0; i < 8 && cur && cur !== document.body; i++) {
      const kids = Array.from(cur.children).filter(c => {
        const cs = window.getComputedStyle(c);
        return cs.display !== 'none' && cs.visibility !== 'hidden';
      });
      if (kids.length >= 2) return cand;
      cand = cur; cur = cur.parentElement;
    }
    return cand;
  }

  function isOurs(el) {
    if (!el) return false;
    if (el.id && el.id.startsWith('__ec')) return true;
    if (el.classList && el.classList.contains('ec-hnd')) return true;
    if (el.closest && el.closest('#__ec-tb,#__ec-sel,#__ec-ann,#__ec-tip')) return true;
    return false;
  }

  /* ══════════════════════════════════
     ANNOTATION DRAWING
  ══════════════════════════════════ */
  function savePx()    { if (annCtx) savedPixels = annCtx.getImageData(0,0,annCanvas.width,annCanvas.height); }
  function restorePx() { if (annCtx && savedPixels) annCtx.putImageData(savedPixels,0,0); }

  function canPos(e) {
    const r = annCanvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function onAnnDown(e) {
    if (e.button !== 0) return;
    e.preventDefault(); e.stopPropagation();
    isDrawing = true;
    drawOrigin = canPos(e);
    savePx();
    annCtx.beginPath();
    annCtx.moveTo(drawOrigin.x, drawOrigin.y);
  }

  function onAnnMove(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const p = canPos(e);
    if (activeTool === 'pen') {
      annCtx.globalCompositeOperation = 'source-over';
      annCtx.strokeStyle = activeColor; annCtx.lineWidth = 2.5;
      annCtx.lineTo(p.x, p.y); annCtx.stroke();
    } else if (activeTool === 'eraser') {
      annCtx.globalCompositeOperation = 'destination-out';
      annCtx.lineWidth = 18;
      annCtx.lineTo(p.x, p.y); annCtx.stroke();
      annCtx.globalCompositeOperation = 'source-over';
    }
  }

  function onAnnUp(e) {
    if (!isDrawing) return;
    e.preventDefault(); e.stopPropagation();
    isDrawing = false;
    annCtx.globalCompositeOperation = 'source-over';
    savePx();
    drawOrigin = null;
  }

  /* ══════════════════════════════════
     RESIZE HANDLES
  ══════════════════════════════════ */
  function onHandleDown(e) {
    if (e.button !== 0) return;
    e.preventDefault(); e.stopPropagation();
    activeHandle  = e.currentTarget.dataset.handle;
    resizeOrigin  = { x: e.clientX, y: e.clientY, rect: { ...selRect } };
    document.addEventListener('mousemove', onResizeMove, true);
    document.addEventListener('mouseup',   onResizeUp,   true);
  }

  function onResizeMove(e) {
    if (!activeHandle) return;
    const dx = e.clientX - resizeOrigin.x;
    const dy = e.clientY - resizeOrigin.y;
    const o  = resizeOrigin.rect;
    let {left,top,width,height} = o;

    if (activeHandle.includes('w')) { left+=dx; width-=dx; }
    if (activeHandle.includes('e')) { width+=dx; }
    if (activeHandle.includes('n')) { top+=dy; height-=dy; }
    if (activeHandle.includes('s')) { height+=dy; }

    if (width  < 20) { width=20;  if (activeHandle.includes('w')) left=o.left+o.width-20; }
    if (height < 20) { height=20; if (activeHandle.includes('n')) top=o.top+o.height-20; }

    updateSel({left,top,width,height});
  }

  function onResizeUp() {
    document.removeEventListener('mousemove', onResizeMove, true);
    document.removeEventListener('mouseup',   onResizeUp,   true);
    activeHandle = null; resizeOrigin = null;
  }

  /* ══════════════════════════════════
     MAIN EVENT HANDLERS
  ══════════════════════════════════ */
  function onMouseDown(e) {
    if (!window.__elementCaptureActive || e.button !== 0) return;
    if (isOurs(e.target)) return;

    if (state === S.HOVER) {
      potentialDrag = true;
      dragStart = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    } else if (state === S.SELECTED) {
      // Click outside our UI → clear selection, go back to hover
      clearSel();
    }
  }

  function onMouseMove(e) {
    if (!window.__elementCaptureActive) return;

    if (state === S.HOVER) {
      moveTooltip(e);
      if (potentialDrag) {
        const dx = e.clientX - dragStart.x, dy = e.clientY - dragStart.y;
        if (Math.sqrt(dx*dx+dy*dy) > 5) {
          state = S.DRAG;
          unhighlight();
          if (tooltip) tooltip.style.opacity = '0';
          ensureSelBox();
        }
      } else {
        const raw = document.elementFromPoint(e.clientX, e.clientY);
        if (raw && !isOurs(raw)) highlight(findBestTarget(raw));
      }
    } else if (state === S.DRAG) {
      const r = mkRect(dragStart, {x:e.clientX, y:e.clientY});
      posSelBox(r);
      showOverlay(r);
    }
  }

  function onMouseUp(e) {
    if (!window.__elementCaptureActive || e.button !== 0) return;

    if (state === S.DRAG) {
      e.preventDefault(); e.stopPropagation();
      const r = mkRect(dragStart, {x:e.clientX, y:e.clientY});
      potentialDrag = false; dragStart = null;
      hideOverlay();
      if (r.width < 10 || r.height < 10) {
        if (selBox) selBox.style.display = 'none';
        state = S.HOVER;
        if (tooltip) tooltip.style.opacity = '1';
        return;
      }
      showSel(r);

    } else if (state === S.HOVER && potentialDrag) {
      potentialDrag = false;
      if (!isOurs(e.target) && hoveredEl) {
        e.preventDefault(); e.stopPropagation();
        // Click on element → immediate capture (no toolbar)
        const el = hoveredEl;
        unhighlight();
        if (tooltip) tooltip.style.opacity = '0';
        const br = el.getBoundingClientRect();
        selRect = { left: br.left, top: br.top, width: br.width, height: br.height };
        doCapture().then(() => {
          selRect = null;
          if (tooltip) tooltip.style.opacity = '1';
        });
      }
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') {
      if (state === S.SELECTED) clearSel();
      else deactivate();
    }
    if (e.key === 'Enter' && state === S.SELECTED) { e.preventDefault(); doSave(); }
    if (e.key === 'c' && (e.metaKey||e.ctrlKey) && state === S.SELECTED) { e.preventDefault(); doCapture(); }
  }

  function mkRect(a, b) {
    return { left:Math.min(a.x,b.x), top:Math.min(a.y,b.y), width:Math.abs(b.x-a.x), height:Math.abs(b.y-a.y) };
  }

  /* ══════════════════════════════════
     CAPTURE
  ══════════════════════════════════ */
  async function doCapture(fromToolbar = false) {
    if (!selRect) return;
    // Hide all UI before screenshot
    if (selBox)    selBox.style.display   = 'none';
    if (toolbar)   toolbar.style.display  = 'none';
    if (annCanvas) annCanvas.style.visibility = 'hidden';
    hideHandles();

    await sleep(65);

    // Wait for background to push SCREENSHOT_RESULT back
    const base64 = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Screenshot timed out')), 8000);
      const handler = (msg) => {
        if (msg.type === 'SCREENSHOT_RESULT') {
          clearTimeout(timer);
          chrome.runtime.onMessage.removeListener(handler);
          if (msg.error) reject(new Error(msg.error));
          else resolve(msg.base64);
        }
      };
      chrome.runtime.onMessage.addListener(handler);
      chrome.runtime.sendMessage({ type: 'TAKE_SCREENSHOT' }).catch(reject);
    });

    let success = false;
    try {
      await mergeAndCopy(base64);
      toast('Copied to clipboard ✓');
      success = true;
    } catch (err) {
      toast('Failed: ' + err.message, true);
      // Restore UI on failure so user can try again
      if (fromToolbar && selRect) {
        posSelBox(selRect);
        posHandles(selRect);
        if (toolbar)   toolbar.style.display = 'flex';
        if (annCanvas) annCanvas.style.visibility = 'visible';
      }
    }

    // Deactivate globally after a successful capture
    if (success) {
      chrome.runtime.sendMessage({ type: 'DEACTIVATE_GLOBAL' }).catch(() => {});
      deactivate();
    }
  }

  async function doSave(fromToolbar = false) {
    if (!selRect) return;
    if (selBox)    selBox.style.display   = 'none';
    if (toolbar)   toolbar.style.display  = 'none';
    if (annCanvas) annCanvas.style.visibility = 'hidden';
    hideHandles();
    await sleep(65);

    const base64 = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Screenshot timed out')), 8000);
      const handler = (msg) => {
        if (msg.type === 'SCREENSHOT_RESULT') {
          clearTimeout(timer);
          chrome.runtime.onMessage.removeListener(handler);
          if (msg.error) reject(new Error(msg.error));
          else resolve(msg.base64);
        }
      };
      chrome.runtime.onMessage.addListener(handler);
      chrome.runtime.sendMessage({ type: 'TAKE_SCREENSHOT' }).catch(reject);
    });

    let success = false;
    try {
      const blob = await mergeToBlob(base64);
      const ts   = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `capture-${ts}.png`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
      toast('Saved to downloads ✓');
      success = true;
    } catch (err) {
      toast('Save failed: ' + err.message, true);
      if (fromToolbar && selRect) {
        posSelBox(selRect); posHandles(selRect);
        if (toolbar)   toolbar.style.display = 'flex';
        if (annCanvas) annCanvas.style.visibility = 'visible';
      }
    }

    if (success) {
      chrome.runtime.sendMessage({ type: 'DEACTIVATE_GLOBAL' }).catch(() => {});
      deactivate();
    }
  }

  async function mergeAndCopy(base64) {
    const blob = await mergeToBlob(base64);
    await navigator.clipboard.write([new ClipboardItem({'image/png': blob})]);
  }

  async function mergeToBlob(base64) {
    const dpr = window.devicePixelRatio || 1;
    const r   = selRect;

    const img = await loadImage('data:image/png;base64,' + base64);
    const sx = Math.round(r.left   * dpr);
    const sy = Math.round(r.top    * dpr);
    const sw = Math.round(r.width  * dpr);
    const sh = Math.round(r.height * dpr);

    const c = document.createElement('canvas');
    c.width = sw; c.height = sh;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    if (annCanvas && annCanvas.width > 0) ctx.drawImage(annCanvas, 0, 0, sw, sh);

    return new Promise(res => c.toBlob(res, 'image/png'));
  }

  function loadImage(src) {
    return new Promise((res, rej) => {
      const i = new Image(); i.onload=()=>res(i); i.onerror=rej; i.src=src;
    });
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  /* ══════════════════════════════════
     ACTIVATE / DEACTIVATE
  ══════════════════════════════════ */
  function activate() {
    if (window.__elementCaptureActive) return;
    window.__elementCaptureActive = true;
    injectStyles();
    createTooltip();
    document.addEventListener('mousedown', onMouseDown, true);
    document.addEventListener('mousemove', onMouseMove, true);
    document.addEventListener('mouseup',   onMouseUp,   true);
    document.addEventListener('keydown',   onKeyDown,   true);
    chrome.runtime.sendMessage({ type: 'TAB_ACTIVATED' });
  }

  function deactivate() {
    if (!window.__elementCaptureActive) return;
    window.__elementCaptureActive = false;
    state = S.HOVER;
    unhighlight(); clearSel(); hideOverlay();
    document.removeEventListener('mousedown', onMouseDown, true);
    document.removeEventListener('mousemove', onMouseMove, true);
    document.removeEventListener('mouseup',   onMouseUp,   true);
    document.removeEventListener('keydown',   onKeyDown,   true);
    if (tooltip) { tooltip.remove(); tooltip = null; }
    chrome.runtime.sendMessage({ type: 'TAB_DEACTIVATED' });
  }

  /* ══════════════════════════════════
     MESSAGES
  ══════════════════════════════════ */
  chrome.runtime.onMessage.addListener((msg, _s, sendResponse) => {
    if (msg.type === 'ACTIVATE')   { activate();   sendResponse({ok:true}); }
    if (msg.type === 'DEACTIVATE') { deactivate(); sendResponse({ok:true}); }
    return true;
  });

  /* ══════════════════════════════════
     TOAST
  ══════════════════════════════════ */
  function toast(msg, isError=false) {
    const old = document.getElementById('__ec-toast');
    if (old) old.remove();
    const t = document.createElement('div');
    t.id = '__ec-toast';
    t.style.cssText = `background:${isError?'rgba(40,4,4,0.92)':'rgba(4,24,12,0.92)'};border:1px solid ${isError?'rgba(220,38,38,0.5)':'rgba(0,200,100,0.4)'};color:${isError?'#f87171':'#4ade80'};opacity:0;transform:translateY(8px);font-family:-apple-system,BlinkMacSystemFont,sans-serif;`;
    t.textContent = msg;
    document.documentElement.appendChild(t);
    requestAnimationFrame(() => { t.style.opacity='1'; t.style.transform='translateY(0)'; });
    setTimeout(() => { t.style.opacity='0'; t.style.transform='translateY(8px)'; setTimeout(()=>t.remove(),280); }, 2600);
  }

})();
