import { ReactNode, useRef } from "react";
import { motion } from "framer-motion";

interface HorizontalScrollProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function HorizontalScroll({
  title,
  subtitle,
  children,
  className = "",
}: HorizontalScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className={`py-4 ${className}`}>
      {(title || subtitle) && (
        <div className="px-4 mb-3">
          {title && (
            <h2 className="text-lg font-bold text-foreground">{title}</h2>
          )}
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      )}
      <motion.div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto px-4 pb-2 scroll-smooth-touch"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {children}
      </motion.div>
    </section>
  );
}
