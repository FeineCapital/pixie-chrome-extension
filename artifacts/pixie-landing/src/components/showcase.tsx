import { motion } from "framer-motion";

export function Showcase() {
  return (
    <section id="showcase" className="w-full px-6 md:px-8 py-20 md:py-32 bg-foreground text-background">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center gap-10 md:gap-16">
        <div className="w-full lg:w-1/2">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 md:mb-8 leading-[0.95]"
          >
            Simple by
            <br />
            design.
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4 md:space-y-6 text-base sm:text-lg md:text-xl text-zinc-400 max-w-md leading-relaxed"
          >
            <p>
              Trigger a capture from your menu bar or with a shortcut. Drag to select any region on screen.
            </p>
            <p>
              Annotate with a pencil, erase mistakes, toggle rounded or sharp corners, then copy or save. That's the entire workflow.
            </p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-1/2 relative"
        >
          <div className="aspect-[4/3] bg-zinc-900 rounded-2xl md:rounded-3xl border border-zinc-800 p-6 md:p-8 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            
            <div className="relative z-10 w-full max-w-sm">
              <div className="bg-zinc-800 rounded-t-xl p-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 bg-zinc-700 rounded h-5 mx-8" />
              </div>
              <div className="bg-zinc-850 border border-zinc-700 border-t-0 rounded-b-xl p-6 relative">
                <div className="h-5 w-3/4 bg-zinc-700 rounded mb-3" />
                <div className="h-3 w-full bg-zinc-800 rounded mb-2" />
                <div className="h-3 w-4/5 bg-zinc-800 rounded mb-4" />
                <div className="h-8 w-24 bg-zinc-700 rounded-full" />
                <div className="absolute inset-2 border-2 border-dashed border-blue-400/60 rounded-lg pointer-events-none" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
