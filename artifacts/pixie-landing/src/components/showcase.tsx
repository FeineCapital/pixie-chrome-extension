import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function CaptureDemo() {
  const [step, setStep] = useState(0);
  // steps: 0=idle, 1=hover, 2=captured, 3=toolbar, 4=done

  useEffect(() => {
    const timings = [1200, 1000, 800, 1200, 1400];
    let t: ReturnType<typeof setTimeout>;
    function advance(s: number) {
      t = setTimeout(() => {
        const next = (s + 1) % 5;
        setStep(next);
        advance(next);
      }, timings[s]);
    }
    advance(step);
    return () => clearTimeout(t);
  }, []);

  const isHovered = step >= 1;
  const isCaptured = step >= 2;
  const showToolbar = step >= 3;
  const isDone = step === 4;

  return (
    <div className="relative w-full max-w-lg mx-auto select-none">
      {/* Fake browser / app window */}
      <div className="rounded-2xl overflow-hidden border border-zinc-700 shadow-2xl bg-zinc-800">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border-b border-zinc-700">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <div className="flex-1 mx-6 h-5 bg-zinc-700 rounded-full" />
        </div>

        {/* Page content */}
        <div className="relative bg-white p-6 md:p-8">
          {/* Dim overlay when captured */}
          <motion.div
            className="absolute inset-0 bg-black/50 pointer-events-none z-10"
            animate={{ opacity: isCaptured ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Fake page skeleton */}
          <div className="space-y-4">
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
            <div className="h-3 w-full bg-gray-100 rounded" />
            <div className="h-3 w-5/6 bg-gray-100 rounded" />

            {/* Target element that gets highlighted */}
            <motion.div
              className="relative mt-6 rounded-xl p-5 border-2 transition-all"
              animate={{
                borderColor: isCaptured
                  ? "rgba(16,185,129,0.8)"
                  : isHovered
                  ? "rgba(59,130,246,0.8)"
                  : "rgba(229,231,235,1)",
                boxShadow: isCaptured
                  ? "0 0 0 3px rgba(16,185,129,0.25)"
                  : isHovered
                  ? "0 0 0 3px rgba(59,130,246,0.2)"
                  : "none",
                backgroundColor: isCaptured
                  ? "rgba(240,253,250,1)"
                  : isHovered
                  ? "rgba(239,246,255,1)"
                  : "rgba(249,250,251,1)",
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Hover label */}
              <motion.div
                className="absolute -top-7 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap z-20"
                animate={{ opacity: isHovered && !isCaptured ? 1 : 0, y: isHovered && !isCaptured ? 0 : 4 }}
                transition={{ duration: 0.2 }}
              >
                Click to capture
              </motion.div>

              <div className="h-3 w-1/2 bg-gray-300 rounded mb-2" />
              <div className="h-3 w-full bg-gray-200 rounded mb-2" />
              <div className="h-3 w-4/5 bg-gray-200 rounded mb-4" />
              <div className="h-8 w-24 bg-blue-500 rounded-full" />
            </motion.div>

            <div className="h-3 w-3/4 bg-gray-100 rounded mt-4" />
            <div className="h-3 w-1/2 bg-gray-100 rounded" />
          </div>

          {/* Cursor */}
          <motion.div
            className="absolute z-30 pointer-events-none"
            animate={{
              left: isCaptured ? "60%" : isHovered ? "55%" : "30%",
              top: isCaptured ? "62%" : isHovered ? "58%" : "20%",
              opacity: isDone ? 0 : 1,
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="#000" strokeWidth="1.5">
              <path d="M5 3l14 9-7 1-4 7L5 3z" />
            </svg>
          </motion.div>

          {/* Click ripple */}
          {isCaptured && (
            <motion.div
              key={step}
              className="absolute z-30 pointer-events-none rounded-full border-2 border-blue-400"
              style={{ left: "calc(60% - 16px)", top: "calc(62% - 16px)", width: 32, height: 32 }}
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}

          {/* Toolbar */}
          <motion.div
            className="absolute z-40 left-1/2 -translate-x-1/2 bottom-4 flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-full px-4 py-2 shadow-xl"
            animate={{ opacity: showToolbar ? 1 : 0, y: showToolbar ? 0 : 12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {["✏️", "⌫", "🔴", "🟡", "🟢"].map((icon, i) => (
              <span key={i} className="text-sm cursor-pointer">{icon}</span>
            ))}
            <div className="w-px h-4 bg-zinc-600 mx-1" />
            <motion.span
              className="text-xs font-bold text-emerald-400 px-2 py-1 bg-emerald-400/10 rounded-full"
              animate={{ scale: isDone ? [1, 1.15, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              Copy ✓
            </motion.span>
          </motion.div>
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {["Hover", "Capture", "Annotate", "Done"].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <motion.div
              className="flex items-center gap-1.5"
              animate={{ opacity: step >= i + 1 ? 1 : 0.35 }}
            >
              <motion.div
                className="w-2 h-2 rounded-full"
                animate={{ backgroundColor: step >= i + 1 ? "#10b981" : "#52525b" }}
              />
              <span className="text-xs text-zinc-400 font-medium">{label}</span>
            </motion.div>
            {i < 3 && <div className="w-4 h-px bg-zinc-700" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Showcase() {
  return (
    <section id="showcase" className="w-full px-6 md:px-8 py-24 md:py-36" style={{ background: "#111114" }}>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 md:gap-24">

        {/* Left: text */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 w-fit"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400 tracking-wide uppercase">How it works</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl sm:text-5xl md:text-6xl font-display font-bold leading-[1.05] text-white mb-6"
          >
            AI Powered
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Screen Capturing
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-zinc-400 leading-relaxed mb-10 max-w-md"
          >
            Pixie makes screen capturing effortless. Hover over any element on your screen, click once, and capture it perfectly — without dragging or cropping.
          </motion.p>

          {/* Steps */}
          <div className="space-y-6">
            {[
              { n: "01", title: "Hover", desc: "Move over any element — Pixie instantly detects and highlights it." },
              { n: "02", title: "Click", desc: "One click captures it perfectly, no dragging or adjusting required." },
              { n: "03", title: "Annotate & Share", desc: "Draw, copy to clipboard, or save to Desktop — all in seconds." },
            ].map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-4"
              >
                <div className="text-xs font-bold text-emerald-500 mt-1 w-6 shrink-0">{step.n}</div>
                <div>
                  <div className="text-white font-semibold mb-1">{step.title}</div>
                  <div className="text-zinc-500 text-sm leading-relaxed">{step.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: animated demo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-1/2"
        >
          <CaptureDemo />
        </motion.div>
      </div>
    </section>
  );
}
