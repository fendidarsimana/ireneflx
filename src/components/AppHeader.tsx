import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface AppHeaderProps {
  showLogo?: boolean;
  transparent?: boolean;
  title?: string;
}

export function AppHeader({ showLogo = true, transparent = false, title }: AppHeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 left-0 right-0 z-40 ${
        transparent ? "bg-transparent" : "glass border-b border-border/50"
      }`}
    >
      <div className="max-w-[430px] mx-auto flex items-center justify-between h-14 px-4">
        {showLogo ? (
          <div className="flex items-center gap-2">
            <div className="relative">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="absolute -inset-1 rounded-lg opacity-30 blur-sm" style={{ background: "var(--gradient-primary)" }} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                IreneFlix
              </span>
              <span className="text-[8px] text-muted-foreground -mt-1 tracking-wider uppercase">
                Drama Streaming
              </span>
            </div>
          </div>
        ) : title ? (
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        ) : (
          <div />
        )}
      </div>
    </motion.header>
  );
}
