import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CtaFooter() {
  return (
    <footer className="w-full bg-secondary border-t border-border pt-32 pb-12 px-4 relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-8xl font-display font-bold mb-8 text-foreground"
        >
          Ready to click?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
        >
          Join thousands of designers and engineers who have upgraded their workflow. It's free, light, and private.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Button size="lg" className="rounded-full h-16 px-10 text-xl font-bold bg-foreground text-background hover:bg-foreground/90">
            Add to Chrome — It's Free
          </Button>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto mt-32 flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border/50 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Pixie. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
          <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
}
