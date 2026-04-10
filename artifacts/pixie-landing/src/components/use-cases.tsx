import { motion } from "framer-motion";

const roles = [
  {
    role: "Designers",
    text: "Building moodboards and collecting inspiration has never been faster. Grab buttons, typography treatments, and layout sections without the messy OS-level cropping.",
  },
  {
    role: "Engineers",
    text: "Filing bug reports? Capture the exact broken component, not the entire viewport. Share visual context instantly in PRs and Jira tickets.",
  },
  {
    role: "Marketers",
    text: "Collect competitor landing page sections, ad creatives, and social proof with one click. Build reference libraries effortlessly.",
  }
];

export function UseCases() {
  return (
    <section id="use-cases" className="w-full max-w-5xl mx-auto px-4 py-32">
      <div className="text-center mb-20">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-display font-bold"
        >
          Built for the craft.
        </motion.h2>
      </div>

      <div className="space-y-16">
        {roles.map((item, i) => (
          <motion.div 
            key={item.role}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="flex flex-col md:flex-row gap-6 md:gap-12 items-baseline border-b border-border pb-16 last:border-0"
          >
            <h3 className="text-3xl font-display font-bold w-full md:w-1/3 shrink-0">
              {item.role}
            </h3>
            <p className="text-xl md:text-2xl text-muted-foreground w-full md:w-2/3 leading-relaxed text-balance">
              {item.text}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
