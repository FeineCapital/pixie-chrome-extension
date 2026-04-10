import { useEffect, useRef, useState } from "react";

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

    if (tag === 'div' && rect.width > 60 && rect.height > 28 && rect.width < vw * 0.88 && rect.height < vh * 0.65) {
      found = el; break;
    }

    if (tag === 'li' && rect.width > 20 && rect.height > 10) { found = el; break; }
  }

  if (!found) return null;

  const foundTag = found.tagName.toLowerCase();

  // Small icon (img/svg) inside a link or button → promote to the parent link/button
  if (['img', 'svg'].includes(foundTag)) {
    const rect = found.getBoundingClientRect();
    if (rect.width < 40 && rect.height < 40) {
      const parentLink = found.closest('a, button');
      if (parentLink) found = parentLink;
    }
  }

  // span inside a link or button → promote to the link/button
  if (foundTag === 'span') {
    const parentLink = found.closest('a, button');
    if (parentLink) found = parentLink;
  }

  // Element inside a pixie card and NOT inside a demo → promote to the card
  if (!isInDemoArea(found)) {
    const card = found.closest('[data-pixie-card]');
    if (card) return card;
  }

  return found;
}

function getOutline(el: Element): { pad: number; radius: string } {
  const tag = el.tagName.toLowerCase();
  let br = '4px';
  try { br = window.getComputedStyle(el).borderRadius || '4px'; } catch {}
  if (br === '0px') br = '4px';
  if ((el as HTMLElement).dataset?.pixieCard) return { pad: 3, radius: br };
  if (['a', 'button'].includes(tag)) return { pad: 1, radius: br };
  if (['h1', 'h2', 'h3'].includes(tag)) return { pad: 3, radius: '8px' };
  if (tag === 'p') return { pad: 2, radius: '6px' };
  if (tag === 'img') return { pad: 1, radius: br };
  return { pad: 2, radius: br };
}

export function PixieGlobalOverlay() {
  const [box, setBox] = useState<{ x: number; y: number; w: number; h: number; radius: string } | null>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
  const [inDemo, setInDemo] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setMouse({ x: e.clientX, y: e.clientY });
        const target = findTarget(e.clientX, e.clientY);
        const demo = target ? isInDemoArea(target) : false;
        setInDemo(demo);
        if (target) {
          const r = target.getBoundingClientRect();
          const { pad, radius } = getOutline(target);
          setBox({ x: r.left - pad, y: r.top - pad, w: r.width + pad * 2, h: r.height + pad * 2, radius });
        } else {
          setBox(null);
        }
      });
    }

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', () => { setBox(null); setMouse(null); });
    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {box && (
        <div
          style={{
            position: 'fixed',
            left: box.x,
            top: box.y,
            width: box.w,
            height: box.h,
            border: '2px solid #34D399',
            borderRadius: box.radius,
            background: 'rgba(52,211,153,0.04)',
            pointerEvents: 'none',
            zIndex: 99999,
          }}
        />
      )}
      {mouse && box && !inDemo && (
        <div
          style={{
            position: 'fixed',
            left: mouse.x + 18,
            top: mouse.y - 28,
            background: '#171717',
            borderRadius: '8px',
            padding: '4px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            pointerEvents: 'none',
            zIndex: 100000,
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          }}
        >
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
          <span style={{ fontSize: '10px', fontWeight: 600, color: '#fff', fontFamily: 'Arial, sans-serif' }}>
            Click to capture and copy to clipboard
          </span>
        </div>
      )}
    </>
  );
}
