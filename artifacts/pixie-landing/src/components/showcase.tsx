import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function CaptureDemo() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timings = [1400, 1000, 900, 1200, 1600];
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

  const isHovered = step >= 1;
  const isCaptured = step >= 2;
  const showToolbar = step >= 3;
  const isDone = step === 4;

  return (
    <div className="relative w-full max-w-2xl mx-auto select-none">
      <div className="rounded-2xl overflow-hidden border border-zinc-700/60 shadow-2xl bg-zinc-800">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border-b border-zinc-700/50">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <div className="flex-1 mx-8 h-5 bg-zinc-700/60 rounded-full" />
        </div>

        {/* Page */}
        <div className="relative bg-white p-10 min-h-[340px]">
          {/* Dim overlay */}
          <motion.div
            className="absolute inset-0 bg-black/50 pointer-events-none z-10"
            animate={{ opacity: isCaptured ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Fake content */}
          <div className="space-y-3 mb-8">
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
            <div className="h-3 w-full bg-gray-100 rounded" />
            <div className="h-3 w-5/6 bg-gray-100 rounded" />
          </div>

          {/* Target element */}
          <motion.div
            className="relative rounded-xl p-6 border-2"
            animate={{
              borderColor: isCaptured ? "rgba(16,185,129,0.8)" : isHovered ? "rgba(59,130,246,0.8)" : "rgba(229,231,235,1)",
              boxShadow: isCaptured ? "0 0 0 4px rgba(16,185,129,0.2)" : isHovered ? "0 0 0 4px rgba(59,130,246,0.15)" : "none",
              backgroundColor: isCaptured ? "rgba(240,253,250,1)" : isHovered ? "rgba(239,246,255,1)" : "rgba(249,250,251,1)",
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Hover label */}
            <motion.div
              className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap z-20"
              animate={{ opacity: isHovered && !isCaptured ? 1 : 0, y: isHovered && !isCaptured ? 0 : 6 }}
              transition={{ duration: 0.2 }}
            >
              Click to capture
            </motion.div>

            <div className="h-3 w-1/2 bg-gray-300 rounded mb-3" />
            <div className="h-3 w-full bg-gray-200 rounded mb-2" />
            <div className="h-3 w-4/5 bg-gray-200 rounded mb-5" />
            <div className="h-9 w-28 bg-blue-500 rounded-full" />
          </motion.div>

          <div className="space-y-2 mt-6">
            <div className="h-3 w-3/4 bg-gray-100 rounded" />
            <div className="h-3 w-1/2 bg-gray-100 rounded" />
          </div>

          {/* Cursor */}
          <motion.div
            className="absolute z-30 pointer-events-none"
            animate={{
              left: isCaptured ? "58%" : isHovered ? "52%" : "25%",
              top: isCaptured ? "58%" : isHovered ? "54%" : "18%",
              opacity: isDone ? 0 : 1,
            }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white" stroke="#111" strokeWidth="1.5">
              <path d="M5 3l14 9-7 1-4 7L5 3z" />
            </svg>
          </motion.div>

          {/* Click ripple */}
          {isCaptured && (
            <motion.div
              key={`ripple-${step}`}
              className="absolute z-30 pointer-events-none rounded-full border-2 border-blue-400"
              style={{ left: "calc(58% - 14px)", top: "calc(58% - 14px)", width: 28, height: 28 }}
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}

          {/* Toolbar */}
          <motion.div
            className="absolute z-40 left-1/2 -translate-x-1/2 bottom-5 flex items-center gap-3 bg-zinc-900 border border-zinc-700 rounded-full px-5 py-2.5 shadow-2xl"
            animate={{ opacity: showToolbar ? 1 : 0, y: showToolbar ? 0 : 10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-sm">✏️</span>
            <span className="text-sm">⌫</span>
            <div className="w-px h-4 bg-zinc-600" />
            <div className="flex gap-2">
              {["#ef4444","#facc15","#60a5fa"].map(c => (
                <div key={c} className="w-3.5 h-3.5 rounded-full" style={{ background: c }} />
              ))}
            </div>
            <div className="w-px h-4 bg-zinc-600" />
            <motion.span
              className="text-xs font-bold text-emerald-400 px-2.5 py-1 bg-emerald-400/10 rounded-full"
              animate={{ scale: isDone ? [1, 1.12, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              Copy ✓
            </motion.span>
          </motion.div>
        </div>
      </div>

      {/* Step dots */}
      <div className="flex justify-center items-center gap-2 mt-5">
        {[1,2,3,4].map(i => (
          <motion.div
            key={i}
            className="rounded-full"
            animate={{
              width: step === i ? 20 : 6,
              height: 6,
              backgroundColor: step >= i ? "#10b981" : "#3f3f46",
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}

export function Showcase() {
  return (
    <section id="showcase" className="w-full px-6 md:px-8 py-24 md:py-36 flex flex-col items-center" style={{ background: "#111114" }}>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-4"
      >
        How it works
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white text-center mb-4 leading-tight"
      >
        Hover. Click. Done.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-zinc-500 text-lg text-center max-w-md mb-16"
      >
        No dragging, no cropping. Just hover over anything and click.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="w-full"
      >
        <CaptureDemo />
      </motion.div>
    </section>
  );
}
