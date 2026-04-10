import { motion } from "framer-motion";

const shortcuts = [
  { keys: ["⌘", "⇧", "6"], label: "Click & capture", desc: "Hover over any element" },
  { keys: ["⌘", "⇧", "7"], label: "Drag to select", desc: "Draw a custom area" },
  { keys: ["⌘", "⇧", "8"], label: "Full screen", desc: "Capture the entire screen" },
  { keys: ["⌘", "C"], label: "Copy", desc: "Copy capture to clipboard" },
  { keys: ["↵"], label: "Save", desc: "Save to Desktop" },
  { keys: ["Esc"], label: "Cancel", desc: "Dismiss and exit" },
];

export function Features() {
  return (
    <section id="features" className="w-full max-w-4xl mx-auto px-6 md:px-8 py-24 md:py-36 flex flex-col items-center">
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
          color: "#ffffff",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          marginBottom: "14px",
        }}>
          Keyboard Shortcuts
        </h2>
        <p style={{
          fontFamily: "Arial, sans-serif",
          fontSize: "15px",
          color: "rgba(255,255,255,0.45)",
          lineHeight: 1.6,
        }}>
          Every action is one shortcut away. No mouse required.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.03)",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {shortcuts.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "20px 32px",
              borderBottom: i < shortcuts.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}
          >
            <div>
              <div style={{ fontFamily: "Arial, sans-serif", fontSize: "15px", fontWeight: 600, color: "#ffffff", marginBottom: "3px" }}>{s.label}</div>
              <div style={{ fontFamily: "Arial, sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>{s.desc}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {s.keys.map((k, idx) => (
                <kbd
                  key={`${s.label}-${idx}`}
                  style={{
                    fontFamily: "Arial, sans-serif",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#ffffff",
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    minWidth: "36px",
                    textAlign: "center",
                    display: "inline-block",
                  }}
                >
                  {k}
                </kbd>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
