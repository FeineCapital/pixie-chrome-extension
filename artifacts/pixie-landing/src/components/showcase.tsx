import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

function FakeWebsite({ step }: { step: number }) {
  const isHovered = step >= 1;
  const isCaptured = step >= 2;

  return (
    <div style={{ width: "100%", height: "100%", background: "#ffffff", position: "relative", overflow: "hidden" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 28px",
        borderBottom: "1px solid #eee",
        background: "#fff",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <span style={{ fontFamily: "Arial, sans-serif", fontSize: "15px", fontWeight: 700, color: "#111" }}>Acme Store</span>
        </div>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          {["Products", "Collections", "About"].map(t => (
            <span key={t} style={{ fontFamily: "Arial, sans-serif", fontSize: "13px", color: "#666", fontWeight: 500 }}>{t}</span>
          ))}
          <div style={{ background: "#111", borderRadius: "8px", padding: "6px 16px" }}>
            <span style={{ fontFamily: "Arial, sans-serif", fontSize: "12px", color: "#fff", fontWeight: 600 }}>Sign in</span>
          </div>
        </div>
      </div>

      <div style={{ padding: "28px 28px 0" }}>
        <div style={{ borderRadius: "14px", overflow: "hidden", marginBottom: "24px", position: "relative", height: "160px", background: "linear-gradient(135deg, #0f172a, #1e293b)" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px" }}>
            <div>
              <div style={{ fontFamily: "Arial, sans-serif", fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Summer Collection</div>
              <div style={{ fontFamily: "Arial, sans-serif", fontSize: "24px", fontWeight: 700, color: "#fff", marginBottom: "6px", lineHeight: 1.2 }}>New Arrivals</div>
              <div style={{ fontFamily: "Arial, sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.6)", marginBottom: "14px" }}>Up to 40% off select items</div>
              <div style={{ background: "#fff", borderRadius: "8px", padding: "8px 20px", display: "inline-block" }}>
                <span style={{ fontFamily: "Arial, sans-serif", fontSize: "12px", fontWeight: 700, color: "#111" }}>Shop now</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ width: "100px", height: "120px", borderRadius: "10px", background: "linear-gradient(145deg, #dbeafe, #93c5fd)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5"><rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 7V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v3"/></svg>
              </div>
              <div style={{ width: "100px", height: "120px", borderRadius: "10px", background: "linear-gradient(145deg, #fef3c7, #fde68a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: "18px", fontWeight: 700, color: "#111" }}>Featured Products</div>
            <span style={{ fontFamily: "Arial, sans-serif", fontSize: "13px", color: "#6366f1", fontWeight: 600 }}>View all</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px" }}>
          <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #f0f0f0" }}>
            <div style={{ height: "110px", position: "relative", overflow: "hidden" }}>
              <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80" alt="Wireless Headphones" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", top: "8px", right: "8px", background: "#ef4444", borderRadius: "6px", padding: "2px 8px" }}>
                <span style={{ fontFamily: "Arial, sans-serif", fontSize: "9px", fontWeight: 700, color: "#fff" }}>SALE</span>
              </div>
            </div>
            <div style={{ padding: "12px" }}>
              <div style={{ fontFamily: "Arial, sans-serif", fontSize: "13px", fontWeight: 600, color: "#111", marginBottom: "4px" }}>Wireless Headphones</div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontFamily: "Arial, sans-serif", fontSize: "14px", fontWeight: 700, color: "#111" }}>$79</span>
                <span style={{ fontFamily: "Arial, sans-serif", fontSize: "11px", color: "#999", textDecoration: "line-through" }}>$129</span>
              </div>
              <div style={{ display: "flex", gap: "2px", marginTop: "6px" }}>
                {[1,2,3,4,5].map(s => <svg key={s} width="10" height="10" viewBox="0 0 24 24" fill={s<=4?"#f59e0b":"#e5e7eb"}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
                <span style={{ fontFamily: "Arial, sans-serif", fontSize: "9px", color: "#999", marginLeft: "4px" }}>(128)</span>
              </div>
            </div>
          </div>

          <motion.div
            style={{
              borderRadius: "12px",
              overflow: "hidden",
              position: "relative",
              zIndex: 5,
            }}
            animate={{
              boxShadow: isCaptured
                ? "0 0 0 2px #34D399"
                : isHovered
                ? "0 0 0 2px #34D399"
                : "0 0 0 1px #f0f0f0",
            }}
            transition={{ duration: 0.3 }}
          >
            <div style={{ height: "110px", position: "relative", overflow: "hidden" }}>
              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80" alt="Smart Watch Pro" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", top: "8px", left: "8px", background: "#111", borderRadius: "6px", padding: "2px 8px" }}>
                <span style={{ fontFamily: "Arial, sans-serif", fontSize: "9px", fontWeight: 700, color: "#fff" }}>NEW</span>
              </div>
            </div>
            <div style={{ padding: "12px", background: "#fff" }}>
              <div style={{ fontFamily: "Arial, sans-serif", fontSize: "13px", fontWeight: 600, color: "#111", marginBottom: "4px" }}>Smart Watch Pro</div>
              <div style={{ fontFamily: "Arial, sans-serif", fontSize: "14px", fontWeight: 700, color: "#111" }}>$199</div>
              <div style={{ display: "flex", gap: "2px", marginTop: "6px" }}>
                {[1,2,3,4,5].map(s => <svg key={s} width="10" height="10" viewBox="0 0 24 24" fill={s<=5?"#f59e0b":"#e5e7eb"}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
                <span style={{ fontFamily: "Arial, sans-serif", fontSize: "9px", color: "#999", marginLeft: "4px" }}>(256)</span>
              </div>
            </div>
          </motion.div>

          <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #f0f0f0" }}>
            <div style={{ height: "110px", position: "relative", overflow: "hidden" }}>
              <img src="https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=300&q=80" alt="Fitness Tracker" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ padding: "12px" }}>
              <div style={{ fontFamily: "Arial, sans-serif", fontSize: "13px", fontWeight: 600, color: "#111", marginBottom: "4px" }}>Fitness Tracker</div>
              <div style={{ fontFamily: "Arial, sans-serif", fontSize: "14px", fontWeight: 700, color: "#111" }}>$49</div>
              <div style={{ display: "flex", gap: "2px", marginTop: "6px" }}>
                {[1,2,3,4,5].map(s => <svg key={s} width="10" height="10" viewBox="0 0 24 24" fill={s<=3?"#f59e0b":"#e5e7eb"}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
                <span style={{ fontFamily: "Arial, sans-serif", fontSize: "9px", color: "#999", marginLeft: "4px" }}>(89)</span>
              </div>
            </div>
          </div>

          <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #f0f0f0" }}>
            <div style={{ height: "110px", position: "relative", overflow: "hidden" }}>
              <img src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&q=80" alt="Aromatherapy Kit" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ padding: "12px" }}>
              <div style={{ fontFamily: "Arial, sans-serif", fontSize: "13px", fontWeight: 600, color: "#111", marginBottom: "4px" }}>Aromatherapy Kit</div>
              <div style={{ fontFamily: "Arial, sans-serif", fontSize: "14px", fontWeight: 700, color: "#111" }}>$34</div>
              <div style={{ display: "flex", gap: "2px", marginTop: "6px" }}>
                {[1,2,3,4,5].map(s => <svg key={s} width="10" height="10" viewBox="0 0 24 24" fill={s<=4?"#f59e0b":"#e5e7eb"}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
                <span style={{ fontFamily: "Arial, sans-serif", fontSize: "9px", color: "#999", marginLeft: "4px" }}>(67)</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
          <div style={{ borderRadius: "10px", padding: "16px", background: "#f9fafb", border: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ fontFamily: "Arial, sans-serif", fontSize: "13px", fontWeight: 700, color: "#111" }}>Recent Orders</div>
              <span style={{ fontFamily: "Arial, sans-serif", fontSize: "11px", color: "#6366f1", fontWeight: 600 }}>View all</span>
            </div>
            {[
              { id: "#38201", status: "Shipped", color: "#2563eb" },
              { id: "#38200", status: "Delivered", color: "#059669" },
              { id: "#38199", status: "Processing", color: "#f59e0b" },
            ].map(o => (
              <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: "1px solid #f3f4f6" }}>
                <span style={{ fontFamily: "Arial, sans-serif", fontSize: "12px", color: "#444" }}>Order {o.id}</span>
                <span style={{ fontFamily: "Arial, sans-serif", fontSize: "10px", fontWeight: 600, color: o.color, background: `${o.color}15`, borderRadius: "4px", padding: "2px 8px" }}>{o.status}</span>
              </div>
            ))}
          </div>
          <div style={{ borderRadius: "10px", padding: "16px", background: "#f9fafb", border: "1px solid #f3f4f6" }}>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: "13px", fontWeight: 700, color: "#111", marginBottom: "16px" }}>Store Stats</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <div style={{ fontFamily: "Arial, sans-serif", fontSize: "22px", fontWeight: 700, color: "#111" }}>2,847</div>
                <div style={{ fontFamily: "Arial, sans-serif", fontSize: "11px", color: "#888" }}>Total Products</div>
              </div>
              <div>
                <div style={{ fontFamily: "Arial, sans-serif", fontSize: "22px", fontWeight: 700, color: "#111" }}>14.2k</div>
                <div style={{ fontFamily: "Arial, sans-serif", fontSize: "11px", color: "#888" }}>Monthly Sales</div>
              </div>
              <div style={{ height: "4px", background: "#e5e7eb", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ width: "72%", height: "100%", background: "linear-gradient(90deg, #6366f1, #8b5cf6)", borderRadius: "2px" }} />
              </div>
              <div style={{ fontFamily: "Arial, sans-serif", fontSize: "10px", color: "#999" }}>72% of monthly goal</div>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        animate={{ opacity: isCaptured ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

function CaptureDemo() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timings = [2000, 1400, 800, 1200, 1600, 2000];
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

  const isHovered = step >= 1;
  const isCaptured = step >= 2;
  const showToolbar = step >= 3;
  const isCopied = step >= 4;
  const showNotif = step === 5;

  return (
    <div className="relative w-full max-w-4xl mx-auto select-none">
      <div className="overflow-hidden" style={{ borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)", background: "#111111" }}>
        <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#1a1a1a" }}>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 mx-6 flex items-center justify-center h-6 rounded-md" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-1.5">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <span style={{ fontFamily: "Arial, sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>acmestore.com/products</span>
            </div>
          </div>
          <div style={{ width: "48px" }} />
        </div>

        <div className="relative" style={{ height: "600px", overflow: "hidden" }}>
          <FakeWebsite step={step} />

          <motion.div
            className="absolute z-30 pointer-events-none"
            animate={{
              left: isCaptured ? "38%" : isHovered ? "36%" : "20%",
              top: isCaptured ? "50%" : isHovered ? "48%" : "15%",
              opacity: showNotif ? 0 : 1,
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="#333" strokeWidth="1">
              <path d="M5 3l14 9-7 1-4 7L5 3z" />
            </svg>
          </motion.div>

          <AnimatePresence>
            {isCaptured && !showNotif && (
              <motion.div
                key={`ripple-${step}`}
                className="absolute z-30 pointer-events-none rounded-full"
                style={{ left: "calc(38% - 12px)", top: "calc(50% - 12px)", width: 24, height: 24, border: "2px solid rgba(52,211,153,0.8)" }}
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 3, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
            )}
          </AnimatePresence>

          <motion.div
            className="absolute z-40 left-1/2 -translate-x-1/2 bottom-5 flex items-center gap-2 px-4 py-2.5"
            style={{
              borderRadius: "12px",
              background: "rgba(10,10,10,0.96)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(14px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            }}
            animate={{ opacity: showToolbar ? 1 : 0, y: showToolbar ? 0 : 12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="p-1.5 rounded-md" style={{ color: "rgba(255,255,255,0.5)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
            </div>
            <div className="p-1.5 rounded-md" style={{ color: "rgba(255,255,255,0.5)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/></svg>
            </div>
            <div className="w-px h-4" style={{ background: "rgba(255,255,255,0.09)" }} />
            <motion.span
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: "12px",
                fontWeight: 700,
                color: "#000",
                background: "#ffffff",
                borderRadius: "8px",
                padding: "4px 12px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
              animate={{ scale: isCopied ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              {isCopied && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
              {isCopied ? "Copied!" : "Copy"}
            </motion.span>
            <span
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                color: "#ffffff",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "8px",
                padding: "4px 12px",
              }}
            >
              Save
            </span>
          </motion.div>

          <AnimatePresence>
            {showNotif && (
              <motion.div
                initial={{ opacity: 0, y: -10, x: 10 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="absolute z-50"
                style={{
                  top: "16px",
                  right: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 16px",
                  borderRadius: "10px",
                  background: "rgba(10,10,10,0.95)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "6px",
                  background: "rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontFamily: "Arial, sans-serif", fontSize: "12px", fontWeight: 700, color: "#fff" }}>Copied to clipboard</div>
                  <div style={{ fontFamily: "Arial, sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.45)" }}>Paste anywhere — ⌘V</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isHovered && !isCaptured && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
                className="absolute z-30"
                style={{
                  left: "36%",
                  top: "30%",
                  transform: "translateX(-50%)",
                  fontFamily: "Arial, sans-serif",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#ffffff",
                  padding: "5px 12px",
                  borderRadius: "8px",
                  background: "rgba(10,10,10,0.9)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                  whiteSpace: "nowrap",
                }}
              >
                Click to capture
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export function Showcase() {
  return (
    <section id="showcase" className="w-full px-6 md:px-8 py-24 md:py-36 flex flex-col items-center">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: "52px",
          fontWeight: 700,
          color: "#ffffff",
          textAlign: "center",
          marginBottom: "16px",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
        }}
      >
        Hover. Click. Done.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.05 }}
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: "17px",
          fontWeight: 400,
          color: "rgba(255,255,255,0.45)",
          textAlign: "center",
          marginBottom: "56px",
          lineHeight: 1.6,
          whiteSpace: "nowrap",
        }}
      >
        No dragging, no cropping. Just hover over anything and click.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="w-full"
      >
        <CaptureDemo />
      </motion.div>
    </section>
  );
}
