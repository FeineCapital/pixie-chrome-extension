import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

function MiniApp({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: "100%",
      borderRadius: "12px",
      overflow: "hidden",
      background: "#f6f9fc",
      border: "1px solid #e3e8ee",
      position: "relative",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        padding: "8px 10px",
        background: "#fff",
        borderBottom: "1px solid #e3e8ee",
      }}>
        <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#ff5f57" }} />
        <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#febc2e" }} />
        <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#28c840" }} />
        <div style={{ flex: 1, marginLeft: "8px", background: "#f0f2f5", borderRadius: "4px", height: "14px" }} />
      </div>
      <div style={{ position: "relative", height: "220px", overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}

function Cursor({ x, y }: { x: string; y: string }) {
  return (
    <motion.div
      className="absolute z-40 pointer-events-none"
      animate={{ left: x, top: y }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
        <path d="M4 2L4 17L7.5 13.5L10 19L12 18L9.5 12.5L14 12.5L4 2Z" fill="white" stroke="#555" strokeWidth="0.8" strokeLinejoin="round"/>
      </svg>
    </motion.div>
  );
}

function HoverCaptureDemo() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timings = [1600, 1400, 600, 1800, 1200];
    let t: ReturnType<typeof setTimeout>;
    function advance(s: number) {
      t = setTimeout(() => {
        const next = (s + 1) % 5;
        setStep(next);
        advance(next);
      }, timings[s]);
    }
    advance(0);
    return () => clearTimeout(t);
  }, []);

  const hoveredCard = step >= 1 && step <= 3;
  const captured = step >= 2 && step <= 3;
  const showNotif = step === 3;

  const positions: Record<number, { x: string; y: string }> = {
    0: { x: "55%", y: "30%" },
    1: { x: "18%", y: "42%" },
    2: { x: "18%", y: "42%" },
    3: { x: "18%", y: "42%" },
    4: { x: "55%", y: "30%" },
  };
  const pos = positions[step] || positions[0];

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", padding: "12px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        <motion.div
          animate={{
            boxShadow: hoveredCard
              ? "0 0 0 2px #34D399, 0 1px 4px rgba(0,0,0,0.06)"
              : "0 0 0 1px #e3e8ee, 0 1px 3px rgba(0,0,0,0.04)",
          }}
          transition={{ duration: 0.25 }}
          style={{ borderRadius: "8px", background: "#fff", padding: "10px 12px" }}
        >
          <div style={{ fontSize: "8px", color: "#697386", marginBottom: "2px" }}>Revenue</div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#1a1f36" }}>$12,480</div>
          <svg width="100%" height="22" viewBox="0 0 100 22" preserveAspectRatio="none" style={{ marginTop: "4px" }}>
            <path d="M0 20 L15 17 L30 14 L45 16 L60 10 L75 7 L100 3" fill="none" stroke="#635bff" strokeWidth="1.5"/>
          </svg>
        </motion.div>
        <div style={{ borderRadius: "8px", background: "#fff", boxShadow: "0 0 0 1px #e3e8ee", padding: "10px 12px" }}>
          <div style={{ fontSize: "8px", color: "#697386", marginBottom: "2px" }}>Users</div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#1a1f36" }}>1,247</div>
          <svg width="100%" height="22" viewBox="0 0 100 22" preserveAspectRatio="none" style={{ marginTop: "4px" }}>
            <path d="M0 18 L20 15 L40 12 L60 9 L80 6 L100 4" fill="none" stroke="#635bff" strokeWidth="1.5"/>
          </svg>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginTop: "8px" }}>
        {[
          { label: "Conversion", value: "3.2%" },
          { label: "Avg. Order", value: "$64" },
          { label: "Retention", value: "89%" },
        ].map(c => (
          <div key={c.label} style={{ borderRadius: "8px", background: "#fff", boxShadow: "0 0 0 1px #e3e8ee", padding: "10px 12px" }}>
            <div style={{ fontSize: "8px", color: "#697386", marginBottom: "2px" }}>{c.label}</div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#1a1f36" }}>{c.value}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "8px", borderRadius: "8px", background: "#fff", boxShadow: "0 0 0 1px #e3e8ee", padding: "10px 12px" }}>
        <div style={{ fontSize: "8px", color: "#697386", marginBottom: "6px" }}>Recent Activity</div>
        {["New signup — alex@co.io", "Payment — $199.00", "Upgrade — Pro plan"].map((item, i) => (
          <div key={i} style={{ fontSize: "9px", color: "#4f566b", padding: "3px 0", borderTop: i > 0 ? "1px solid #f2f5f9" : "none" }}>{item}</div>
        ))}
      </div>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "rgba(0,0,0,0.3)", zIndex: 3 }}
        animate={{ opacity: captured ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />

      <AnimatePresence>
        {showNotif && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute z-50"
            style={{ bottom: "10px", right: "10px", background: "#171717", borderRadius: "6px", padding: "5px 10px", display: "flex", alignItems: "center", gap: "5px" }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>
            <span style={{ fontSize: "9px", fontWeight: 600, color: "#34D399" }}>Copied</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Cursor x={pos.x} y={pos.y} />
    </div>
  );
}

function DragSelectDemo() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timings = [1400, 600, 1600, 600, 1800, 1200];
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

  const dragging = step >= 2 && step <= 3;
  const captured = step >= 3 && step <= 4;
  const showNotif = step === 4;

  const positions: Record<number, { x: string; y: string }> = {
    0: { x: "50%", y: "25%" },
    1: { x: "12%", y: "18%" },
    2: { x: "80%", y: "65%" },
    3: { x: "80%", y: "65%" },
    4: { x: "80%", y: "65%" },
    5: { x: "50%", y: "25%" },
  };
  const pos = positions[step] || positions[0];

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", padding: "12px" }}>
      <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
        <div style={{ flex: 1, borderRadius: "8px", background: "#fff", boxShadow: "0 0 0 1px #e3e8ee", padding: "10px 12px" }}>
          <div style={{ fontSize: "8px", color: "#697386", marginBottom: "2px" }}>Monthly Sales</div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#1a1f36" }}>$8,920</div>
        </div>
        <div style={{ flex: 1, borderRadius: "8px", background: "#fff", boxShadow: "0 0 0 1px #e3e8ee", padding: "10px 12px" }}>
          <div style={{ fontSize: "8px", color: "#697386", marginBottom: "2px" }}>Growth</div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#0e6245" }}>+18.3%</div>
        </div>
      </div>
      <div style={{ borderRadius: "8px", background: "#fff", boxShadow: "0 0 0 1px #e3e8ee", padding: "10px 12px" }}>
        <div style={{ fontSize: "8px", color: "#697386", marginBottom: "6px" }}>Performance</div>
        <svg width="100%" height="70" viewBox="0 0 200 70" preserveAspectRatio="none">
          <path d="M0 65 L25 55 L50 48 L75 52 L100 35 L125 28 L150 20 L175 15 L200 8" fill="none" stroke="#635bff" strokeWidth="2"/>
          <path d="M0 65 L25 55 L50 48 L75 52 L100 35 L125 28 L150 20 L175 15 L200 8 L200 70 L0 70 Z" fill="url(#dragGrad)" opacity="0.12"/>
          <defs><linearGradient id="dragGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#635bff"/><stop offset="100%" stopColor="#635bff" stopOpacity="0"/></linearGradient></defs>
        </svg>
      </div>
      <div style={{ marginTop: "8px", borderRadius: "8px", background: "#fff", boxShadow: "0 0 0 1px #e3e8ee", padding: "10px 12px" }}>
        <div style={{ fontSize: "8px", color: "#697386", marginBottom: "6px" }}>Top Products</div>
        {["Widget Pro — $2,400", "Dashboard — $1,890", "API Access — $1,200"].map((item, i) => (
          <div key={i} style={{ fontSize: "9px", color: "#4f566b", padding: "3px 0", borderTop: i > 0 ? "1px solid #f2f5f9" : "none" }}>{item}</div>
        ))}
      </div>

      <AnimatePresence>
        {(step === 1 || dragging) && (
          <motion.div
            className="absolute z-30 pointer-events-none"
            style={{
              border: "2px dashed #635bff",
              borderRadius: "4px",
              background: "rgba(99,91,255,0.06)",
            }}
            initial={{ left: "12%", top: "18%", width: "0%", height: "0%" }}
            animate={{
              left: "12%",
              top: "18%",
              width: dragging ? "68%" : "0%",
              height: dragging ? "47%" : "0%",
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: dragging ? 1.4 : 0.1, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "rgba(0,0,0,0.3)", zIndex: 3 }}
        animate={{ opacity: captured ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />

      <AnimatePresence>
        {showNotif && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute z-50"
            style={{ bottom: "10px", right: "10px", background: "#171717", borderRadius: "6px", padding: "5px 10px", display: "flex", alignItems: "center", gap: "5px" }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>
            <span style={{ fontSize: "9px", fontWeight: 600, color: "#34D399" }}>Copied</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Cursor x={pos.x} y={pos.y} />
    </div>
  );
}

function FullScreenDemo() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timings = [2000, 500, 1800, 1400];
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
    <div style={{ width: "100%", height: "100%", position: "relative", padding: "12px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "8px" }}>
        {[
          { label: "Visitors", value: "24.1K" },
          { label: "Bounce", value: "32%" },
          { label: "Duration", value: "4:12" },
        ].map(c => (
          <div key={c.label} style={{ borderRadius: "8px", background: "#fff", boxShadow: "0 0 0 1px #e3e8ee", padding: "10px 12px" }}>
            <div style={{ fontSize: "8px", color: "#697386", marginBottom: "2px" }}>{c.label}</div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#1a1f36" }}>{c.value}</div>
          </div>
        ))}
      </div>
      <div style={{ borderRadius: "8px", background: "#fff", boxShadow: "0 0 0 1px #e3e8ee", padding: "10px 12px", marginBottom: "8px" }}>
        <div style={{ fontSize: "8px", color: "#697386", marginBottom: "6px" }}>Traffic Sources</div>
        <svg width="100%" height="50" viewBox="0 0 200 50" preserveAspectRatio="none">
          {[[20,35],[50,45],[80,28],[110,40],[140,32],[170,48],[195,20]].map(([x, h], i) => (
            <rect key={i} x={x - 10} y={50 - h} width="16" height={h} fill="#635bff" opacity={0.5 + i * 0.05} rx="2" />
          ))}
        </svg>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        <div style={{ borderRadius: "8px", background: "#fff", boxShadow: "0 0 0 1px #e3e8ee", padding: "10px 12px" }}>
          <div style={{ fontSize: "8px", color: "#697386", marginBottom: "4px" }}>Pages</div>
          {["/home — 8.2K", "/pricing — 3.1K", "/docs — 2.4K"].map((p, i) => (
            <div key={i} style={{ fontSize: "9px", color: "#4f566b", padding: "2px 0" }}>{p}</div>
          ))}
        </div>
        <div style={{ borderRadius: "8px", background: "#fff", boxShadow: "0 0 0 1px #e3e8ee", padding: "10px 12px" }}>
          <div style={{ fontSize: "8px", color: "#697386", marginBottom: "4px" }}>Devices</div>
          {["Desktop — 68%", "Mobile — 24%", "Tablet — 8%"].map((p, i) => (
            <div key={i} style={{ fontSize: "9px", color: "#4f566b", padding: "2px 0" }}>{p}</div>
          ))}
        </div>
      </div>

      <motion.div
        className="absolute pointer-events-none"
        style={{ inset: "0", background: "rgba(0,0,0,0.3)", zIndex: 3 }}
        animate={{ opacity: captured ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      />

      <AnimatePresence>
        {captured && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute z-30 pointer-events-none"
            style={{
              inset: "0",
              border: "3px solid #34D399",
              borderRadius: "12px",
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNotif && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute z-50"
            style={{ bottom: "10px", right: "10px", background: "#171717", borderRadius: "6px", padding: "5px 10px", display: "flex", alignItems: "center", gap: "5px" }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>
            <span style={{ fontSize: "9px", fontWeight: 600, color: "#34D399" }}>Copied</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Showcase() {
  const modes = [
    {
      title: "Click to capture",
      desc: "Hover any element and click once. Pixie detects it automatically.",
      keys: ["⌘", "⇧", "6"],
      demo: <HoverCaptureDemo />,
    },
    {
      title: "Drag to select",
      desc: "Click and drag to draw a custom selection area.",
      keys: ["⌘", "⇧", "7"],
      demo: <DragSelectDemo />,
    },
    {
      title: "Full screenshot",
      desc: "Capture your entire screen in one click.",
      keys: ["⌘", "⇧", "8"],
      demo: <FullScreenDemo />,
    },
  ];

  return (
    <section id="showcase" className="w-full px-6 md:px-8 pt-4 pb-24 md:pb-36 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", marginBottom: "56px" }}
      >
        <h2 style={{
          fontFamily: "Arial, sans-serif",
          fontSize: "42px",
          fontWeight: 700,
          color: "#171717",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          marginBottom: "14px",
        }}>
          Three ways to capture
        </h2>
        <p style={{
          fontFamily: "Arial, sans-serif",
          fontSize: "15px",
          color: "rgba(0,0,0,0.45)",
          lineHeight: 1.6,
        }}>
          Every workflow covered. No dragging files, no cropping, no extra steps.
        </p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", maxWidth: "960px", width: "100%" }}>
        {modes.map((mode, i) => (
          <motion.div
            key={mode.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <MiniApp>{mode.demo}</MiniApp>
            <div style={{ padding: "0 2px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                <h3 style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#171717",
                  margin: 0,
                }}>
                  {mode.title}
                </h3>
                <div style={{ display: "flex", gap: "3px" }}>
                  {mode.keys.map((k, idx) => (
                    <kbd
                      key={idx}
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "10px",
                        fontWeight: 500,
                        color: "#171717",
                        background: "rgba(0,0,0,0.04)",
                        border: "1px solid rgba(0,0,0,0.08)",
                        borderRadius: "4px",
                        padding: "2px 6px",
                        display: "inline-block",
                      }}
                    >
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
              <p style={{
                fontFamily: "Arial, sans-serif",
                fontSize: "13px",
                color: "rgba(0,0,0,0.4)",
                lineHeight: 1.5,
                margin: 0,
              }}>
                {mode.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
