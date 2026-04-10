(() => {
  if (window.__pixieInjected) return;
  window.__pixieInjected = true;
  window.__elementCaptureActive = false;

  /* ═══ State ═══ */
  const S = { HOVER: 'hover', DRAG: 'drag', DRAG_READY: 'drag_ready', SELECTED: 'selected' };
  let state = S.HOVER;
  let captureMode = 'click'; // 'click' | 'drag' | 'full'

  /* ═══ DOM refs ═══ */
  let selBox    = null;
  let handles   = {};
  let toolbar   = null;
  let annCanvas = null;
  let annCtx    = null;
  let ovCanvas = null, dimLabel = null;
  let shield   = null;

  /* ═══ Data ═══ */
  let hoveredEl    = null;
  let selRect      = null;
  let dragStart    = null;
  let potentialDrag = false;
  let activeHandle  = null;
  let resizeOrigin  = null;
  let activeTool    = null;  // null='move', 'pen','eraser','shape','text'
  let activeShape   = 'rect'; // 'rect','ellipse','arrow'
  let activeColor   = '#ffffff';
  let isDrawing     = false;
  let drawOrigin    = null;
  let shapePreview  = null;  // {type,x1,y1,x2,y2,color,width} during drag
  let textInputEl   = null;
  let captureRadius = 0;
  let selCornerRadius = 10;
  let isMovingSel   = false;
  let moveStart     = null;

  /* ══════════════════════════════════
     ADAPTIVE OUTLINE COLOR
  ══════════════════════════════════ */
  let outlineColor = '#00e676';

  function getPageLuminance() {
    let el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
    if (!el || isOurs(el)) el = document.body;
    let current = el;
    while (current) {
      const cs = window.getComputedStyle(current);
      const bg = cs.backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (m) {
          const lum = (parseInt(m[1]) * 299 + parseInt(m[2]) * 587 + parseInt(m[3]) * 114) / 1000;
          return lum;
        }
      }
      current = current.parentElement;
    }
    return 255;
  }

  function computeOutlineColor() {
    const lum = getPageLuminance();
    outlineColor = lum < 128 ? '#ffffff' : '#1a1a1a';
    document.documentElement.style.setProperty('--ec-outline', outlineColor);
  }

  /* ══════════════════════════════════
     STYLES
  ══════════════════════════════════ */
  function injectStyles() {
    if (document.getElementById('__ec_styles')) return;
    const s = document.createElement('style');
    s.id = '__ec_styles';
    s.textContent = `
      .__ec-hl {
        outline: none !important;
      }
      #__ec-shield {
        position: fixed !important; inset: 0 !important;
        z-index: 2147483637 !important;
        background: transparent !important;
        cursor: default !important;
      }
      #__ec-shield.drag-ready {
        cursor: crosshair !important;
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
      #__ec-sel {
        position: fixed !important; z-index: 2147483641 !important;
        pointer-events: none !important;
        border: 2px solid var(--ec-outline, #fff) !important; border-radius: 10px !important;
        background: transparent !important;
        box-sizing: border-box !important; display: none;
      }
      #__ec-ann {
        position: fixed !important; z-index: 2147483642 !important;
        border-radius: 3px !important; display: none;
        cursor: move !important;
      }
      .ec-hnd {
        position: fixed !important; z-index: 2147483643 !important;
        width: 9px !important; height: 9px !important;
        background: #fff !important; border: 1.5px solid rgba(255,255,255,0.5) !important;
        border-radius: 2px !important; box-shadow: 0 1px 4px rgba(0,0,0,0.4) !important;
        display: none;
      }
      #__ec-tb {
        position: fixed !important; z-index: 2147483644 !important; display: none;
        align-items: center !important; gap: 6px !important;
        background: #171717 !important;
        border: 1px solid rgba(255,255,255,0.08) !important;
        border-radius: 14px !important; padding: 8px 10px !important;
        box-shadow: 0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04) !important;
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', Arial, sans-serif !important;
        white-space: nowrap !important; user-select: none !important;
      }
      #__ec-tb button {
        border: none !important; cursor: pointer !important;
        font-family: inherit !important; line-height: 1 !important;
        padding: 8px 9px !important; border-radius: 8px !important;
        background: transparent !important; color: rgba(255,255,255,0.45) !important;
        font-size: 14px !important; transition: background 0.12s, color 0.12s !important;
        display: flex !important; align-items: center !important; justify-content: center !important;
      }
      #__ec-tb button:hover { background: rgba(255,255,255,0.08) !important; color: rgba(255,255,255,0.9) !important; }
      #__ec-tb button.ec-act { background: rgba(255,255,255,0.1) !important; color: rgba(255,255,255,0.95) !important; }
      #__ec-tb .ec-sep { width: 1px !important; height: 22px !important; background: rgba(255,255,255,0.08) !important; margin: 0 2px !important; flex-shrink: 0 !important; }
      #__ec-tb .ec-col {
        width: 20px !important; height: 20px !important; border-radius: 5px !important;
        padding: 0 !important; cursor: pointer !important; border: 2px solid transparent !important;
        transition: border-color 0.12s, transform 0.12s !important; flex-shrink: 0 !important;
      }
      #__ec-tb .ec-col:hover { transform: scale(1.1) !important; }
      #__ec-tb .ec-col.ec-act { border-color: rgba(255,255,255,0.7) !important; transform: scale(1.1) !important; }
      #__ec-tb .ec-cap {
        background: rgba(255,255,255,0.12) !important;
        color: rgba(255,255,255,0.92) !important; font-size: 13px !important; font-weight: 600 !important;
        padding: 8px 16px !important; border-radius: 8px !important;
        border: 1px solid rgba(255,255,255,0.22) !important; letter-spacing: 0.01em !important;
      }
      #__ec-tb .ec-cap:hover { background: rgba(255,255,255,0.2) !important; color: #fff !important; }
      #__ec-tb .ec-sav {
        background: rgba(255,255,255,0.06) !important; color: rgba(255,255,255,0.5) !important;
        font-size: 13px !important; font-weight: 600 !important;
        padding: 8px 16px !important; border-radius: 8px !important;
        border: 1px solid rgba(255,255,255,0.1) !important; letter-spacing: 0.01em !important;
      }
      #__ec-tb .ec-sav:hover { background: rgba(255,255,255,0.1) !important; color: rgba(255,255,255,0.8) !important; }
      #__ec-tb .ec-x { color: rgba(255,255,255,0.25) !important; font-size: 16px !important; padding: 8px !important; }
      #__ec-toast {
        position: fixed !important; z-index: 2147483647 !important;
        pointer-events: none !important; bottom: 20px !important; right: 20px !important;
        font: 500 12px -apple-system, BlinkMacSystemFont, sans-serif !important;
        padding: 9px 14px !important; border-radius: 8px !important;
        backdrop-filter: blur(10px) !important; -webkit-backdrop-filter: blur(10px) !important;
        transition: opacity 0.25s ease, transform 0.25s ease !important;
      }
      #__ec-pal {
        position: fixed !important; z-index: 2147483645 !important;
        background: #1c1c1c !important; border: 1px solid rgba(255,255,255,0.1) !important;
        border-radius: 12px !important; padding: 10px !important;
        box-shadow: 0 8px 32px rgba(0,0,0,0.6) !important;
        display: none; flex-wrap: wrap !important; gap: 6px !important;
        width: 148px !important;
      }
      #__ec-pal .ec-pc {
        width: 22px !important; height: 22px !important; border-radius: 5px !important;
        cursor: pointer !important; border: 2px solid transparent !important;
        box-sizing: border-box !important; transition: transform 0.1s, border-color 0.1s !important;
        flex-shrink: 0 !important;
      }
      #__ec-pal .ec-pc:hover { transform: scale(1.15) !important; }
      #__ec-pal .ec-pc.ec-act { border-color: rgba(255,255,255,0.7) !important; transform: scale(1.1) !important; }
      #__ec-pal input[type=color] {
        width: 22px !important; height: 22px !important; border-radius: 5px !important;
        border: 2px solid rgba(255,255,255,0.2) !important; cursor: pointer !important;
        padding: 0 !important; box-sizing: border-box !important; background: none !important;
      }
      #__ec-shapes {
        position: fixed !important; z-index: 2147483645 !important;
        background: #1c1c1c !important; border: 1px solid rgba(255,255,255,0.1) !important;
        border-radius: 12px !important; padding: 6px !important;
        box-shadow: 0 8px 32px rgba(0,0,0,0.6) !important;
        display: none; flex-direction: column !important; gap: 2px !important;
      }
      #__ec-shapes button {
        background: transparent !important; border: none !important; cursor: pointer !important;
        color: rgba(255,255,255,0.6) !important; padding: 7px 10px !important; border-radius: 7px !important;
        display: flex !important; align-items: center !important; gap: 8px !important;
        font: 500 12px -apple-system, BlinkMacSystemFont, sans-serif !important;
        white-space: nowrap !important; transition: background 0.1s, color 0.1s !important;
      }
      #__ec-shapes button:hover { background: rgba(255,255,255,0.08) !important; color: #fff !important; }
      #__ec-shapes button.ec-act { background: rgba(255,255,255,0.1) !important; color: #fff !important; }
      #__ec-textinput {
        position: fixed !important; z-index: 2147483646 !important;
        background: transparent !important; border: none !important; outline: none !important;
        color: inherit !important; font-family: -apple-system, BlinkMacSystemFont, sans-serif !important;
        font-size: 18px !important; font-weight: 500 !important;
        min-width: 60px !important; min-height: 28px !important;
        padding: 2px 4px !important; caret-color: white !important;
        resize: none !important; overflow: hidden !important; white-space: nowrap !important;
        border-bottom: 1.5px dashed rgba(255,255,255,0.4) !important;
      }
    `;
    document.documentElement.appendChild(s);
  }

  /* ══════════════════════════════════
     SHIELD
  ══════════════════════════════════ */
  function createShield() {
    if (shield) return;
    shield = document.createElement('div');
    shield.id = '__ec-shield';
    document.documentElement.appendChild(shield);
  }

  function removeShield() {
    if (shield) { shield.remove(); shield = null; }
  }

  function elementUnderCursor(x, y) {
    if (!shield) return document.elementFromPoint(x, y);
    shield.style.pointerEvents = 'none';
    const el = document.elementFromPoint(x, y);
    shield.style.pointerEvents = '';
    return el;
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
    selBox.style.borderRadius = selCornerRadius + 'px';
    selBox.style.display = 'block';
  }

  /* ══════════════════════════════════
     SCREEN OVERLAY
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

    const radius = selCornerRadius * dpr;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.roundRect(r.left * dpr, r.top * dpr, r.width * dpr, r.height * dpr, radius);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

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
    const HH = 4;
    const pos = {
      nw: [r.left-HH,            r.top-HH],
      n:  [r.left+r.width/2-HH,  r.top-HH],
      ne: [r.left+r.width-HH,    r.top-HH],
      e:  [r.left+r.width-HH,    r.top+r.height/2-HH],
      se: [r.left+r.width-HH,    r.top+r.height-HH],
      s:  [r.left+r.width/2-HH,  r.top+r.height-HH],
      sw: [r.left-HH,            r.top+r.height-HH],
      w:  [r.left-HH,            r.top+r.height/2-HH],
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
    annCtx = annCanvas.getContext('2d', { willReadFrequently: true });
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
      redrawAllStrokes();
    }
    annCtx.lineCap  = 'round';
    annCtx.lineJoin = 'round';
    updateAnnCursor();
  }

  /* ══════════════════════════════════
     TOOLBAR
  ══════════════════════════════════ */
  const PALETTE = [
    '#ffffff','#000000','#ef4444','#f97316',
    '#eab308','#22c55e','#3b82f6','#a855f7',
    '#ec4899','#64748b',
  ];

  let palettePanel = null;
  let shapesPanel  = null;

  function svgIcon(d, w=18, h=18) {
    return `<svg width="${w}" height="${h}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  }

  const SHAPE_ICONS = {
    rect:    svgIcon('<rect x="3" y="5" width="18" height="14" rx="2"/>'),
    ellipse: svgIcon('<ellipse cx="12" cy="12" rx="9" ry="6"/>'),
    arrow:   svgIcon('<line x1="5" y1="19" x2="19" y2="5"/><polyline points="9 5 19 5 19 15"/>'),
  };
  const SHAPE_LABELS = { rect:'Rectangle', ellipse:'Ellipse', arrow:'Arrow' };

  function closePanels(except) {
    if (palettePanel && except !== 'pal') palettePanel.style.display = 'none';
    if (shapesPanel  && except !== 'shp') shapesPanel.style.display  = 'none';
  }

  function ensurePalettePanel() {
    if (palettePanel) return;
    palettePanel = document.createElement('div');
    palettePanel.id = '__ec-pal';
    PALETTE.forEach(c => {
      const sw = document.createElement('div');
      sw.className = 'ec-pc' + (c === activeColor ? ' ec-act' : '');
      sw.style.cssText = `background:${c} !important;${c==='#ffffff'?'box-shadow:inset 0 0 0 1px rgba(0,0,0,0.25) !important;':''}`;
      sw.dataset.color = c;
      sw.title = c;
      sw.addEventListener('click', e => { e.stopPropagation(); setColor(c); closePanels(); });
      palettePanel.appendChild(sw);
    });
    const picker = document.createElement('input');
    picker.type = 'color';
    picker.title = 'Custom color';
    picker.value = activeColor;
    picker.addEventListener('input', e => { e.stopPropagation(); setColor(e.target.value); });
    picker.addEventListener('click', e => e.stopPropagation());
    palettePanel.appendChild(picker);
    document.documentElement.appendChild(palettePanel);
  }

  function togglePalettePanel() {
    ensurePalettePanel();
    const open = palettePanel.style.display === 'flex';
    closePanels();
    if (!open) {
      palettePanel.style.display = 'flex';
      positionPanelAboveToolbar(palettePanel);
    }
  }

  function ensureShapesPanel() {
    if (shapesPanel) return;
    shapesPanel = document.createElement('div');
    shapesPanel.id = '__ec-shapes';
    for (const type of ['rect','ellipse','arrow']) {
      const b = document.createElement('button');
      b.dataset.shape = type;
      b.innerHTML = SHAPE_ICONS[type] + `<span>${SHAPE_LABELS[type]}</span>`;
      b.addEventListener('click', e => {
        e.stopPropagation();
        activeShape = type;
        updateShapeBtn();
        closePanels();
        setTool('shape');
      });
      shapesPanel.appendChild(b);
    }
    document.documentElement.appendChild(shapesPanel);
  }

  function toggleShapesPanel() {
    ensureShapesPanel();
    const open = shapesPanel.style.display === 'flex';
    closePanels();
    if (!open) {
      shapesPanel.style.display = 'flex';
      positionPanelAboveToolbar(shapesPanel);
    }
  }

  function positionPanelAboveToolbar(panel) {
    if (!toolbar) return;
    requestAnimationFrame(() => {
      const tr = toolbar.getBoundingClientRect();
      const pw = panel.offsetWidth, ph = panel.offsetHeight;
      let x = tr.left + tr.width / 2 - pw / 2;
      let y = tr.top - ph - 8;
      x = Math.max(8, Math.min(x, window.innerWidth - pw - 8));
      if (y < 8) y = tr.bottom + 8;
      panel.style.left = x + 'px';
      panel.style.top  = y + 'px';
    });
  }

  function updateShapeBtn() {
    if (!toolbar) return;
    const shapeBtn = toolbar.querySelector('[data-tool="shape"]');
    if (shapeBtn) shapeBtn.innerHTML = SHAPE_ICONS[activeShape];
    if (shapesPanel) {
      shapesPanel.querySelectorAll('[data-shape]').forEach(b => {
        b.classList.toggle('ec-act', b.dataset.shape === activeShape);
      });
    }
  }

  function updateColorBtn() {
    if (!toolbar) return;
    const cb = toolbar.querySelector('.ec-colbtn');
    if (cb) {
      const inner = cb.querySelector('.ec-colbtn-dot');
      if (inner) {
        inner.style.cssText = `width:14px !important; height:14px !important; border-radius:4px !important; background:${activeColor} !important; box-shadow:${activeColor==='#ffffff'?'inset 0 0 0 1px rgba(0,0,0,0.25)':'inset 0 0 0 1px rgba(0,0,0,0.15)'} !important; flex-shrink:0 !important;`;
      }
    }
    if (palettePanel) {
      palettePanel.querySelectorAll('.ec-pc').forEach(d => {
        d.classList.toggle('ec-act', d.dataset.color === activeColor);
      });
    }
  }

  function ensureToolbar() {
    toolbar = document.getElementById('__ec-tb') || null;
    if (toolbar) return;
    toolbar = document.createElement('div');
    toolbar.id = '__ec-tb';

    function sep() { const d = document.createElement('div'); d.className = 'ec-sep'; toolbar.appendChild(d); }

    // Move button
    const moveBtn = document.createElement('button');
    moveBtn.title = 'Move / resize';
    moveBtn.dataset.tool = 'move';
    moveBtn.innerHTML = svgIcon('<polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/>');
    moveBtn.classList.add('ec-act');
    moveBtn.addEventListener('click', e => { e.stopPropagation(); closePanels(); setTool(null); });
    toolbar.appendChild(moveBtn);

    // Pen button
    const penBtn = document.createElement('button');
    penBtn.title = 'Pencil (draw)';
    penBtn.dataset.tool = 'pen';
    penBtn.innerHTML = svgIcon('<path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>');
    penBtn.addEventListener('click', e => { e.stopPropagation(); closePanels(); setTool(activeTool === 'pen' ? null : 'pen'); });
    toolbar.appendChild(penBtn);

    // Eraser button
    const erBtn = document.createElement('button');
    erBtn.title = 'Eraser';
    erBtn.dataset.tool = 'eraser';
    erBtn.innerHTML = svgIcon('<path d="M3.5 21h17"/><path d="M5.5 21 3 18.5l9-9 5 5-4 4.5-2.5-2.5"/><path d="M15 7.5 17.5 10"/><path d="M7 17L12 12"/>');
    erBtn.addEventListener('click', e => { e.stopPropagation(); closePanels(); setTool(activeTool === 'eraser' ? null : 'eraser'); });
    toolbar.appendChild(erBtn);

    // Shapes button
    const shapeBtn = document.createElement('button');
    shapeBtn.title = 'Shapes';
    shapeBtn.dataset.tool = 'shape';
    shapeBtn.innerHTML = SHAPE_ICONS[activeShape];
    shapeBtn.addEventListener('click', e => { e.stopPropagation(); toggleShapesPanel(); });
    toolbar.appendChild(shapeBtn);

    // Text button
    const textBtn = document.createElement('button');
    textBtn.title = 'Text';
    textBtn.dataset.tool = 'text';
    textBtn.innerHTML = svgIcon('<text x="12" y="18" text-anchor="middle" fill="currentColor" stroke="none" style="font:700 14px sans-serif">T</text>');
    textBtn.addEventListener('click', e => { e.stopPropagation(); closePanels(); setTool(activeTool === 'text' ? null : 'text'); });
    toolbar.appendChild(textBtn);

    sep();

    // Color button
    const colorBtn = document.createElement('button');
    colorBtn.className = 'ec-colbtn';
    colorBtn.title = 'Color';
    colorBtn.style.cssText = 'display:flex !important; align-items:center !important; gap:5px !important;';
    const dot = document.createElement('span');
    dot.className = 'ec-colbtn-dot';
    dot.style.cssText = `width:14px !important; height:14px !important; border-radius:4px !important; background:${activeColor} !important; box-shadow:inset 0 0 0 1px rgba(0,0,0,0.15) !important; flex-shrink:0 !important;`;
    colorBtn.appendChild(dot);
    colorBtn.innerHTML += svgIcon('<polyline points="6 9 12 15 18 9"/>', 10, 10);
    colorBtn.addEventListener('click', e => { e.stopPropagation(); togglePalettePanel(); });
    toolbar.appendChild(colorBtn);

    sep();

    // Copy button
    const cap = document.createElement('button');
    cap.textContent = 'Copy';
    cap.title = 'Copy to clipboard (⌘C)';
    cap.className = 'ec-cap';
    cap.addEventListener('click', e => { e.stopPropagation(); closePanels(); doCapture(true); });
    toolbar.appendChild(cap);

    // Save button
    const sav = document.createElement('button');
    sav.textContent = 'Save';
    sav.title = 'Save to downloads (↵ Enter)';
    sav.className = 'ec-sav';
    sav.addEventListener('click', e => { e.stopPropagation(); closePanels(); doSave(true); });
    toolbar.appendChild(sav);

    sep();

    // Close button
    const close = document.createElement('button');
    close.textContent = '×';
    close.title = 'Cancel (Esc)';
    close.className = 'ec-x';
    close.addEventListener('click', e => { e.stopPropagation(); closePanels(); clearSel(); });
    toolbar.appendChild(close);

    // Close panels when clicking outside them
    document.addEventListener('mousedown', (e) => {
      const inTb  = toolbar && toolbar.contains(e.target);
      const inPal = palettePanel && palettePanel.contains(e.target);
      const inShp = shapesPanel  && shapesPanel.contains(e.target);
      if (!inTb && !inPal && palettePanel && palettePanel.style.display !== 'none') palettePanel.style.display = 'none';
      if (!inTb && !inShp && shapesPanel  && shapesPanel.style.display  !== 'none') shapesPanel.style.display  = 'none';
    }, true);

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

  const PEN_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z'/%3E%3C/svg%3E") 1 23, crosshair`;
  const ERASER_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M20 20H7L3 16c-.8-.8-.8-2 0-2.8L14.6 1.6c.8-.8 2-.8 2.8 0L21 5.2c.8.8.8 2 0 2.8L10 19'/%3E%3Cline x1='2' y1='20' x2='22' y2='20'/%3E%3C/svg%3E") 3 21, crosshair`;

  function setTool(tool) {
    activeTool = tool;
    commitTextInput();
    if (!toolbar) return;
    toolbar.querySelectorAll('[data-tool]').forEach(b => b.classList.remove('ec-act'));
    const key = tool === null ? 'move' : tool;
    const btn = toolbar.querySelector(`[data-tool="${key}"]`);
    if (btn) btn.classList.add('ec-act');
    updateAnnCursor();
  }

  function updateAnnCursor() {
    if (!annCanvas) return;
    if (activeTool === 'pen')         annCanvas.style.setProperty('cursor', PEN_CURSOR, 'important');
    else if (activeTool === 'eraser') annCanvas.style.setProperty('cursor', ERASER_CURSOR, 'important');
    else if (activeTool === 'shape')  annCanvas.style.setProperty('cursor', 'crosshair', 'important');
    else if (activeTool === 'text')   annCanvas.style.setProperty('cursor', 'text', 'important');
    else                              annCanvas.style.setProperty('cursor', 'move', 'important');
  }

  function setColor(color) {
    activeColor = color;
    updateColorBtn();
  }

  /* ══════════════════════════════════
     SELECTION SHOW/HIDE
  ══════════════════════════════════ */
  function showSel(r) {
    selRect = { ...r };
    activeTool = null;
    posSelBox(r);
    ensureHandles(); posHandles(r);
    posAnnCanvas(r);
    posToolbar(r);
    setTool(null);
    state = S.SELECTED;
    unhighlight();
  }

  function updateSel(r) {
    selRect = { ...r };
    posSelBox(r);
    posHandles(r);
    posAnnCanvas(r);
    posToolbar(r);
  }

  function clearSel() {
    state = captureMode === 'drag' ? S.DRAG_READY : S.HOVER;
    selRect = null; strokes = []; currentStroke = null;
    isMovingSel = false; moveStart = null;
    activeTool = null;
    if (selBox)    selBox.style.display = 'none';
    if (annCanvas) { annCanvas.style.display = 'none'; annCanvas.style.pointerEvents = 'none'; }
    if (toolbar)   toolbar.style.display = 'none';
    hideHandles();
    hideOverlay();
  }

  function clearAnnotations() {
    if (!annCtx || !annCanvas) return;
    annCtx.clearRect(0, 0, annCanvas.width, annCanvas.height);
    strokes = [];
    currentStroke = null;
  }

  /* ══════════════════════════════════
     HOVER HIGHLIGHTING (click mode only)
  ══════════════════════════════════ */
  function getElementLuminance(el) {
    let current = el;
    while (current) {
      const cs = window.getComputedStyle(current);
      const bg = cs.backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (m) return (parseInt(m[1]) * 299 + parseInt(m[2]) * 587 + parseInt(m[3]) * 114) / 1000;
      }
      current = current.parentElement;
    }
    return 255;
  }

  function highlight(el) {
    if (el === hoveredEl) return;
    unhighlight();
    if (!el || isOurs(el)) return;
    hoveredEl = el;
    const existingRadius = parseFloat(window.getComputedStyle(el).borderRadius) || 0;
    const radius = Math.max(existingRadius, 6);
    el.dataset.__ecPrevRadius = el.style.borderRadius || '';
    el.style.setProperty('border-radius', radius + 'px', 'important');
    const lum = getElementLuminance(el);
    const oc = lum < 128 ? '#ffffff' : '#1a1a1a';
    const ocAlpha = lum < 128 ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)';
    el.style.setProperty('box-shadow', `0 0 0 2px ${oc}, 0 0 8px ${ocAlpha}`, 'important');
    el.classList.add('__ec-hl');
  }

  function unhighlight() {
    if (!hoveredEl) return;
    hoveredEl.classList.remove('__ec-hl');
    hoveredEl.style.removeProperty('box-shadow');
    const prev = hoveredEl.dataset.__ecPrevRadius;
    if (prev !== undefined) {
      hoveredEl.style.borderRadius = prev;
      delete hoveredEl.dataset.__ecPrevRadius;
    }
    hoveredEl = null;
  }

  function hasVisualBoundary(el) {
    const cs = window.getComputedStyle(el);
    const bg = cs.backgroundColor;
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return true;
    if (cs.borderTopWidth && parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== 'none') return true;
    if (cs.boxShadow && cs.boxShadow !== 'none') return true;
    if (cs.borderRadius && parseFloat(cs.borderRadius) > 0) return true;
    if (cs.backgroundImage && cs.backgroundImage !== 'none') return true;
    return false;
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

    if (hasVisualBoundary(el)) return el;

    let cur = el.parentElement;
    for (let i = 0; i < 4 && cur && cur !== document.body; i++) {
      if (hasVisualBoundary(cur)) return cur;
      cur = cur.parentElement;
    }
    return el;
  }

  function isOurs(el) {
    if (!el) return false;
    if (el.id && el.id.startsWith('__ec')) return true;
    if (el.classList && el.classList.contains('ec-hnd')) return true;
    if (el.closest && el.closest('#__ec-tb,#__ec-sel,#__ec-ann,#__ec-shield,#__ec-pal,#__ec-shapes,#__ec-textinput')) return true;
    return false;
  }

  /* ══════════════════════════════════
     ANNOTATION DRAWING (stroke-based)
  ══════════════════════════════════ */
  let strokes = [];
  let currentStroke = null;

  function canPos(e) {
    const r = annCanvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function drawStroke(ctx, s) {
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = s.color;
    ctx.fillStyle   = s.color;
    ctx.lineWidth   = s.width || 2.5;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';

    if (s.type === 'pen' || !s.type) {
      const pts = s.points;
      if (!pts || pts.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        const prev = pts[i - 1], cur = pts[i];
        const mx = (prev.x + cur.x) / 2, my = (prev.y + cur.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
      }
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.stroke();
    } else if (s.type === 'rect') {
      const x = Math.min(s.x1, s.x2), y = Math.min(s.y1, s.y2);
      const w = Math.abs(s.x2 - s.x1), h = Math.abs(s.y2 - s.y1);
      const r = Math.min(6, w / 4, h / 4);
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h);
      ctx.stroke();
    } else if (s.type === 'ellipse') {
      const cx = (s.x1 + s.x2) / 2, cy = (s.y1 + s.y2) / 2;
      const rx = Math.abs(s.x2 - s.x1) / 2, ry = Math.abs(s.y2 - s.y1) / 2;
      if (rx < 2 || ry < 2) return;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (s.type === 'arrow') {
      const dx = s.x2 - s.x1, dy = s.y2 - s.y1;
      const len = Math.hypot(dx, dy);
      if (len < 4) return;
      const angle = Math.atan2(dy, dx);
      const hw = Math.min(16, len * 0.4);
      ctx.beginPath();
      ctx.moveTo(s.x1, s.y1);
      ctx.lineTo(s.x2, s.y2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(s.x2, s.y2);
      ctx.lineTo(s.x2 - hw * Math.cos(angle - Math.PI / 6), s.y2 - hw * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(s.x2 - hw * Math.cos(angle + Math.PI / 6), s.y2 - hw * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    } else if (s.type === 'text') {
      ctx.font = `${s.fontWeight || 500} ${s.fontSize || 18}px -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.fillStyle = s.color;
      ctx.fillText(s.text, s.x, s.y);
    }
  }

  function redrawAllStrokes() {
    if (!annCtx || !annCanvas) return;
    annCtx.clearRect(0, 0, annCanvas.width, annCanvas.height);
    for (const s of strokes) drawStroke(annCtx, s);
    if (shapePreview) drawStroke(annCtx, shapePreview);
  }

  function distToSegment(px, py, ax, ay, bx, by) {
    const dx = bx - ax, dy = by - ay;
    const len2 = dx * dx + dy * dy;
    if (len2 === 0) return Math.hypot(px - ax, py - ay);
    let t = ((px - ax) * dx + (py - ay) * dy) / len2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
  }

  function strokeHitTest(stroke, px, py, threshold) {
    const t = stroke.type;
    if (t === 'pen' || !t) {
      const pts = stroke.points;
      if (!pts) return false;
      for (let i = 1; i < pts.length; i++) {
        if (distToSegment(px, py, pts[i-1].x, pts[i-1].y, pts[i].x, pts[i].y) < threshold) return true;
      }
      return false;
    }
    if (t === 'rect' || t === 'ellipse' || t === 'arrow') {
      const cx = (stroke.x1 + stroke.x2) / 2, cy = (stroke.y1 + stroke.y2) / 2;
      return Math.hypot(px - cx, py - cy) < Math.max(threshold, Math.abs(stroke.x2 - stroke.x1) / 2 + threshold);
    }
    if (t === 'text') {
      return Math.hypot(px - stroke.x, py - stroke.y) < threshold * 2;
    }
    return false;
  }

  function eraseAtPoint(px, py) {
    const before = strokes.length;
    strokes = strokes.filter(s => !strokeHitTest(s, px, py, 14));
    if (strokes.length < before) redrawAllStrokes();
  }

  let lastMid = null;

  function commitTextInput() {
    if (!textInputEl) return;
    const txt = textInputEl.value.trim();
    if (txt && annCtx) {
      const x = parseFloat(textInputEl.style.left) - annCanvas.getBoundingClientRect().left;
      const y = parseFloat(textInputEl.style.top)  - annCanvas.getBoundingClientRect().top + 18;
      strokes.push({ type: 'text', color: activeColor, x, y, text: txt, fontSize: 18 });
      redrawAllStrokes();
    }
    textInputEl.remove();
    textInputEl = null;
  }

  function spawnTextInput(e) {
    commitTextInput();
    const inp = document.createElement('textarea');
    inp.id = '__ec-textinput';
    inp.rows = 1;
    inp.style.left = e.clientX + 'px';
    inp.style.top  = e.clientY + 'px';
    inp.style.color = activeColor + ' !important';
    inp.addEventListener('blur', commitTextInput);
    inp.addEventListener('keydown', ev => {
      if (ev.key === 'Escape') { textInputEl.value = ''; commitTextInput(); ev.stopPropagation(); }
      ev.stopPropagation();
    });
    inp.addEventListener('input', () => { inp.style.width = Math.max(60, inp.scrollWidth) + 'px'; });
    document.documentElement.appendChild(inp);
    textInputEl = inp;
    requestAnimationFrame(() => inp.focus());
  }

  function onAnnDown(e) {
    if (e.button !== 0) return;
    e.preventDefault(); e.stopPropagation();

    if (activeTool === 'text') {
      spawnTextInput(e);
      return;
    }

    if (activeTool === null) {
      isMovingSel = true;
      moveStart = { x: e.clientX, y: e.clientY };
      return;
    }

    const p = canPos(e);

    if (activeTool === 'eraser') {
      isDrawing = true;
      eraseAtPoint(p.x, p.y);
      return;
    }

    if (activeTool === 'shape') {
      isDrawing = true;
      drawOrigin = p;
      shapePreview = { type: activeShape, color: activeColor, width: 2.5, x1: p.x, y1: p.y, x2: p.x, y2: p.y };
      return;
    }

    isDrawing = true;
    drawOrigin = p;
    lastMid = null;
    currentStroke = { type: 'pen', color: activeColor, width: 2.5, points: [p] };
  }

  function onAnnMove(e) {
    if (isMovingSel && selRect) {
      e.preventDefault();
      const dx = e.clientX - moveStart.x;
      const dy = e.clientY - moveStart.y;
      moveStart = { x: e.clientX, y: e.clientY };
      updateSel({
        left:   selRect.left + dx,
        top:    selRect.top  + dy,
        width:  selRect.width,
        height: selRect.height
      });
      showOverlay(selRect);
      return;
    }

    if (!isDrawing) return;
    e.preventDefault();
    const p = canPos(e);

    if (activeTool === 'eraser') {
      eraseAtPoint(p.x, p.y);
      return;
    }

    if (activeTool === 'shape' && shapePreview) {
      shapePreview.x2 = p.x;
      shapePreview.y2 = p.y;
      redrawAllStrokes();
      return;
    }

    if (activeTool === 'pen' && currentStroke) {
      currentStroke.points.push(p);
      annCtx.globalCompositeOperation = 'source-over';
      annCtx.strokeStyle = activeColor;
      annCtx.lineWidth = 2.5;
      annCtx.lineCap = 'round';
      annCtx.lineJoin = 'round';

      const mid = { x: (drawOrigin.x + p.x) / 2, y: (drawOrigin.y + p.y) / 2 };
      annCtx.beginPath();
      if (lastMid) {
        annCtx.moveTo(lastMid.x, lastMid.y);
        annCtx.quadraticCurveTo(drawOrigin.x, drawOrigin.y, mid.x, mid.y);
      } else {
        annCtx.moveTo(drawOrigin.x, drawOrigin.y);
        annCtx.lineTo(mid.x, mid.y);
      }
      annCtx.stroke();

      lastMid = mid;
      drawOrigin = p;
    }
  }

  function onAnnUp(e) {
    if (isMovingSel) {
      e.preventDefault(); e.stopPropagation();
      isMovingSel = false;
      moveStart = null;
      return;
    }

    if (!isDrawing) return;
    e.preventDefault(); e.stopPropagation();
    isDrawing = false;
    lastMid = null;

    if (activeTool === 'shape' && shapePreview) {
      const hasSize = Math.abs(shapePreview.x2 - shapePreview.x1) > 4 || Math.abs(shapePreview.y2 - shapePreview.y1) > 4;
      if (hasSize) strokes.push({ ...shapePreview });
      shapePreview = null;
      redrawAllStrokes();
    } else if (currentStroke && currentStroke.points.length > 1) {
      strokes.push(currentStroke);
    }
    currentStroke = null;
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
    // Allow clicks on the shield (our click surface) — block clicks on toolbar/handles/etc.
    if (isOurs(e.target) && e.target !== shield) return;

    if (state === S.HOVER) {
      potentialDrag = true;
      dragStart = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    } else if (state === S.DRAG_READY) {
      // Drag mode: immediately start drawing
      state = S.DRAG;
      dragStart = { x: e.clientX, y: e.clientY };
      ensureSelBox();
      e.preventDefault();
    } else if (state === S.SELECTED) {
      clearSel();
    }
  }

  function onMouseMove(e) {
    if (!window.__elementCaptureActive) return;

    if (state === S.HOVER && captureMode === 'click') {
      // Click mode: just update hover highlight — never enter drag from click mode
      if (!potentialDrag) {
        const raw = elementUnderCursor(e.clientX, e.clientY);
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
        state = captureMode === 'drag' ? S.DRAG_READY : S.HOVER;
        return;
      }
      showSel(r);

    } else if (state === S.HOVER && potentialDrag && captureMode === 'click') {
      potentialDrag = false;
      // Note: e.target is always the shield div in click mode — don't use isOurs check.
      // Just check that we have a highlighted element to capture.
      if (hoveredEl) {
        e.preventDefault(); e.stopPropagation();
        const el = hoveredEl;
        unhighlight();
        const br = el.getBoundingClientRect();
        selRect = { left: br.left, top: br.top, width: br.width, height: br.height };
        const cs = window.getComputedStyle(el);
        captureRadius = selCornerRadius > 0
          ? Math.max(parseFloat(cs.borderRadius) || 0, selCornerRadius)
          : 0;
        doCapture().then(() => { selRect = null; });
      }
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') {
      chrome.runtime.sendMessage({ type: 'DEACTIVATE_GLOBAL' }).catch(() => {});
      deactivate();
      return;
    }
    if (e.key === 'Enter' && state === S.SELECTED) { e.preventDefault(); doSave(); }
    if (e.key === 'c' && (e.metaKey||e.ctrlKey) && state === S.SELECTED) { e.preventDefault(); doCapture(); }
  }

  function mkRect(a, b) {
    return { left:Math.min(a.x,b.x), top:Math.min(a.y,b.y), width:Math.abs(b.x-a.x), height:Math.abs(b.y-a.y) };
  }

  /* ══════════════════════════════════
     CAPTURE — click mode (element)
  ══════════════════════════════════ */
  async function doCapture(fromToolbar = false) {
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
      await mergeAndCopy(base64);
      toast('Copied ✓');
      success = true;
    } catch (err) {
      toast('Failed: ' + err.message, true);
      if (fromToolbar && selRect) {
        posSelBox(selRect); posHandles(selRect);
        if (toolbar)   toolbar.style.display = 'flex';
        if (annCanvas) annCanvas.style.visibility = 'visible';
      }
    }

    if (success) {
      hideHint();
      chrome.runtime.sendMessage({ type: 'DEACTIVATE_GLOBAL' }).catch(() => {});
      deactivate();
    }
  }

  /* ══════════════════════════════════
     SAVE — drag mode (to downloads)
  ══════════════════════════════════ */
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

  /* ══════════════════════════════════
     FULL SCREENSHOT — entire visible tab
  ══════════════════════════════════ */
  async function doFullCapture() {
    await sleep(80);

    try {
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

      const response = await fetch('data:image/png;base64,' + base64);
      const blob = await response.blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      toast('Copied ✓');
    } catch (err) {
      toast('Failed: ' + err.message, true);
    }

    chrome.runtime.sendMessage({ type: 'DEACTIVATE_GLOBAL' }).catch(() => {});
    deactivate();
  }

  /* ══════════════════════════════════
     IMAGE HELPERS
  ══════════════════════════════════ */
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

    const rad = Math.round((captureRadius || selCornerRadius) * dpr);
    if (rad > 0) {
      ctx.beginPath();
      ctx.roundRect(0, 0, sw, sh, rad);
      ctx.clip();
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    if (annCanvas && annCanvas.width > 0) ctx.drawImage(annCanvas, 0, 0, sw, sh);

    captureRadius = 0;
    return new Promise(res => c.toBlob(res, 'image/png'));
  }

  function loadImage(src) {
    return new Promise((res, rej) => {
      const i = new Image(); i.onload=()=>res(i); i.onerror=rej; i.src=src;
    });
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  /* ══════════════════════════════════
     CLICK BLOCKER
  ══════════════════════════════════ */
  function blockClick(e) {
    if (!window.__elementCaptureActive) return;
    if (isOurs(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
  }

  /* ══════════════════════════════════
     ACTIVATE / DEACTIVATE
  ══════════════════════════════════ */
  function activate(mode = 'click') {
    captureMode = mode;

    if (window.__elementCaptureActive) {
      // Already active — switch mode
      if (mode === 'full') { doFullCapture(); return; }
      if (mode === 'drag') {
        unhighlight(); clearSel();
        state = S.DRAG_READY;
        if (shield) shield.classList.add('drag-ready');
        return;
      }
      // click mode: reset to hover
      unhighlight(); clearSel();
      state = S.HOVER;
      if (shield) shield.classList.remove('drag-ready');
      return;
    }

    window.__elementCaptureActive = true;
    injectStyles();
    computeOutlineColor();
    createShield();

    document.addEventListener('mousedown', onMouseDown, true);
    document.addEventListener('mousemove', onMouseMove, true);
    document.addEventListener('mouseup',   onMouseUp,   true);
    document.addEventListener('keydown',   onKeyDown,   true);
    document.addEventListener('click',       blockClick, true);
    document.addEventListener('auxclick',    blockClick, true);
    document.addEventListener('dblclick',    blockClick, true);
    document.addEventListener('contextmenu', blockClick, true);
    document.addEventListener('submit',      blockClick, true);

    chrome.runtime.sendMessage({ type: 'TAB_ACTIVATED', mode });

    if (mode === 'full') {
      doFullCapture();
    } else if (mode === 'drag') {
      state = S.DRAG_READY;
      if (shield) shield.classList.add('drag-ready');
      showModeHint('Click to drag');
    } else {
      state = S.HOVER;
      showModeHint('Click to capture');
    }
  }

  function deactivate() {
    if (!window.__elementCaptureActive) return;
    window.__elementCaptureActive = false;
    state = S.HOVER;
    captureMode = 'click';
    hideHint();
    unhighlight(); clearSel(); hideOverlay();
    removeShield();
    document.removeEventListener('mousedown', onMouseDown, true);
    document.removeEventListener('mousemove', onMouseMove, true);
    document.removeEventListener('mouseup',   onMouseUp,   true);
    document.removeEventListener('keydown',   onKeyDown,   true);
    document.removeEventListener('click',       blockClick, true);
    document.removeEventListener('auxclick',    blockClick, true);
    document.removeEventListener('dblclick',    blockClick, true);
    document.removeEventListener('contextmenu', blockClick, true);
    document.removeEventListener('submit',      blockClick, true);
    chrome.runtime.sendMessage({ type: 'TAB_DEACTIVATED' });
  }

  /* ══════════════════════════════════
     MODE HINT  (5-second activation label)
  ══════════════════════════════════ */
  let hintTimer = null;

  function showModeHint(text) {
    const old = document.getElementById('__ec-hint');
    if (old) old.remove();
    clearTimeout(hintTimer);

    const h = document.createElement('div');
    h.id = '__ec-hint';
    h.style.cssText = [
      'position:fixed !important',
      'bottom:24px !important',
      'left:50% !important',
      'transform:translateX(-50%) translateY(8px) !important',
      'z-index:2147483647 !important',
      'pointer-events:none !important',
      'background:rgba(10,11,22,0.92) !important',
      'border:1px solid rgba(0,230,118,0.25) !important',
      'border-radius:999px !important',
      'padding:8px 18px !important',
      'font:600 12px -apple-system,BlinkMacSystemFont,sans-serif !important',
      'color:#fff !important',
      'letter-spacing:0.01em !important',
      'white-space:nowrap !important',
      'box-shadow:0 4px 20px rgba(0,0,0,0.5) !important',
      'backdrop-filter:blur(12px) !important',
      '-webkit-backdrop-filter:blur(12px) !important',
      'opacity:0 !important',
      'transition:opacity 0.2s ease, transform 0.2s ease !important',
    ].join(';');
    h.textContent = text;
    document.documentElement.appendChild(h);

    requestAnimationFrame(() => {
      h.style.setProperty('opacity', '1', 'important');
      h.style.setProperty('transform', 'translateX(-50%) translateY(0)', 'important');
    });

    hintTimer = setTimeout(() => {
      h.style.setProperty('opacity', '0', 'important');
      h.style.setProperty('transform', 'translateX(-50%) translateY(8px)', 'important');
      setTimeout(() => h.remove(), 250);
    }, 5000);
  }

  function hideHint() {
    clearTimeout(hintTimer);
    const h = document.getElementById('__ec-hint');
    if (h) {
      h.style.setProperty('opacity', '0', 'important');
      setTimeout(() => h.remove(), 250);
    }
  }

  /* ══════════════════════════════════
     TOAST
  ══════════════════════════════════ */
  function toast(msg, isError = false) {
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

  /* ══════════════════════════════════
     MESSAGES
  ══════════════════════════════════ */
  chrome.runtime.onMessage.addListener((msg, _s, sendResponse) => {
    if (msg.type === 'ACTIVATE_MODE') {
      activate(msg.mode || 'click');
      try { sendResponse({ ok: true }); } catch(_) {}
      return false;
    }
    if (msg.type === 'DEACTIVATE') {
      deactivate();
      try { sendResponse({ ok: true }); } catch(_) {}
      return false;
    }
  });

  /* ══════════════════════════════════
     BFCACHE
  ══════════════════════════════════ */
  window.addEventListener('pagehide', (e) => {
    if (e.persisted) {
      window.__elementCaptureActive = false;
      state = S.HOVER;
      unhighlight(); clearSel(); hideOverlay();
      removeShield();
      document.removeEventListener('mousedown', onMouseDown, true);
      document.removeEventListener('mousemove', onMouseMove, true);
      document.removeEventListener('mouseup',   onMouseUp,   true);
      document.removeEventListener('keydown',   onKeyDown,   true);
      document.removeEventListener('click',       blockClick, true);
      document.removeEventListener('auxclick',    blockClick, true);
      document.removeEventListener('dblclick',    blockClick, true);
      document.removeEventListener('contextmenu', blockClick, true);
      document.removeEventListener('submit',      blockClick, true);
    }
  });

  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      chrome.runtime.sendMessage({ type: 'GET_STATE' }, (res) => {
        if (chrome.runtime.lastError) return;
        if (res && res.active) activate(res.mode || 'click');
      });
    }
  });

})();
