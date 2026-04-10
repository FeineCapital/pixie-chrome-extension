import { motion } from "framer-motion";

function AppleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

function ChromeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 8h8.5M7.08 10L3 17.5M12 16l-4.5 7.5"/>
      <circle cx="12" cy="12" r="10"/>
    </svg>
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
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.0, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "100px",
            padding: "6px 14px 6px 10px",
            marginBottom: "36px",
          }}
        >
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#34D399", flexShrink: 0 }} />
          <span style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "12px",
            fontWeight: 400,
            color: "rgba(255,255,255,0.5)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}>
            Now available for Mac
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "82px",
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1,
            letterSpacing: "-0.03em",
            marginBottom: "28px",
          }}
        >
          The easiest way<br />to take screenshots
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "17px",
            fontWeight: 400,
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.65,
            marginBottom: "48px",
            maxWidth: "520px",
          }}
        >
          Pixie makes screen capturing effortless. Hover over any element, click once, and capture it perfectly without dragging or cropping.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
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
              color: "#000000",
              background: "#ffffff",
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
              color: "#ffffff",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "12px",
              padding: "16px 32px",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            <ChromeIcon size={16} />
            Chrome Extension
          </a>
        </motion.div>
      </div>

      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "800px",
        height: "800px",
        background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />
    </section>
  );
}
