import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { TrendingUp, Flame } from "lucide-react";
import { fetchTrending, fetchLatest, Drama } from "@/lib/api";
import { DramaCard } from "@/components/DramaCard";
import { HorizontalScroll } from "@/components/HorizontalScroll";
import { SkeletonCard, SkeletonRow } from "@/components/SkeletonCard";

export default function Trending() {
  const { data: trendingData, isLoading: trendingLoading } = useQuery({
    queryKey: ["trending"],
    queryFn: fetchTrending,
  });

  const { data: latestData, isLoading: latestLoading } = useQuery({
    queryKey: ["latest"],
    queryFn: fetchLatest,
  });

  return (
    <div className="mobile-container pb-24">
      {/* Header */}
      <div className="p-4 pt-6">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Trending</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Drama paling populer minggu ini
        </p>
      </div>

      {/* Top 10 */}
      <section className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-accent" />
          <h2 className="font-bold text-foreground">Top 10</h2>
        </div>

        {trendingLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} variant="compact" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {trendingData?.slice(0, 10).map((drama: Drama, idx: number) => (
              <motion.div
                key={drama.bookId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="relative"
              >
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 z-10">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      idx < 3
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {idx + 1}
                  </span>
                </div>
                <div className="ml-8">
                  <DramaCard drama={drama} variant="compact" index={idx} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* New Releases */}
      <HorizontalScroll title="📺 Rilis Terbaru" subtitle="Drama baru yang sedang naik daun">
        {latestLoading ? (
          <SkeletonRow count={5} />
        ) : (
          latestData?.slice(0, 10).map((drama: Drama, idx: number) => (
            <DramaCard key={drama.bookId} drama={drama} variant="large" index={idx} />
          ))
        )}
      </HorizontalScroll>
    </div>
  );
}
