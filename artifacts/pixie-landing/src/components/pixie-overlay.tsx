import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";

const SEMANTIC = new Set(['a', 'button', 'input', 'textarea', 'select', 'img', 'video', 'canvas', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'kbd', 'label']);
const SKIP = new Set(['html', 'body', 'path', 'circle', 'rect', 'g', 'polygon', 'line', 'polyline', 'defs', 'use', 'stop', 'clippath', 'lineargradient', 'radialgradient', 'ellipse']);

function isInDemoArea(el: Element): boolean {
  return !!el.closest('.pixie-demo-area');
}

function findTarget(x: number, y: number): Element | null {
  const elements = document.elementsFromPoint(x, y);
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let found: Element | null = null;

  for (const el of elements) {
    const tag = el.tagName.toLowerCase();
    if (SKIP.has(tag)) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width > vw * 0.95 || rect.height > vh * 0.88) continue;
    if (tag === 'svg' && rect.width < 30 && rect.height < 30) continue;
    if (SEMANTIC.has(tag) && rect.width > 10 && rect.height > 6) { found = el; break; }
    if (tag === 'svg') { found = el; break; }
    if (tag === 'span' && rect.width > 10 && rect.height > 8) { found = el; break; }
    if (tag === 'div' && rect.width > 60 && rect.height > 28 && rect.width < vw * 0.88 && rect.height < vh * 0.65) { found = el; break; }
    if (tag === 'li' && rect.width > 20 && rect.height > 10) { found = el; break; }
  }

  if (!found) return null;
  const foundTag = found.tagName.toLowerCase();

  if (['img', 'svg'].includes(foundTag)) {
    const rect = found.getBoundingClientRect();
    if (rect.width < 40 && rect.height < 40) {
      const parent = found.closest('a, button');
      if (parent) found = parent;
    }
  }
  if (foundTag === 'span') {
    const parent = found.closest('a, button');
    if (parent) found = parent;
  }
  if (!isInDemoArea(found)) {
    const card = found.closest('[data-pixie-card]');
    if (card) return card;
  }
  return found;
}

function getOutline(el: Element): { pad: number; radius: number } {
  const tag = el.tagName.toLowerCase();
  let br = 4;
  try { br = parseFloat(window.getComputedStyle(el).borderRadius) || 4; } catch {}
  if (br === 0) br = 4;
  if ((el as HTMLElement).dataset?.pixieCard) return { pad: 3, radius: br };
  if (['a', 'button'].includes(tag)) return { pad: 1, radius: br };
  if (['h1', 'h2', 'h3'].includes(tag)) return { pad: 3, radius: 8 };
  if (tag === 'p') return { pad: 2, radius: 6 };
  if (tag === 'img') return { pad: 1, radius: br };
  return { pad: 2, radius: br };
}

interface BoxInfo {
  x: number;
  y: number;
  w: number;
  h: number;
  radius: number;
}

async function captureRegion(box: BoxInfo, overlayId: string): Promise<void> {
  const overlay = document.getElementById(overlayId);
  if (overlay) overlay.style.display = 'none';

  const scale = 2;
  const sx = window.scrollX;
  const sy = window.scrollY;

  try {
    const raw = await html2canvas(document.body, {
      scale,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      x: box.x + sx,
      y: box.y + sy,
      width: box.w,
      height: box.h,
      scrollX: -sx,
      scrollY: -sy,
      windowWidth: document.documentElement.clientWidth,
      windowHeight: document.documentElement.clientHeight,
    });

    const r = box.radius * scale;
    const cw = raw.width;
    const ch = raw.height;

    const out = document.createElement('canvas');
    out.width = cw;
    out.height = ch;
    const ctx = out.getContext('2d');
    if (!ctx) return;

    if (r > 0) {
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(cw - r, 0);
      ctx.quadraticCurveTo(cw, 0, cw, r);
      ctx.lineTo(cw, ch - r);
      ctx.quadraticCurveTo(cw, ch, cw - r, ch);
      ctx.lineTo(r, ch);
      ctx.quadraticCurveTo(0, ch, 0, ch - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.clip();
    }

    ctx.drawImage(raw, 0, 0);

    await new Promise<void>((resolve) => {
      out.toBlob(async (blob) => {
        if (!blob) { resolve(); return; }
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        } catch {}
        resolve();
      }, 'image/png');
    });
  } finally {
    if (overlay) overlay.style.display = '';
  }
}

const OVERLAY_ID = 'pixie-global-overlay';

export function PixieGlobalOverlay() {
  const [box, setBox] = useState<BoxInfo | null>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
  const [inDemo, setInDemo] = useState(false);
  const [status, setStatus] = useState<'idle' | 'capturing' | 'copied'>('idle');
  const targetRef = useRef<Element | null>(null);
  const boxRef = useRef<BoxInfo | null>(null);
  const copiedTimer = useRef<ReturnType<typeof setTimeout>>();
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'pixie-cursor-override';
    style.textContent = '* { cursor: default !important; }';
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setMouse({ x: e.clientX, y: e.clientY });
        const target = findTarget(e.clientX, e.clientY);
        targetRef.current = target;
        const demo = target ? isInDemoArea(target) : false;
        setInDemo(demo);
        if (target) {
          const r2 = target.getBoundingClientRect();
          const { pad, radius } = getOutline(target);
          const b: BoxInfo = { x: r2.left - pad, y: r2.top - pad, w: r2.width + pad * 2, h: r2.height + pad * 2, radius };
          setBox(b);
          boxRef.current = b;
        } else {
          setBox(null);
          boxRef.current = null;
        }
      });
    }

    async function onClick(e: MouseEvent) {
      const target = targetRef.current;
      const currentBox = boxRef.current;
      if (!target || !currentBox || isInDemoArea(target)) return;
      e.preventDefault();
      e.stopPropagation();
      setStatus('capturing');
      try {
        await captureRegion(currentBox, OVERLAY_ID);
        setStatus('copied');
        clearTimeout(copiedTimer.current);
        copiedTimer.current = setTimeout(() => setStatus('idle'), 2200);
      } catch {
        setStatus('idle');
      }
    }

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', () => { setBox(null); setMouse(null); boxRef.current = null; });
    document.addEventListener('click', onClick, { capture: true });
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('click', onClick, { capture: true });
      cancelAnimationFrame(rafRef.current);
      clearTimeout(copiedTimer.current);
    };
  }, []);

  const labelText = status === 'copied' ? 'Copied!' : status === 'capturing' ? 'Capturing…' : 'Click to capture';

  return (
    <div id={OVERLAY_ID} style={{ pointerEvents: 'none' }}>
      {box && (
        <div style={{
          position: 'fixed',
          left: box.x,
          top: box.y,
          width: box.w,
          height: box.h,
          border: '2px solid #34D399',
          borderRadius: `${box.radius}px`,
          background: status === 'copied' ? 'rgba(52,211,153,0.09)' : 'rgba(52,211,153,0.04)',
          pointerEvents: 'none',
          zIndex: 99999,
        }} />
      )}
      {mouse && box && !inDemo && (
        <div style={{
          position: 'fixed',
          left: mouse.x + 34,
          top: mouse.y - 50,
          background: '#171717',
          borderRadius: '8px',
          padding: '5px 10px',
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'none',
          zIndex: 100000,
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 12px rgba(0,0,0,0.22)',
        }}>
          <span style={{ fontSize: '10px', fontWeight: 600, color: '#fff', fontFamily: 'Arial, sans-serif' }}>
            {labelText}
          </span>
        </div>
      )}
    </div>
  );
}
