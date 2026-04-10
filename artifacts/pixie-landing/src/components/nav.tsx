import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function Nav() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4"
    >
      <nav className="glass-nav border border-border shadow-sm rounded-full px-4 py-2 flex items-center justify-between gap-8 md:gap-16">
        <Link href="/" className="font-display font-bold text-xl tracking-tight text-foreground flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-foreground" />
          Pixie
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#showcase" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#use-cases" className="hover:text-foreground transition-colors">Use cases</a>
        </div>
        <Button className="rounded-full px-6 font-semibold" size="sm">
          Get for Chrome
        </Button>
      </nav>
    </motion.header>
  );
}
