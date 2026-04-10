import { useEffect, useRef, useState, useCallback } from "react";
import html2canvas from "html2canvas";

/* ── Only ever return the [data-pixie-card] element itself ──────────────────
   Hovering anywhere inside a card (including demo animations) highlights
   the whole card. Hovering outside any card returns null.
   ────────────────────────────────────────────────────────────────────────── */
function findCard(x: number, y: number): Element | null {
  const elements = document.elementsFromPoint(x, y);
  for (const el of elements) {
    const card = el.closest('[data-pixie-card]');
    if (card) return card;
  }
  return null;
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

async function captureCard(card: Element): Promise<boolean> {
  const scale = 2;
  const radius = parseFloat(window.getComputedStyle(card).borderRadius) || 20;

  const raw = await html2canvas(card as HTMLElement, {
    scale,
    useCORS: true,
    logging: false,
    backgroundColor: null,
    removeContainer: true,
  });

  const cw = raw.width;
  const ch = raw.height;
  const r = radius * scale;

  const out = document.createElement('canvas');
  out.width = cw;
  out.height = ch;
  const ctx = out.getContext('2d');
  if (!ctx) return false;

  if (r > 0) roundedClip(ctx, cw, ch, r);
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

interface BoxInfo { x: number; y: number; w: number; h: number; radius: number; }

export function PixieGlobalOverlay() {
  const [box, setBox]     = useState<BoxInfo | null>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
  const [toast, setToast] = useState(false);
  const [busy, setBusy]   = useState(false);

  const targetRef   = useRef<Element | null>(null);
  const toastTimer  = useRef<ReturnType<typeof setTimeout>>();
  const rafRef      = useRef<number>(0);

  /* Force default cursor inside the active zone */
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'pixie-cursor-override';
    style.textContent = '[data-pixie-active-zone] * { cursor: default !important; }';
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  const showToast = useCallback(() => {
    setToast(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(false), 900);
  }, []);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setMouse({ x: e.clientX, y: e.clientY });
        const card = findCard(e.clientX, e.clientY);
        targetRef.current = card;
        if (card) {
          const r = card.getBoundingClientRect();
          const radius = parseFloat(window.getComputedStyle(card).borderRadius) || 20;
          setBox({ x: r.left - 1, y: r.top - 1, w: r.width + 2, h: r.height + 2, radius });
        } else {
          setBox(null);
        }
      });
    }

    async function onClick(e: MouseEvent) {
      const card = targetRef.current;
      if (!card || busy) return;
      e.preventDefault();
      e.stopPropagation();
      setBusy(true);
      try {
        const ok = await captureCard(card);
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
      {/* Green outline — only ever around the whole card */}
      {box && (
        <div
          style={{
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
            transition: 'left 0.08s ease, top 0.08s ease, width 0.08s ease, height 0.08s ease',
          }}
        />
      )}

      {/* Tooltip — only shows when hovering a card */}
      {mouse && box && (
        <div
          style={{
            position: 'fixed',
            left: mouse.x + 14,
            top: mouse.y - 34,
            background: '#171717',
            borderRadius: '7px',
            padding: '5px 10px',
            pointerEvents: 'none',
            zIndex: 100000,
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 12px rgba(0,0,0,0.22)',
            lineHeight: 1,
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#fff', fontFamily: 'Arial, sans-serif', lineHeight: 1, display: 'block' }}>
            Click to capture
          </span>
        </div>
      )}

      {/* Toast notification */}
      <div
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          background: '#171717',
          borderRadius: '10px',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          pointerEvents: 'none',
          zIndex: 100001,
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          opacity: toast ? 1 : 0,
          transform: toast ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.15s ease, transform 0.15s ease',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round">
          <path d="M5 13l4 4L19 7" />
        </svg>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff', fontFamily: 'Arial, sans-serif' }}>
          Image copied
        </span>
      </div>
    </>
  );
}
