import { motion } from "framer-motion";

const features = [
  {
    title: "Zero Context Switching",
    description: "Never leave your tab or open a clunky screenshot tool. Just hover, click, and paste.",
    className: "grad-card-1 text-zinc-900",
  },
  {
    title: "DOM-Aware Precision",
    description: "It knows what a button is. It knows what a card is. No more manual cropping.",
    className: "grad-card-2 text-zinc-900",
  },
  {
    title: "Instant Clipboard",
    description: "Pasted into Figma, Slack, or Linear before you even blink.",
    className: "grad-card-3 text-zinc-900",
  },
  {
    title: "Retina Quality",
    description: "Every capture is rendered at 2x resolution, guaranteeing crisp assets every time.",
    className: "grad-card-4 text-zinc-900",
  }
];

export function Features() {
  return (
    <section id="features" className="w-full max-w-7xl mx-auto px-4 py-32">
      <div className="mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-display font-bold mb-6"
        >
          Built for speed.
          <br />
          Designed for exactness.
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            whileHover={{ y: -8, scale: 0.98 }}
            className={`p-8 md:p-12 rounded-[2rem] aspect-square md:aspect-auto md:h-[400px] flex flex-col justify-end transition-all duration-300 ${feature.className}`}
          >
            <h3 className="font-display font-bold text-3xl md:text-4xl mb-4 leading-tight">
              {feature.title}
            </h3>
            <p className="text-lg md:text-xl font-medium opacity-90 text-balance">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
