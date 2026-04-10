import { motion } from "framer-motion";

const roles = [
  {
    role: "Designers",
    text: "Grab UI references, capture components, and build visual libraries without leaving your workflow.",
  },
  {
    role: "Engineers",
    text: "Annotate bugs, capture exact screen regions, and paste directly into PRs, tickets, or docs.",
  },
  {
    role: "Everyone",
    text: "Share what you see with anyone — no cropping, no file hunting, no extra steps.",
  }
];

export function UseCases() {
  return (
    <section id="use-cases" className="w-full max-w-5xl mx-auto px-6 md:px-8 py-20 md:py-32">
      <div className="text-center mb-12 md:mb-20">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-display font-bold"
        >
          Made for people who ship.
        </motion.h2>
      </div>

      <div className="space-y-10 md:space-y-16">
        {roles.map((item, i) => (
          <motion.div 
            key={item.role}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="flex flex-col md:flex-row gap-3 md:gap-12 items-start md:items-baseline border-b border-border pb-10 md:pb-16 last:border-0"
          >
            <h3 className="text-2xl sm:text-3xl font-display font-bold w-full md:w-1/3 shrink-0">
              {item.role}
            </h3>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground w-full md:w-2/3 leading-relaxed text-balance">
              {item.text}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
