import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="w-full min-h-[90vh] flex flex-col items-center justify-center px-6 md:px-8 pt-36 md:pt-40 pb-20 relative overflow-hidden">
      <div className="max-w-5xl mx-auto text-center flex flex-col items-center relative z-10">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[2.75rem] leading-[1] sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-bold md:leading-[0.9] text-balance mb-6 md:mb-8 text-foreground"
        >
          Capture the web,
          <br className="hidden sm:block" />
          pixel by perfect pixel.
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl text-balance mb-8 md:mb-12 leading-relaxed"
        >
          Hover over any element. Click once. It's on your clipboard as a pristine PNG. The screenshot tool designed for obsessive creators.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto"
        >
          <Button size="lg" className="rounded-full h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold w-full sm:w-auto">
            Install Extension
          </Button>
          <Button size="lg" variant="outline" className="rounded-full h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold w-full sm:w-auto border-2">
            View Documentation
          </Button>
        </motion.div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-foreground/5 rounded-full blur-3xl -z-10 pointer-events-none" />
    </section>
  );
}
