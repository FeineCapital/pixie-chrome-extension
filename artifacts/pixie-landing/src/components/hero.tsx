import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import chromeLogo from "@assets/image_1775809932785.png";
import pixieLogo from "@assets/image_1775817701275.png";

function AppleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

function HeroDemo() {
  // steps: 0=idle, 1=cursor moving, 2=hovering (green outline), 3=clicked (flash), 4=copied notif, 5=reset
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timings = [900, 700, 500, 300, 1200, 800];
    let t: ReturnType<typeof setTimeout>;
    function advance(s: number) {
      t = setTimeout(() => {
        const next = (s + 1) % 6;
        setStep(next);
        advance(next);
      }, timings[s]);
    }
    advance(0);
    return () => clearTimeout(t);
  }, []);

  const cursorX = step >= 1 ? "54%" : "30%";
  const cursorY = step >= 1 ? "28%" : "55%";
  const hovering = step >= 2 && step <= 4;
  const flash = step === 3;
  const copied = step === 4;

  return (
    <div style={{ position: "relative", width: "260px", height: "72px", userSelect: "none" }}>
      <div style={{ display: "flex", gap: "8px", alignItems: "stretch", height: "100%" }}>
        <motion.div
          animate={{
            boxShadow: hovering
              ? "0 0 0 2px #34D399, 0 2px 12px rgba(52,211,153,0.2)"
              : "0 0 0 1px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
          }}
          transition={{ duration: 0.2 }}
          style={{
            flex: 1,
            borderRadius: "10px",
            background: hovering ? "rgba(52,211,153,0.04)" : "#fff",
            padding: "10px 14px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            transition: "background 0.2s",
          }}
        >
          <div style={{ fontSize: "9px", color: "#697386", marginBottom: "3px", fontFamily: "Arial, sans-serif" }}>Monthly Revenue</div>
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#1a1f36", letterSpacing: "-0.02em", fontFamily: "Arial, sans-serif" }}>$41,280</div>
          <div style={{ fontSize: "9px", color: "#0e6245", fontFamily: "Arial, sans-serif", marginTop: "2px" }}>+12.4% this month</div>
        </motion.div>

        <div style={{
          width: "70px",
          borderRadius: "10px",
          background: "#fff",
          boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
          padding: "10px 12px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}>
          <div style={{ fontSize: "9px", color: "#697386", marginBottom: "3px", fontFamily: "Arial, sans-serif" }}>Customers</div>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "#1a1f36", fontFamily: "Arial, sans-serif" }}>3,847</div>
        </div>
      </div>

      {flash && (
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(52,211,153,0.12)",
          borderRadius: "10px",
          pointerEvents: "none",
        }} />
      )}

      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              position: "absolute",
              bottom: "-28px",
              right: "0px",
              background: "#171717",
              borderRadius: "7px",
              padding: "5px 10px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round"><path d="M5 13l4 4L19 7"/></svg>
            <span style={{ fontSize: "10px", fontWeight: 600, color: "#34D399", fontFamily: "Arial, sans-serif" }}>Copied to clipboard</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ left: cursorX, top: cursorY }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "absolute", pointerEvents: "none", zIndex: 5 }}
      >
        <svg width="16" height="16" viewBox="0 0 22 22" fill="none">
          <path d="M4 2L4 17L7.5 13.5L10 19L12 18L9.5 12.5L14 12.5L4 2Z" fill="white" stroke="#444" strokeWidth="1" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </div>
  );
}

export function Hero() {
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
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "860px", width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: "24px" }}
        >
          <img
            src={pixieLogo}
            alt="Pixie"
            style={{ width: "64px", height: "64px", borderRadius: "16px" }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: "36px" }}
        >
          <HeroDemo />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "44px",
            fontWeight: 700,
            color: "#171717",
            lineHeight: 1,
            letterSpacing: "-0.03em",
            marginBottom: "28px",
            whiteSpace: "nowrap",
          }}
        >
          The easiest way to take screenshots.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
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
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "flex", gap: "12px", alignItems: "center" }}
        >
          <a
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
        </motion.div>
      </div>
    </section>
  );
}
