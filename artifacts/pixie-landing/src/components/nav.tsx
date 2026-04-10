import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function Nav() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center"
      style={{ padding: "12px 16px 0" }}
    >
      <nav
        className="glass-nav border border-border/50 flex items-center justify-between gap-6 md:gap-12"
        style={{
          maxWidth: "780px",
          width: "100%",
          borderRadius: "9999px",
          padding: "10px 10px 10px 28px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <Link
          href="/"
          className="font-display font-bold tracking-tight text-foreground flex items-center gap-2.5 shrink-0 text-lg md:text-xl"
        >
          <div className="w-4 h-4 rounded-full bg-foreground" />
          Pixie
        </Link>

        <div className="hidden md:flex items-center gap-6 text-[15px] font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors whitespace-nowrap">
            Features
          </a>
          <a href="#showcase" className="hover:text-foreground transition-colors whitespace-nowrap">
            How it works
          </a>
          <a href="#use-cases" className="hover:text-foreground transition-colors whitespace-nowrap">
            Use cases
          </a>
        </div>

        <Button className="rounded-full font-semibold shrink-0 h-10 px-6 text-sm">
          Download for Mac
        </Button>
      </nav>
    </motion.header>
  );
}
