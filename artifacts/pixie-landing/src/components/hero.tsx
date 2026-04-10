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

type Target = "h1" | "p" | "mac" | "chrome" | null;

const PAD: Record<string, number> = { h1: 5, p: 4, mac: 3, chrome: 3 };
const RADIUS: Record<string, string> = { h1: "8px", p: "6px", mac: "14px", chrome: "14px" };

function PixieOutline({ target, sectionEl, refs }: {
  target: Target;
  sectionEl: HTMLElement | null;
  refs: Record<string, React.RefObject<HTMLElement | null>>;
}) {
  const [box, setBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  useEffect(() => {
    if (!target || !sectionEl) { setBox(null); return; }
    const el = refs[target]?.current;
    if (!el) { setBox(null); return; }
    const sr = sectionEl.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setBox({ x: r.left - sr.left, y: r.top - sr.top, w: r.width, h: r.height });
  }, [target, sectionEl, refs]);

  const pad = target ? PAD[target] ?? 4 : 4;
  const radius = target ? RADIUS[target] ?? "8px" : "8px";

  return (
    <AnimatePresence>
      {target && box && (
        <motion.div
          key={target}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.08 } }}
          transition={{ duration: 0.12 }}
          style={{
            position: "absolute",
            left: box.x - pad,
            top: box.y - pad,
            width: box.w + pad * 2,
            height: box.h + pad * 2,
            border: "2px solid #34D399",
            borderRadius: radius,
            background: "rgba(52,211,153,0.04)",
            pointerEvents: "none",
            zIndex: 20,
          }}
        />
      )}
    </AnimatePresence>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [sectionEl, setSectionEl] = useState<HTMLElement | null>(null);
  const [hovered, setHovered] = useState<Target>(null);

  const h1Ref = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const macRef = useRef<HTMLAnchorElement>(null);
  const chromeRef = useRef<HTMLAnchorElement>(null);

  const refs = { h1: h1Ref, p: pRef, mac: macRef, chrome: chromeRef } as Record<string, React.RefObject<HTMLElement | null>>;

  useEffect(() => {
    setSectionEl(sectionRef.current);
  }, []);

  const enter = useCallback((t: Target) => () => setHovered(t), []);
  const leave = useCallback(() => setHovered(null), []);

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
        <PixieOutline target={hovered} sectionEl={sectionEl} refs={refs} />

        <h1
          ref={h1Ref}
          onMouseEnter={enter("h1")}
          onMouseLeave={leave}
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
            cursor: "default",
          }}
        >
          The easiest way to take screenshots.
        </h1>

        <p
          ref={pRef}
          onMouseEnter={enter("p")}
          onMouseLeave={leave}
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            fontWeight: 400,
            color: "rgba(0,0,0,0.45)",
            lineHeight: 1.65,
            marginBottom: "48px",
            whiteSpace: "nowrap",
            cursor: "default",
          }}
        >
          Pixie makes screen capturing effortless. Hover over any element, click once, and capture it perfectly without dragging or cropping.
        </p>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <a
            ref={macRef}
            onMouseEnter={enter("mac")}
            onMouseLeave={leave}
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
            onMouseEnter={enter("chrome")}
            onMouseLeave={leave}
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
      </div>
    </section>
  );
}
