import { motion } from "framer-motion";

export function Showcase() {
  return (
    <section id="showcase" className="w-full px-4 py-32 bg-foreground text-background">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="w-full lg:w-1/2">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-display font-bold mb-8 leading-[0.95]"
          >
            Your new
            <br />
            reflex.
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6 text-xl text-zinc-400 max-w-md"
          >
            <p>
              Hold <kbd className="bg-zinc-800 text-zinc-200 px-2 py-1 rounded font-sans text-sm mx-1">⌘</kbd> + <kbd className="bg-zinc-800 text-zinc-200 px-2 py-1 rounded font-sans text-sm mx-1">Shift</kbd> and hover over any element on the page.
            </p>
            <p>
              Pixie highlights the exact DOM node you're targeting. One click, and a perfectly cropped, high-resolution PNG is copied to your clipboard.
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
          {/* Stylized showcase of a DOM element being hovered */}
          <div className="aspect-[4/3] bg-zinc-900 rounded-3xl border border-zinc-800 p-8 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            
            <div className="relative z-10 w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 cursor-crosshair group transition-all duration-300">
              <div className="absolute -inset-2 rounded-[1.25rem] border-2 border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500/10 pointer-events-none" />
              <div className="absolute -top-10 -right-4 bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 pointer-events-none">
                div.card
              </div>
              
              <div className="h-8 w-2/3 bg-zinc-200 rounded mb-4" />
              <div className="h-4 w-full bg-zinc-100 rounded mb-2" />
              <div className="h-4 w-4/5 bg-zinc-100 rounded mb-6" />
              <div className="h-10 w-32 bg-zinc-900 rounded-full" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
