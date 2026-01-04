import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Star } from "lucide-react";
import { Drama, getCoverUrl, formatViewCount } from "@/lib/api";

interface DramaCardProps {
  drama: Drama;
  variant?: "default" | "large" | "compact";
  index?: number;
}

export function DramaCard({ drama, variant = "default", index = 0 }: DramaCardProps) {
  const coverUrl = getCoverUrl(drama);

  if (variant === "large") {
    return (
      <Link to={`/drama/${drama.bookId}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          whileTap={{ scale: 0.98 }}
          className="relative w-[280px] h-[380px] rounded-xl overflow-hidden flex-shrink-0"
        >
          <img
            src={coverUrl}
            alt={drama.bookName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          
          {drama.corner && (
            <div
              className="absolute top-3 left-3 px-2 py-1 rounded text-xs font-semibold"
              style={{ backgroundColor: drama.corner.color || "hsl(var(--primary))" }}
            >
              {drama.corner.name}
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-bold text-base text-foreground line-clamp-2 mb-1">
              {drama.bookName}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Play className="w-3 h-3" />
                <span>{formatViewCount(drama.playCount)}</span>
              </div>
              {drama.chapterCount && (
                <>
                  <span>•</span>
                  <span>{drama.chapterCount} Episode</span>
                </>
              )}
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity">
            <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
              <Play className="w-6 h-6 text-primary-foreground fill-current ml-1" />
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link to={`/drama/${drama.bookId}`}>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          whileTap={{ scale: 0.98 }}
          className="flex gap-3 p-2 rounded-lg bg-card/50 active:bg-card"
        >
          <div className="relative w-20 h-28 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={coverUrl}
              alt={drama.bookName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {drama.rankVo && (
              <div className="absolute top-1 left-1 w-6 h-6 rounded bg-primary flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">
                  {drama.rankVo.sort}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 py-1">
            <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-1">
              {drama.bookName}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {drama.introduction}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="w-3 h-3 text-accent fill-accent" />
              <span>{formatViewCount(drama.playCount)}</span>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link to={`/drama/${drama.bookId}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        whileTap={{ scale: 0.96 }}
        className="relative w-[140px] rounded-lg overflow-hidden flex-shrink-0 group"
      >
        <div className="relative aspect-[2/3] w-full">
          <img
            src={coverUrl}
            alt={drama.bookName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
          
          {drama.corner && (
            <div
              className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-semibold"
              style={{ backgroundColor: drama.corner.color || "hsl(var(--primary))" }}
            >
              {drama.corner.name}
            </div>
          )}
        </div>

        <div className="p-2">
          <h3 className="font-semibold text-xs text-foreground line-clamp-2 mb-1">
            {drama.bookName}
          </h3>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Play className="w-2.5 h-2.5" />
            <span>{formatViewCount(drama.playCount)}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
