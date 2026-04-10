import { motion } from "framer-motion";

function IconBolt({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function IconPen({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

function IconClipboard({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M9 14l2 2 4-4" />
    </svg>
  );
}

function IconMonitor({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function IconFeather({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
      <line x1="16" y1="8" x2="2" y2="22" />
      <line x1="17.5" y1="15" x2="9" y2="15" />
    </svg>
  );
}

const features = [
  { icon: IconBolt, title: "Instant Capture", description: "Hover over any element and click to capture. No drag, no crop, no setup." },
  { icon: IconPen, title: "Annotation Tools", description: "Draw, highlight, and mark up captures with a built-in pencil and eraser." },
  { icon: IconClipboard, title: "Clipboard Ready", description: "Every capture is copied automatically. Paste into Figma, Slack, or anywhere." },
  { icon: IconMonitor, title: "Retina Quality", description: "Crisp, high-resolution output. Built for displays that demand pixel perfection." },
  { icon: IconShield, title: "Fully Private", description: "Nothing leaves your Mac. No cloud, no account, no tracking whatsoever." },
  { icon: IconFeather, title: "Lightweight", description: "Lives in your menu bar. Uses minimal memory and never slows your machine down." },
];

const shortcuts = [
  { keys: ["⌘", "⇧", "6"], label: "Click & capture (hover)" },
  { keys: ["⌘", "⇧", "7"], label: "Drag to select area" },
  { keys: ["⌘", "⇧", "8"], label: "Full screen capture" },
  { keys: ["⌘", "C"], label: "Copy to clipboard" },
  { keys: ["↵"], label: "Save to Desktop" },
  { keys: ["Esc"], label: "Cancel" },
];

export function Features() {
  return (
    <section id="features" className="w-full max-w-7xl mx-auto px-6 md:px-8 py-24 md:py-36 flex flex-col items-center">
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
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          marginBottom: "56px",
          textAlign: "center",
        }}
      >
        Everything you need.
        <br />
        Nothing you don't.
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20 w-full">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              style={{
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.03)",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                transition: "border-color 0.3s, background 0.3s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
            >
              <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 style={{ fontFamily: "Arial, sans-serif", fontSize: "17px", fontWeight: 700, color: "#ffffff" }}>{f.title}</h3>
              <p style={{ fontFamily: "Arial, sans-serif", fontSize: "14px", fontWeight: 400, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{f.description}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.03)",
          padding: "32px 40px",
          width: "100%",
        }}
      >
        <p style={{
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
          fontWeight: 700,
          color: "rgba(255,255,255,0.5)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: "24px",
        }}>
          Keyboard Shortcuts
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shortcuts.map((s) => (
            <div key={s.label} className="flex items-center justify-between gap-4">
              <span style={{ fontFamily: "Arial, sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.45)" }}>{s.label}</span>
              <div className="flex items-center gap-1">
                {s.keys.map((k, idx) => (
                  <kbd
                    key={`${s.label}-${idx}`}
                    style={{
                      fontFamily: "Arial, sans-serif",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#ffffff",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "6px",
                      padding: "4px 10px",
                    }}
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
