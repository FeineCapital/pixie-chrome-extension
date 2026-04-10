import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

function StripeDashboard({ step }: { step: number }) {
  const isHovered = step >= 1;
  const isCaptured = step >= 2;

  return (
    <div style={{ width: "100%", height: "100%", background: "#ffffff", position: "relative", overflow: "hidden" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        borderBottom: "1px solid #e5e7eb",
        background: "#fff",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#635bff"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/></svg>
            <span style={{ fontFamily: "Arial, sans-serif", fontSize: "14px", fontWeight: 700, color: "#111" }}>Dashboard</span>
          </div>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            {["Home", "Payments", "Balances", "Customers"].map(t => (
              <span key={t} style={{ fontFamily: "Arial, sans-serif", fontSize: "12px", color: t === "Home" ? "#635bff" : "#6b7280", fontWeight: t === "Home" ? 600 : 400 }}>{t}</span>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={{ width: "160px", height: "28px", borderRadius: "6px", background: "#f3f4f6", display: "flex", alignItems: "center", padding: "0 10px", gap: "6px" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span style={{ fontFamily: "Arial, sans-serif", fontSize: "11px", color: "#9ca3af" }}>Search...</span>
          </div>
          <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#635bff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "Arial, sans-serif", fontSize: "11px", fontWeight: 700, color: "#fff" }}>A</span>
          </div>
        </div>
      </div>

      <div style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: "11px", color: "#6b7280", fontWeight: 500, marginBottom: "4px" }}>Monthly Recurring Revenue</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
              <span style={{ fontFamily: "Arial, sans-serif", fontSize: "32px", fontWeight: 700, color: "#111", letterSpacing: "-0.02em" }}>$48,295</span>
              <span style={{ fontFamily: "Arial, sans-serif", fontSize: "12px", fontWeight: 600, color: "#059669", background: "#ecfdf5", borderRadius: "4px", padding: "2px 6px" }}>+12.5%</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            {["1M", "3M", "6M", "1Y"].map(t => (
              <div key={t} style={{ padding: "4px 10px", borderRadius: "6px", background: t === "1Y" ? "#f3f4f6" : "transparent" }}>
                <span style={{ fontFamily: "Arial, sans-serif", fontSize: "11px", fontWeight: 500, color: t === "1Y" ? "#111" : "#9ca3af" }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: "130px", marginBottom: "24px", position: "relative" }}>
          <svg width="100%" height="100%" viewBox="0 0 600 130" preserveAspectRatio="none">
            <defs>
              <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#635bff" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#635bff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,100 C50,95 80,85 120,80 C160,75 200,90 240,70 C280,50 320,65 360,45 C400,30 440,40 480,25 C520,15 560,20 600,10 L600,130 L0,130 Z" fill="url(#mrrGrad)" />
            <path d="M0,100 C50,95 80,85 120,80 C160,75 200,90 240,70 C280,50 320,65 360,45 C400,30 440,40 480,25 C520,15 560,20 600,10" fill="none" stroke="#635bff" strokeWidth="2" />
            <circle cx="600" cy="10" r="4" fill="#635bff" />
          </svg>
          <div style={{ position: "absolute", bottom: "0", left: "0", right: "0", display: "flex", justifyContent: "space-between" }}>
            {["Jan", "Mar", "May", "Jul", "Sep", "Nov"].map(m => (
              <span key={m} style={{ fontFamily: "Arial, sans-serif", fontSize: "9px", color: "#c4c4c4" }}>{m}</span>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px", marginBottom: "20px" }}>
          <motion.div
            style={{
              borderRadius: "10px",
              padding: "14px",
              background: "#fafafa",
              border: "1px solid #f0f0f0",
              position: "relative",
              zIndex: 5,
            }}
            animate={{
              boxShadow: isCaptured
                ? "0 0 0 2px #34D399"
                : isHovered
                ? "0 0 0 2px #34D399"
                : "none",
              border: isCaptured
                ? "1px solid transparent"
                : isHovered
                ? "1px solid transparent"
                : "1px solid #f0f0f0",
            }}
            transition={{ duration: 0.3 }}
          >
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: "10px", color: "#6b7280", marginBottom: "6px" }}>Active Subscribers</div>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: "20px", fontWeight: 700, color: "#111" }}>1,247</div>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: "10px", color: "#059669", marginTop: "4px" }}>+8.2% vs last month</div>
          </motion.div>
          <div style={{ borderRadius: "10px", padding: "14px", background: "#fafafa", border: "1px solid #f0f0f0" }}>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: "10px", color: "#6b7280", marginBottom: "6px" }}>Net Revenue</div>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: "20px", fontWeight: 700, color: "#111" }}>$12.4k</div>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: "10px", color: "#059669", marginTop: "4px" }}>+5.1% vs last month</div>
          </div>
          <div style={{ borderRadius: "10px", padding: "14px", background: "#fafafa", border: "1px solid #f0f0f0" }}>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: "10px", color: "#6b7280", marginBottom: "6px" }}>Churn Rate</div>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: "20px", fontWeight: 700, color: "#111" }}>2.4%</div>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: "10px", color: "#dc2626", marginTop: "4px" }}>+0.3% vs last month</div>
          </div>
          <div style={{ borderRadius: "10px", padding: "14px", background: "#fafafa", border: "1px solid #f0f0f0" }}>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: "10px", color: "#6b7280", marginBottom: "6px" }}>Avg Revenue / User</div>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: "20px", fontWeight: 700, color: "#111" }}>$38.72</div>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: "10px", color: "#059669", marginTop: "4px" }}>+2.8% vs last month</div>
          </div>
        </div>

        <div style={{ borderRadius: "10px", padding: "14px", background: "#fafafa", border: "1px solid #f0f0f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: "12px", fontWeight: 700, color: "#111" }}>Recent Transactions</div>
            <span style={{ fontFamily: "Arial, sans-serif", fontSize: "11px", color: "#635bff", fontWeight: 600 }}>View all</span>
          </div>
          {[
            { name: "Alex Thompson", amount: "+$99.00", status: "Succeeded", color: "#059669" },
            { name: "Sarah Chen", amount: "+$49.00", status: "Succeeded", color: "#059669" },
            { name: "Mike Johnson", amount: "+$199.00", status: "Pending", color: "#f59e0b" },
          ].map(o => (
            <div key={o.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: "1px solid #f3f4f6" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "Arial, sans-serif", fontSize: "10px", fontWeight: 600, color: "#6b7280" }}>{o.name[0]}</span>
                </div>
                <span style={{ fontFamily: "Arial, sans-serif", fontSize: "12px", color: "#111", fontWeight: 500 }}>{o.name}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontFamily: "Arial, sans-serif", fontSize: "12px", fontWeight: 600, color: "#111" }}>{o.amount}</span>
                <span style={{ fontFamily: "Arial, sans-serif", fontSize: "10px", fontWeight: 600, color: o.color, background: `${o.color}15`, borderRadius: "4px", padding: "2px 8px" }}>{o.status}</span>
              </div>
            </div>
          ))}
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
  const showNotif = step >= 4;

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
              <span style={{ fontFamily: "Arial, sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>dashboard.stripe.com</span>
            </div>
          </div>
          <div style={{ width: "48px" }} />
        </div>

        <div className="relative" style={{ height: "600px", overflow: "hidden" }}>
          <StripeDashboard step={step} />

          <motion.div
            className="absolute z-30 pointer-events-none"
            animate={{
              left: isCaptured ? "15%" : isHovered ? "13%" : "50%",
              top: isCaptured ? "72%" : isHovered ? "70%" : "30%",
              opacity: showNotif ? 0 : 1,
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M4 2L4 17L7.5 13.5L10 19L12 18L9.5 12.5L14 12.5L4 2Z" fill="white" stroke="#444" strokeWidth="1" strokeLinejoin="round"/>
            </svg>
          </motion.div>

          <AnimatePresence>
            {isCaptured && !showNotif && (
              <motion.div
                key={`ripple-${step}`}
                className="absolute z-30 pointer-events-none rounded-full"
                style={{ left: "calc(15% - 12px)", top: "calc(72% - 12px)", width: 24, height: 24, border: "2px solid rgba(52,211,153,0.8)" }}
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 3, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showNotif && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.25 }}
                className="absolute z-50"
                style={{
                  bottom: "16px",
                  right: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  background: "#0a0a0a",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ fontFamily: "Arial, sans-serif", fontSize: "12px", fontWeight: 600, color: "#34D399" }}>Copied to clipboard</span>
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
                  left: "15%",
                  top: "60%",
                  transform: "translateX(-50%)",
                  fontFamily: "Arial, sans-serif",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#ffffff",
                  padding: "5px 12px",
                  borderRadius: "8px",
                  background: "#0a0a0a",
                  border: "1px solid rgba(255,255,255,0.1)",
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
          fontSize: "42px",
          fontWeight: 700,
          color: "#ffffff",
          textAlign: "center",
          marginBottom: "24px",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          whiteSpace: "nowrap",
        }}
      >
        No dragging or dropping. Just hover and click.
      </motion.h2>

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
