import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import chromeLogo from "@assets/image_1775809932785.png";

function AppleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

type Box = { x: number; y: number; w: number; h: number };

// steps: 0=wait, 1=on h1, 2=on p, 3=on mac btn, 4=on chrome btn, 5=fade out
const STEP_TIMINGS = [800, 1500, 1500, 1300, 1300, 1600];

// padding around outline per step (px each side)
const OUTLINE_PAD: Record<number, number> = { 1: 5, 2: 4, 3: 2, 4: 2 };
const OUTLINE_RADIUS: Record<number, string> = { 1: "8px", 2: "6px", 3: "14px", 4: "14px" };

function HeroCursorOverlay({ sectionEl }: { sectionEl: HTMLElement | null }) {
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const macRef = useRef<HTMLAnchorElement>(null);
  const chromeRef = useRef<HTMLAnchorElement>(null);

  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [boxes, setBoxes] = useState<Box[]>([]);

  const doMeasure = useCallback(() => {
    if (!sectionEl) return;
    const sr = sectionEl.getBoundingClientRect();
    const m = (el: HTMLElement | null): Box => {
      if (!el) return { x: 0, y: 0, w: 0, h: 0 };
      const r = el.getBoundingClientRect();
      return { x: r.left - sr.left, y: r.top - sr.top, w: r.width, h: r.height };
    };
    setBoxes([
      m(h1Ref.current),
      m(pRef.current),
      m(macRef.current),
      m(chromeRef.current),
    ]);
  }, [sectionEl]);

  useEffect(() => {
    if (!sectionEl) return;
    doMeasure();
    const ro = new ResizeObserver(doMeasure);
    ro.observe(sectionEl);
    return () => ro.disconnect();
  }, [sectionEl, doMeasure]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible) return;
    let t: ReturnType<typeof setTimeout>;
    function advance(s: number) {
      t = setTimeout(() => {
        const next = (s + 1) % STEP_TIMINGS.length;
        setStep(next);
        advance(next);
      }, STEP_TIMINGS[s]);
    }
    advance(step);
    return () => clearTimeout(t);
  }, [visible]);

  const fading = step === 5;
  const activeBox = step >= 1 && step <= 4 ? boxes[step - 1] : null;
  const pad = OUTLINE_PAD[step] ?? 5;

  // cursor sits at the right-center edge of the active element
  const cursorX = activeBox
    ? activeBox.x + activeBox.w + 2
    : boxes[0] ? boxes[0].x + boxes[0].w + 2 : 0;
  const cursorY = activeBox
    ? activeBox.y + activeBox.h / 2 - 8
    : boxes[0] ? boxes[0].y - 8 : 0;

  return (
    <>
      <h1
        ref={h1Ref}
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: "44px",
          fontWeight: 700,
          color: "#171717",
          lineHeight: 1,
          letterSpacing: "-0.03em",
          marginBottom: "28px",
          whiteSpace: "nowrap",
          position: "relative",
        }}
      >
        The easiest way to take screenshots.
      </h1>

      <p
        ref={pRef}
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
          fontWeight: 400,
          color: "rgba(0,0,0,0.45)",
          lineHeight: 1.65,
          marginBottom: "48px",
          whiteSpace: "nowrap",
        }}
      >
        Pixie makes screen capturing effortless. Hover over any element, click once, and capture it perfectly without dragging or cropping.
      </p>

      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <a
          ref={macRef}
          href="https://github.com/FeineCapital/pixie-desktop-app/releases/latest/download/Pixie.dmg"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: "Arial, sans-serif",
            fontWeight: 700,
            fontSize: "15px",
            color: "#ffffff",
            background: "#171717",
            borderRadius: "12px",
            padding: "16px 32px",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          <AppleIcon size={16} />
          Download for Mac
        </a>

        <a
          ref={chromeRef}
          href="https://github.com/FeineCapital/pixie-chrome-extension"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: "Arial, sans-serif",
            fontWeight: 700,
            fontSize: "15px",
            color: "#171717",
            background: "transparent",
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: "12px",
            padding: "16px 32px",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          <img src={chromeLogo} alt="Chrome" style={{ width: "16px", height: "16px" }} />
          Chrome Extension
        </a>
      </div>

      {/* Green outline — tight around the active element */}
      <AnimatePresence>
        {visible && activeBox && !fading && (
          <motion.div
            key={`outline-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.08 } }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              left: activeBox.x - pad,
              top: activeBox.y - pad,
              width: activeBox.w + pad * 2,
              height: activeBox.h + pad * 2,
              border: "2px solid #34D399",
              borderRadius: OUTLINE_RADIUS[step] ?? "8px",
              background: "rgba(52,211,153,0.04)",
              pointerEvents: "none",
              zIndex: 20,
            }}
          />
        )}
      </AnimatePresence>

      {/* Cursor + label */}
      <AnimatePresence>
        {visible && (
          <motion.div
            key="cursor"
            initial={{ opacity: 0 }}
            animate={{
              left: cursorX,
              top: cursorY,
              opacity: fading ? 0 : 1,
              y: fading ? -18 : 0,
            }}
            exit={{ opacity: 0, y: -18, transition: { duration: 1.4, ease: [0.4, 0, 0.2, 1] } }}
            transition={{
              left: { duration: 1.4, ease: [0.22, 1, 0.36, 1] },
              top: { duration: 1.4, ease: [0.22, 1, 0.36, 1] },
              opacity: fading
                ? { duration: 1.4, ease: [0.4, 0, 0.2, 1] }
                : { duration: 0.3 },
              y: fading ? { duration: 1.4, ease: [0.4, 0, 0.2, 1] } : { duration: 0.3 },
            }}
            style={{
              position: "absolute",
              pointerEvents: "none",
              zIndex: 30,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 22 22" fill="none" style={{ display: "block" }}>
              <path d="M4 2L4 17L7.5 13.5L10 19L12 18L9.5 12.5L14 12.5L4 2Z" fill="white" stroke="#444" strokeWidth="0.8" strokeLinejoin="round"/>
            </svg>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [sectionEl, setSectionEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setSectionEl(sectionRef.current);
  }, []);

  return (
    <section
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 24px 80px",
        position: "relative",
        overflow: "visible",
      }}
    >
      <div
        ref={sectionRef}
        style={{
          maxWidth: "860px",
          width: "100%",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        <HeroCursorOverlay sectionEl={sectionEl} />
      </div>
    </section>
  );
}
