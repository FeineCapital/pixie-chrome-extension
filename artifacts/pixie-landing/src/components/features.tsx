import { motion } from "framer-motion";

const features = [
  {
    title: "Select & Capture",
    description: "Drag to select any area on screen. Capture exactly what you need, nothing more.",
    className: "grad-card-1 text-zinc-900",
  },
  {
    title: "Annotate Instantly",
    description: "Draw, highlight, and mark up your captures with a built-in pencil and eraser.",
    className: "grad-card-2 text-zinc-900",
  },
  {
    title: "Clipboard Ready",
    description: "Every capture is copied to your clipboard automatically. Paste into Figma, Slack, or anywhere.",
    className: "grad-card-3 text-zinc-900",
  },
  {
    title: "Retina Quality",
    description: "Crisp, high-resolution output every time. Built for displays that demand pixel perfection.",
    className: "grad-card-4 text-zinc-900",
  }
];

export function Features() {
  return (
    <section id="features" className="w-full max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-32">
      <div className="mb-10 md:mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 md:mb-6 leading-tight"
        >
          Capture. Annotate.
          <br />
          Share. Done.
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            whileHover={{ y: -8, scale: 0.98 }}
            className={`p-6 sm:p-8 md:p-12 rounded-2xl md:rounded-[2rem] min-h-[240px] sm:min-h-[280px] md:min-h-[360px] flex flex-col justify-end transition-all duration-300 ${feature.className}`}
          >
            <h3 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl mb-3 md:mb-4 leading-tight">
              {feature.title}
            </h3>
            <p className="text-base sm:text-lg md:text-xl font-medium opacity-90 text-balance leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
