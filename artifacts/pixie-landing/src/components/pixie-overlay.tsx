import { useEffect, useRef, useState, useCallback } from "react";
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

function roundedClip(ctx: CanvasRenderingContext2D, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(w - r, 0);
  ctx.quadraticCurveTo(w, 0, w, r);
  ctx.lineTo(w, h - r);
  ctx.quadraticCurveTo(w, h, w - r, h);
  ctx.lineTo(r, h);
  ctx.quadraticCurveTo(0, h, 0, h - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.clip();
}

async function captureTarget(target: Element, outlineRadius: number): Promise<boolean> {
  const scale = 2;

  const raw = await html2canvas(target as HTMLElement, {
    scale,
    useCORS: true,
    logging: false,
    backgroundColor: null,
    removeContainer: true,
  });

  const cw = raw.width;
  const ch = raw.height;
  const r = outlineRadius * scale;

  const out = document.createElement('canvas');
  out.width = cw;
  out.height = ch;
  const ctx = out.getContext('2d');
  if (!ctx) return false;

  if (r > 0) {
    roundedClip(ctx, cw, ch, r);
  }

  ctx.drawImage(raw, 0, 0);

  return new Promise<boolean>((resolve) => {
    out.toBlob(async (blob) => {
      if (!blob) { resolve(false); return; }
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        resolve(true);
      } catch {
        resolve(false);
      }
    }, 'image/png');
  });
}

export function PixieGlobalOverlay() {
  const [box, setBox] = useState<BoxInfo | null>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
  const [inDemo, setInDemo] = useState(false);
  const [toast, setToast] = useState(false);
  const [busy, setBusy] = useState(false);
  const targetRef = useRef<Element | null>(null);
  const radiusRef = useRef<number>(4);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'pixie-cursor-override';
    style.textContent = '* { cursor: default !important; }';
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  const showToast = useCallback(() => {
    setToast(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(false), 2200);
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
          radiusRef.current = radius;
        } else {
          setBox(null);
        }
      });
    }

    async function onClick(e: MouseEvent) {
      const target = targetRef.current;
      if (!target || isInDemoArea(target) || busy) return;
      e.preventDefault();
      e.stopPropagation();
      setBusy(true);
      try {
        const ok = await captureTarget(target, radiusRef.current);
        if (ok) showToast();
      } catch {}
      setBusy(false);
    }

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', () => { setBox(null); setMouse(null); });
    document.addEventListener('click', onClick, { capture: true });
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('click', onClick, { capture: true });
      cancelAnimationFrame(rafRef.current);
      clearTimeout(toastTimer.current);
    };
  }, [busy, showToast]);

  return (
    <>
      {box && (
        <div style={{
          position: 'fixed',
          left: box.x,
          top: box.y,
          width: box.w,
          height: box.h,
          border: '2px solid #34D399',
          borderRadius: `${box.radius}px`,
          background: 'rgba(52,211,153,0.04)',
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
          pointerEvents: 'none',
          zIndex: 100000,
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 12px rgba(0,0,0,0.22)',
        }}>
          <span style={{ fontSize: '10px', fontWeight: 600, color: '#fff', fontFamily: 'Arial, sans-serif' }}>
            Click to capture
          </span>
        </div>
      )}
      <div
        style={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          background: '#171717',
          borderRadius: '12px',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          pointerEvents: 'none',
          zIndex: 100001,
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          opacity: toast ? 1 : 0,
          transform: toast ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round">
          <path d="M5 13l4 4L19 7" />
        </svg>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff', fontFamily: 'Arial, sans-serif' }}>
          Image copied
        </span>
      </div>
    </>
  );
}
