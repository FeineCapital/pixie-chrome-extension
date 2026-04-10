import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="w-full min-h-[90vh] flex flex-col items-center justify-center px-4 pt-32 pb-20 relative overflow-hidden">
      <div className="max-w-5xl mx-auto text-center flex flex-col items-center relative z-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium border border-border"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Pixie v1.0 is now live
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl lg:text-9xl font-display font-bold leading-[0.9] text-balance mb-8 text-foreground"
        >
          Capture the web,
          <br className="hidden md:block" />
          pixel by perfect pixel.
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl text-balance mb-12"
        >
          Hover over any element. Click once. It's on your clipboard as a pristine PNG. The screenshot tool designed for obsessive creators.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Button size="lg" className="rounded-full h-14 px-8 text-lg font-semibold w-full sm:w-auto">
            Install Extension
          </Button>
          <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg font-semibold w-full sm:w-auto border-2">
            View Documentation
          </Button>
        </motion.div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-foreground/5 rounded-full blur-3xl -z-10 pointer-events-none" />
    </section>
  );
}
