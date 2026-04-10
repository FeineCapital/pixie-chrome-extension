import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import cityPhoto from "@assets/image_1775821327906.png";

function BrowserChrome({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div style={{
      width: "100%",
      background: "#1a1a1a",
      position: "relative",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px 14px",
        background: "#2a2a2a",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ display: "flex", gap: "5px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#febc2e" }} />
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#28c840" }} />
        </div>
        <div style={{
          flex: 1, marginLeft: "6px", background: "rgba(255,255,255,0.08)",
          borderRadius: "6px", height: "22px", display: "flex", alignItems: "center", padding: "0 10px",
        }}>
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", fontFamily: "Arial, sans-serif" }}>{url}</span>
        </div>
      </div>
      <div className="pixie-demo-area" style={{ position: "relative", height: "380px", overflow: "hidden", background: "#fff" }}>
        {children}
      </div>
    </div>
  );
}

function CursorWithLabel({ x, y, label, showLabel }: { x: string; y: string; label?: string; showLabel?: boolean }) {
  return (
    <motion.div
      style={{ position: "absolute", zIndex: 40, pointerEvents: "none" }}
      animate={{ left: x, top: y }}
      transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg width="18" height="18" viewBox="0 0 22 22" fill="none" style={{ display: "block" }}>
        <path d="M4 2L4 17L7.5 13.5L10 19L12 18L9.5 12.5L14 12.5L4 2Z" fill="white" stroke="#555" strokeWidth="0.8" strokeLinejoin="round"/>
      </svg>
      <AnimatePresence>
        {showLabel && label && (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.9, x: -4 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            style={{
              position: "absolute",
              left: "18px",
              top: "-22px",
              background: "#171717",
              borderRadius: "6px",
              padding: "4px 9px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              whiteSpace: "nowrap",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 13l4 4L19 7"/>
            </svg>
            <span style={{ fontSize: "10px", fontWeight: 600, color: "#fff", fontFamily: "Arial, sans-serif" }}>
              {label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CopiedNotif({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={{ position: "absolute", zIndex: 50, bottom: "14px", right: "14px", background: "#171717", borderRadius: "8px", padding: "6px 12px", display: "flex", alignItems: "center", gap: "6px" }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#34D399", fontFamily: "Arial, sans-serif" }}>Copied</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── 1. Click to capture — Stripe dashboard ────────────────────────────────────

function StripeDashboard() {
  // 0=waiting(cursor bottom-right), 1=gliding to MRR, 2=hovering+label, 3=captured, 4=copied, 5=fade out
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timings = [1200, 1000, 1400, 400, 1600, 1000];
    let t: ReturnType<typeof setTimeout>;
    function advance(s: number) {
      t = setTimeout(() => {
        const next = (s + 1) % timings.length;
        setStep(next);
        advance(next);
      }, timings[s]);
    }
    advance(0);
    return () => clearTimeout(t);
  }, []);

  const hovering = step >= 2 && step <= 4;
  const captured = step === 3 || step === 4;
  const showNotif = step === 4;
  const showLabel = step === 2 || step === 3;

  const positions: Record<number, { x: string; y: string }> = {
    0: { x: "78%", y: "78%" },
    1: { x: "11%", y: "50%" },
    2: { x: "11%", y: "50%" },
    3: { x: "11%", y: "50%" },
    4: { x: "11%", y: "50%" },
    5: { x: "78%", y: "78%" },
  };
  const pos = positions[step] ?? positions[0];

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
        <div style={{ width: "100%", height: "100%", padding: "16px 20px", overflow: "hidden", boxSizing: "border-box" as const }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <div>
              <div style={{ fontSize: "9px", color: "#697386", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "2px" }}>Total Revenue</div>
              <div style={{ fontSize: "24px", fontWeight: 700, color: "#1a1f36", letterSpacing: "-0.02em" }}>$482,194.00</div>
            </div>
            <div style={{ display: "flex", gap: "5px" }}>
              {["12M","30D","7D"].map((l, i) => (
                <div key={l} style={{ fontSize: "10px", color: i===0?"#fff":"#697386", background: i===0?"#1a1f36":"#f0f2f5", borderRadius: "5px", padding: "4px 10px", fontWeight: i===0?600:400 }}>{l}</div>
              ))}
            </div>
          </div>
          <svg width="100%" height="80" viewBox="0 0 220 60" preserveAspectRatio="none" style={{ marginBottom: "14px" }}>
            <defs>
              <linearGradient id="sg2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#635bff" stopOpacity="0.15"/>
                <stop offset="100%" stopColor="#635bff" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d="M0 55 L20 50 L40 46 L60 42 L80 38 L100 34 L120 30 L140 26 L160 20 L180 16 L200 12 L220 6" fill="none" stroke="#635bff" strokeWidth="2"/>
            <path d="M0 55 L20 50 L40 46 L60 42 L80 38 L100 34 L120 30 L140 26 L160 20 L180 16 L200 12 L220 6 L220 60 L0 60Z" fill="url(#sg2)"/>
          </svg>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
            <motion.div
              animate={{ boxShadow: hovering ? "0 0 0 2px #34D399" : "0 0 0 1px #e3e8ee", background: hovering ? "rgba(52,211,153,0.04)" : "#fff" }}
              transition={{ duration: 0.3 }}
              style={{ borderRadius: "8px", padding: "10px 12px" }}
            >
              <div style={{ fontSize: "9px", color: "#697386", marginBottom: "3px" }}>MRR</div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#1a1f36" }}>$41,280</div>
              <div style={{ fontSize: "9px", color: "#0e6245", marginTop: "3px" }}>+12.4%</div>
            </motion.div>
            {[{ label: "Customers", val: "3,847", pct: "+8.2%" }, { label: "Churn", val: "1.8%", pct: "-0.3%" }].map(c => (
              <div key={c.label} style={{ borderRadius: "8px", boxShadow: "0 0 0 1px #e3e8ee", background: "#fff", padding: "10px 12px" }}>
                <div style={{ fontSize: "9px", color: "#697386", marginBottom: "3px" }}>{c.label}</div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#1a1f36" }}>{c.val}</div>
                <div style={{ fontSize: "9px", color: c.label === "Churn" ? "#697386" : "#0e6245", marginTop: "3px" }}>{c.pct}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "10px" }}>
            {[["Enterprise Plan","$2,400.00"],["Pro Monthly","$199.00"],["Starter Annual","$588.00"]].map(([name, amt]) => (
              <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderTop: "1px solid #f2f5f9" }}>
                <div style={{ fontSize: "10px", fontWeight: 600, color: "#1a1f36" }}>{name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "9px", color: "#0e6245", background: "#edfcf2", borderRadius: "4px", padding: "2px 6px" }}>Succeeded</span>
                  <span style={{ fontSize: "10px", fontWeight: 600, color: "#1a1f36" }}>{amt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <motion.div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.28)", zIndex: 3, pointerEvents: "none" }} animate={{ opacity: captured ? 1 : 0 }} transition={{ duration: 0.2 }} />
        <CopiedNotif show={showNotif} />
        <CursorWithLabel x={pos.x} y={pos.y} />
    </div>
  );
}

// ─── 2. Drag to select — News article ─────────────────────────────────────────

function NewsArticle() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  // 0=idle, 1=move to img TL, 2=drag to img BR, 3=done, 4=captured, 5=reset
  const [step, setStep] = useState(0);
  const [imgMeas, setImgMeas] = useState({ top: 31, left: 3.5, right: 96.5, bottom: 65, w: 93, h: 34 });

  // Measure actual image position relative to container
  useEffect(() => {
    function measure() {
      const c = containerRef.current;
      const img = imgRef.current;
      if (!c || !img) return;
      const cr = c.getBoundingClientRect();
      const ir = img.getBoundingClientRect();
      if (cr.width === 0 || cr.height === 0) return;
      const top = (ir.top - cr.top) / cr.height * 100;
      const left = (ir.left - cr.left) / cr.width * 100;
      const right = (ir.right - cr.left) / cr.width * 100;
      const bottom = (ir.bottom - cr.top) / cr.height * 100;
      setImgMeas({ top, left, right, bottom, w: right - left, h: bottom - top });
    }
    const t = setTimeout(measure, 100);
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => { clearTimeout(t); ro.disconnect(); };
  }, []);

  useEffect(() => {
    const timings = [1400, 900, 2800, 500, 1600, 1000];
    let t: ReturnType<typeof setTimeout>;
    function advance(s: number) {
      t = setTimeout(() => {
        const next = (s + 1) % timings.length;
        setStep(next);
        advance(next);
      }, timings[s]);
    }
    advance(0);
    return () => clearTimeout(t);
  }, []);

  const dragging = step === 2;
  const selectionDone = step === 3 || step === 4;
  const showNotif = step === 4;

  const pct = (n: number) => n.toFixed(1) + "%";
  const imgTop = pct(imgMeas.top);
  const imgLeft = pct(imgMeas.left);
  const imgRight = pct(imgMeas.right);
  const imgBottom = pct(imgMeas.bottom);

  const cursorPositions: Record<number, { x: string; y: string }> = {
    0: { x: "82%", y: "6%" },
    1: { x: imgLeft, y: imgTop },
    2: { x: imgRight, y: imgBottom },
    3: { x: imgRight, y: imgBottom },
    4: { x: imgRight, y: imgBottom },
    5: { x: "82%", y: "6%" },
  };
  const pos = cursorPositions[step] ?? cursorPositions[0];

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", position: "relative", fontFamily: "Arial, sans-serif" }}>
      <div style={{ padding: "16px 24px", height: "100%", overflow: "hidden" }}>
        {/* Nav */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <div style={{ fontSize: "13px", fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.01em" }}>The Chronicle</div>
          <div style={{ display: "flex", gap: "14px" }}>
            {["World","Tech","Culture","Science"].map(s => (
              <span key={s} style={{ fontSize: "8px", color: "#697386" }}>{s}</span>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "2px solid #1a1a1a", marginBottom: "12px" }} />

        {/* Headline */}
        <div style={{ fontSize: "15px", fontWeight: 800, color: "#1a1a1a", lineHeight: 1.25, letterSpacing: "-0.02em", marginBottom: "6px" }}>
          A City Transformed: How Urban Renewal Is Reshaping the Skyline
        </div>
        <div style={{ fontSize: "8px", color: "#697386", marginBottom: "10px" }}>By James Whitfield  ·  April 10, 2025  ·  6 min read</div>

        {/* City photo */}
        <div ref={imgRef} style={{ width: "62%", height: "175px", borderRadius: "6px", overflow: "hidden", marginBottom: "10px" }}>
          <img src={cityPhoto} alt="Chongqing city skyline at night" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>

        {/* Caption */}
        <div style={{ fontSize: "7.5px", color: "#999", marginBottom: "8px", fontStyle: "italic" }}>
          Chongqing's illuminated skyline and Qiansimen Bridge reflected in the Jialing River.
        </div>

        {/* Body text */}
        <div style={{ fontSize: "8.5px", color: "#4a4a4a", lineHeight: 1.65 }}>
          Urban planners across the country are reimagining what a modern city can look like. New mixed-use developments, improved transit corridors, and riverside parks are drawing residents back downtown.
        </div>
      </div>

      {/* Drag selection rectangle — measured to match the actual photo */}
      <AnimatePresence>
        {(step === 1 || dragging || selectionDone) && (
          <motion.div
            style={{
              position: "absolute",
              zIndex: 30,
              pointerEvents: "none",
              border: "2px solid #34D399",
              borderRadius: "4px",
              background: "rgba(52,211,153,0.06)",
            }}
            initial={{ left: imgLeft, top: imgTop, width: "0%", height: "0%" }}
            animate={{
              left: imgLeft,
              top: imgTop,
              width: dragging || selectionDone ? pct(imgMeas.w) : "0%",
              height: dragging || selectionDone ? pct(imgMeas.h) : "0%",
            }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            transition={{
              width: { duration: dragging ? 2.8 : 0.1, ease: [0.22, 1, 0.36, 1] },
              height: { duration: dragging ? 2.8 : 0.1, ease: [0.22, 1, 0.36, 1] },
            }}
          />
        )}
      </AnimatePresence>

      <motion.div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.28)", zIndex: 3, pointerEvents: "none" }} animate={{ opacity: selectionDone ? 1 : 0 }} transition={{ duration: 0.2 }} />
      <CopiedNotif show={showNotif} />
      <motion.div
        style={{ position: "absolute", zIndex: 40, pointerEvents: "none" }}
        animate={{ left: pos.x, top: pos.y }}
        transition={{ duration: step === 2 ? 2.8 : 1.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg width="18" height="18" viewBox="0 0 22 22" fill="none" style={{ display: "block" }}>
          <path d="M4 2L4 17L7.5 13.5L10 19L12 18L9.5 12.5L14 12.5L4 2Z" fill="white" stroke="#555" strokeWidth="0.8" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </div>
  );
}

// ─── SVG product images ────────────────────────────────────────────────────────

function ProductOversizedCoat() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 120 160" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="coatBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d4b896"/>
          <stop offset="100%" stopColor="#b8926a"/>
        </linearGradient>
        <linearGradient id="coatShad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9a7550" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#9a7550" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <rect width="120" height="160" fill="url(#coatBg)"/>
      <rect width="120" height="160" fill="url(#coatShad)"/>
      {/* coat silhouette */}
      <path d="M30 20 L20 40 L18 160 L102 160 L100 40 L90 20 L75 28 L60 26 L45 28 Z" fill="#c49a72" opacity="0.6"/>
      <path d="M60 26 L60 160" stroke="#b8836a" strokeWidth="1" opacity="0.4"/>
      <path d="M20 40 L30 60" stroke="#b8836a" strokeWidth="0.8" opacity="0.3"/>
      <path d="M100 40 L90 60" stroke="#b8836a" strokeWidth="0.8" opacity="0.3"/>
      {/* collar */}
      <path d="M45 28 L50 45 L60 40 L70 45 L75 28" fill="none" stroke="#a07855" strokeWidth="1.5" opacity="0.7"/>
      {/* buttons */}
      {[70,90,110,130].map((y,i) => <circle key={i} cx="60" cy={y} r="2" fill="#9a7040" opacity="0.8"/>)}
      {/* texture lines */}
      {[0.2,0.4,0.6,0.8].map((o,i) => <rect key={i} x="0" y={40+i*30} width="120" height="0.5" fill="#a07855" opacity={o*0.2}/>)}
    </svg>
  );
}

function ProductSlipDress() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 120 160" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="dressBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5ede0"/>
          <stop offset="100%" stopColor="#e8d5bc"/>
        </linearGradient>
      </defs>
      <rect width="120" height="160" fill="url(#dressBg)"/>
      <rect width="120" height="160" fill="#d4b896" opacity="0.15"/>
      {/* dress silhouette */}
      <path d="M42 15 L35 30 L30 160 L90 160 L85 30 L78 15 Z" fill="#e0c8a8" opacity="0.55"/>
      {/* spaghetti straps */}
      <line x1="47" y1="15" x2="44" y2="35" stroke="#c8aa88" strokeWidth="1.5" opacity="0.8"/>
      <line x1="73" y1="15" x2="76" y2="35" stroke="#c8aa88" strokeWidth="1.5" opacity="0.8"/>
      {/* neckline */}
      <path d="M47 35 Q60 45 73 35" fill="none" stroke="#c0a080" strokeWidth="1" opacity="0.7"/>
      {/* bias cut lines */}
      <path d="M30 80 L90 100" stroke="#c8aa88" strokeWidth="0.5" opacity="0.3"/>
      <path d="M30 110 L90 130" stroke="#c8aa88" strokeWidth="0.5" opacity="0.3"/>
      {/* sheen highlight */}
      <path d="M50 15 L55 160" stroke="#fff" strokeWidth="4" opacity="0.12"/>
    </svg>
  );
}

function ProductWideLegTrousers() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 120 160" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="trouserBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5c6472"/>
          <stop offset="100%" stopColor="#404855"/>
        </linearGradient>
      </defs>
      <rect width="120" height="160" fill="url(#trouserBg)"/>
      <rect width="120" height="160" fill="#2a303c" opacity="0.2"/>
      {/* trouser silhouette */}
      <path d="M35 10 L32 80 L20 160 L55 160 L60 100 L65 160 L100 160 L88 80 L85 10 Z" fill="#4a5260" opacity="0.7"/>
      {/* center crease */}
      <line x1="60" y1="10" x2="60" y2="100" stroke="#6a7280" strokeWidth="1" opacity="0.6"/>
      {/* waistband */}
      <rect x="35" y="10" width="50" height="8" fill="#3c4250" opacity="0.8"/>
      {/* fabric fold lines */}
      <path d="M32 80 Q45 90 55 160" stroke="#6a7280" strokeWidth="0.5" opacity="0.3"/>
      <path d="M88 80 Q75 90 65 160" stroke="#6a7280" strokeWidth="0.5" opacity="0.3"/>
      {/* highlight */}
      <path d="M58 10 L54 160" stroke="#fff" strokeWidth="3" opacity="0.07"/>
    </svg>
  );
}

function FashionHero() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 680 160" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="heroBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0d0d0d"/>
          <stop offset="60%" stopColor="#1a1a1a"/>
          <stop offset="100%" stopColor="#2a2218"/>
        </linearGradient>
        <linearGradient id="heroAccent" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#c4a882" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#c4a882" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <rect width="680" height="160" fill="url(#heroBg)"/>
      <rect width="680" height="160" fill="url(#heroAccent)"/>
      {/* subtle grid texture */}
      {[0,40,80,120,160,200,240,280,320,360,400,440,480,520,560,620,660].map((x,i) => (
        <line key={i} x1={x} y1="0" x2={x} y2="160" stroke="#fff" strokeWidth="0.3" opacity="0.03"/>
      ))}
      {[0,40,80,120,160].map((y,i) => (
        <line key={i} x1="0" y1={y} x2="680" y2={y} stroke="#fff" strokeWidth="0.3" opacity="0.03"/>
      ))}
      {/* decorative oval — model silhouette suggestion */}
      <ellipse cx="340" cy="100" rx="80" ry="60" fill="#c4a882" opacity="0.04"/>
      <ellipse cx="340" cy="60" rx="25" ry="30" fill="#c4a882" opacity="0.05"/>
      {/* corner ornaments */}
      <path d="M20 20 L50 20 M20 20 L20 50" stroke="#c4a882" strokeWidth="1" opacity="0.3"/>
      <path d="M660 20 L630 20 M660 20 L660 50" stroke="#c4a882" strokeWidth="1" opacity="0.3"/>
      <path d="M20 140 L50 140 M20 140 L20 110" stroke="#c4a882" strokeWidth="1" opacity="0.3"/>
      <path d="M660 140 L630 140 M660 140 L660 110" stroke="#c4a882" strokeWidth="1" opacity="0.3"/>
    </svg>
  );
}

// ─── 3. Full screenshot — MAISON clothing store ────────────────────────────────

function ClothingStore() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timings = [2400, 500, 1800, 1400];
    let t: ReturnType<typeof setTimeout>;
    function advance(s: number) {
      t = setTimeout(() => {
        const next = (s + 1) % 4;
        setStep(next);
        advance(next);
      }, timings[s]);
    }
    advance(0);
    return () => clearTimeout(t);
  }, []);

  const captured = step >= 1 && step <= 2;
  const showNotif = step === 2;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", fontFamily: "Arial, sans-serif" }}>
      <div style={{ height: "100%", overflow: "hidden" }}>
        {/* Nav */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", borderBottom: "1px solid #f0f0f0" }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a1a", letterSpacing: "0.12em", textTransform: "uppercase" as const }}>MAISON</div>
          <div style={{ display: "flex", gap: "18px" }}>
            {["New In","Women","Men","Sale"].map(s => <span key={s} style={{ fontSize: "9px", color: "#666", fontWeight: 500 }}>{s}</span>)}
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
          </div>
        </div>

        {/* Hero image */}
        <div style={{ height: "150px", position: "relative", overflow: "hidden" }}>
          <FashionHero />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", textAlign: "center" }}>
            <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.45)", letterSpacing: "0.18em", textTransform: "uppercase" as const, marginBottom: "6px" }}>Spring / Summer 2025</div>
            <div style={{ fontSize: "20px", fontWeight: 300, color: "#fff", letterSpacing: "0.08em", marginBottom: "12px" }}>New Collection</div>
            <div style={{ fontSize: "8px", color: "#fff", border: "1px solid rgba(255,255,255,0.35)", borderRadius: "3px", padding: "4px 14px", fontWeight: 500, letterSpacing: "0.08em" }}>SHOP NOW</div>
          </div>
        </div>

        {/* Products */}
        <div style={{ padding: "12px 20px" }}>
          <div style={{ fontSize: "8px", color: "#999", textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: "10px" }}>Trending Now</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
            {[
              { name: "Oversized Coat", price: "$285", Img: ProductOversizedCoat },
              { name: "Slip Dress", price: "$165", Img: ProductSlipDress },
              { name: "Wide-Leg Trousers", price: "$120", Img: ProductWideLegTrousers },
            ].map(({ name, price, Img }) => (
              <div key={name}>
                <div style={{ width: "100%", aspectRatio: "3/4", borderRadius: "5px", overflow: "hidden", marginBottom: "6px", background: "#f5f0ea" }}>
                  <Img />
                </div>
                <div style={{ fontSize: "9px", fontWeight: 600, color: "#1a1a1a" }}>{name}</div>
                <div style={{ fontSize: "8px", color: "#999" }}>{price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <motion.div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.28)", zIndex: 3, pointerEvents: "none" }} animate={{ opacity: captured ? 1 : 0 }} transition={{ duration: 0.15 }} />
      <AnimatePresence>
        {captured && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "absolute", zIndex: 30, pointerEvents: "none", inset: 0, border: "3px solid #34D399" }} />
        )}
      </AnimatePresence>
      <CopiedNotif show={showNotif} />
    </div>
  );
}

// ─── Showcase section ──────────────────────────────────────────────────────────

export function Showcase() {
  const modes = [
    {
      title: "Click to capture",
      desc: "Hover over any element — Pixie detects its boundaries and copies it with one click.",
      keys: ["\u2318", "\u21E7", "6"],
      url: "dashboard.stripe.com",
      demo: <StripeDashboard />,
    },
    {
      title: "Drag to select",
      desc: "Click and drag to draw a precise selection around exactly what you need.",
      keys: ["\u2318", "\u21E7", "7"],
      url: "thechronicle.com/article",
      demo: <NewsArticle />,
    },
    {
      title: "Full screenshot",
      desc: "Capture your entire screen in one click. No cropping, no extra steps.",
      keys: ["↵"],
      url: "maison.com/new-collection",
      demo: <ClothingStore />,
    },
  ];

  return (
    <section id="showcase" data-pixie-active-zone="true" style={{ width: "100%", padding: "0 24px 64px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", marginBottom: "48px" }}
      >
        <h2 style={{ fontFamily: "Arial, sans-serif", fontSize: "42px", fontWeight: 700, color: "#171717", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "14px" }}>
          Three ways to capture
        </h2>
        <p style={{ fontFamily: "Arial, sans-serif", fontSize: "15px", color: "rgba(0,0,0,0.45)", lineHeight: 1.6 }}>
          Every workflow covered. No dragging files, no cropping, no extra steps.
        </p>
      </motion.div>

      <div style={{ display: "flex", flexDirection: "column", gap: "32px", maxWidth: "680px", width: "100%" }}>
        {modes.map((mode, i) => (
          <motion.div
            key={mode.title}
            data-pixie-card="true"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            style={{
              display: "flex",
              flexDirection: "column",
              borderRadius: "20px",
              border: "1px solid rgba(0,0,0,0.08)",
              overflow: "hidden",
              boxShadow: "0 2px 24px rgba(0,0,0,0.06)",
              background: "#fff",
            }}
          >
            <BrowserChrome url={mode.url}>{mode.demo}</BrowserChrome>
            <div style={{ padding: "18px 22px 22px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                <h3 style={{ fontFamily: "Arial, sans-serif", fontSize: "18px", fontWeight: 700, color: "#171717", margin: 0 }}>
                  {mode.title}
                </h3>
                <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                  {mode.keys.map((k, idx) => (
                    <kbd key={idx} style={{
                      fontFamily: "Arial, sans-serif",
                      fontSize: mode.keys.length === 1 ? "14px" : "11px",
                      fontWeight: 600,
                      color: "#171717",
                      background: mode.keys.length === 1 ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.04)",
                      border: "1px solid rgba(0,0,0,0.12)",
                      borderBottom: "2px solid rgba(0,0,0,0.18)",
                      borderRadius: "6px",
                      padding: mode.keys.length === 1 ? "5px 14px" : "3px 8px",
                      display: "inline-block",
                    }}>
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
              <p style={{ fontFamily: "Arial, sans-serif", fontSize: "14px", color: "rgba(0,0,0,0.4)", lineHeight: 1.5, margin: 0 }}>
                {mode.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
