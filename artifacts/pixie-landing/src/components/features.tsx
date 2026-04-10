import { motion } from "framer-motion";

const features = [
  {
    icon: "⚡",
    title: "Instant Capture",
    description: "Hover over any element and click to capture. No drag, no crop, no setup.",
  },
  {
    icon: "✏️",
    title: "Annotation Tools",
    description: "Draw, highlight, and mark up captures with a built-in pencil and eraser.",
  },
  {
    icon: "📋",
    title: "Clipboard Ready",
    description: "Every capture is copied automatically. Paste into Figma, Slack, or anywhere.",
  },
  {
    icon: "🖥️",
    title: "Retina Quality",
    description: "Crisp, high-resolution output. Built for displays that demand pixel perfection.",
  },
  {
    icon: "🔒",
    title: "Fully Private",
    description: "Nothing leaves your Mac. No cloud, no account, no tracking whatsoever.",
  },
  {
    icon: "🪶",
    title: "Lightweight",
    description: "Lives in your menu bar. Uses minimal memory and never slows your machine down.",
  },
];

const shortcuts = [
  { keys: ["⌘", "⇧", "7"], label: "Click & capture" },
  { keys: ["⌘", "⇧", "8"], label: "Full screen capture" },
  { keys: ["⌘", "C"], label: "Copy to clipboard" },
  { keys: ["↵"], label: "Save to Desktop" },
];

export function Features() {
  return (
    <section id="features" className="w-full max-w-7xl mx-auto px-6 md:px-8 py-24 md:py-36">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-4"
      >
        Features
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-foreground mb-16 leading-tight"
      >
        Everything you need.
        <br />
        Nothing you don't.
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-7 flex flex-col gap-3 hover:border-white/[0.14] hover:bg-white/[0.05] transition-all duration-300"
          >
            <span className="text-2xl">{f.icon}</span>
            <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-8 md:p-10"
      >
        <p className="text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-6">Keyboard Shortcuts</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {shortcuts.map((s) => (
            <div key={s.label} className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground text-sm">{s.label}</span>
              <div className="flex items-center gap-1">
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    className="px-2.5 py-1 rounded-md bg-white/[0.06] border border-white/[0.1] text-foreground text-xs font-mono font-medium"
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
