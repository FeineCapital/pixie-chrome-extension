import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

function ChromeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 7.5c2.48 0 4.5 2.02 4.5 4.5h4.5c0-4.97-4.03-9-9-9v4.5z" opacity="0.9"/>
      <path d="M7.5 12c0-1.52.76-2.87 1.92-3.68L5.18 3.84A8.96 8.96 0 0 0 3 12h4.5z" opacity="0.7"/>
      <path d="M12 16.5c-1.52 0-2.87-.76-3.68-1.92l-4.48 4.24A8.96 8.96 0 0 0 12 21v-4.5z" opacity="0.8"/>
    </svg>
  );
}

export function Hero() {
  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center px-6 md:px-8 pt-24 pb-16 relative overflow-hidden">
      <div className="max-w-5xl mx-auto text-center flex flex-col items-center relative z-10">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[2.2rem] sm:text-5xl md:text-6xl font-display font-bold leading-[1] mb-6 md:mb-8 text-foreground whitespace-nowrap"
        >
          The easiest way to take screenshots
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-muted-foreground mb-8 md:mb-12 leading-relaxed"
        >
          Pixie makes screen capturing effortless. Hover over any element, click once,<br />
          and capture it perfectly without dragging or cropping.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4"
        >
          <Button size="lg" className="rounded-full h-14 px-10 text-lg font-semibold gap-2.5" asChild>
            <a href="https://github.com/FeineCapital/pixie-desktop-app/releases/latest/download/Pixie.dmg">
              <AppleIcon className="w-5 h-5" />
              Download for Mac
            </a>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full h-14 px-10 text-lg font-semibold gap-2.5 border-white/20 hover:bg-white/10" asChild>
            <a href="https://github.com/FeineCapital/pixie-chrome-extension" target="_blank" rel="noopener noreferrer">
              <ChromeIcon className="w-5 h-5" />
              Chrome Extension
            </a>
          </Button>
        </motion.div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-foreground/5 rounded-full blur-3xl -z-10 pointer-events-none" />
    </section>
  );
}
