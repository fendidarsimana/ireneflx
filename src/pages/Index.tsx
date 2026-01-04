import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fetchLatest, fetchTrending, fetchVip, Drama } from "@/lib/api";
import { DramaCard } from "@/components/DramaCard";
import { HorizontalScroll } from "@/components/HorizontalScroll";
import { SkeletonRow } from "@/components/SkeletonCard";
import { AppHeader } from "@/components/AppHeader";
import { Play, Star } from "lucide-react";
import { Link } from "react-router-dom";
export default function Index() {
  const { data: trendingData, isLoading: trendingLoading } = useQuery({
    queryKey: ["trending"],
    queryFn: fetchTrending,
  });

  const { data: latestData, isLoading: latestLoading } = useQuery({
    queryKey: ["latest"],
    queryFn: fetchLatest,
  });

  const { data: vipData, isLoading: vipLoading } = useQuery({
    queryKey: ["vip"],
    queryFn: fetchVip,
  });

  const featuredDrama = trendingData?.[0];

  return (
    <div className="mobile-container pb-24">
      <AppHeader transparent />
      {/* Hero Section */}
      {featuredDrama && (
        <Link to={`/drama/${featuredDrama.bookId}`}>
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative h-[420px] w-full"
          >
            <img
              src={featuredDrama.coverWap || featuredDrama.cover}
              alt={featuredDrama.bookName}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: "var(--gradient-hero)" }}
            />

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {featuredDrama.rankVo && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge-vip flex items-center gap-1">
                      <Star className="w-3 h-3" /> #1 Trending
                    </span>
                  </div>
                )}
                <h1 className="text-2xl font-bold text-foreground mb-2 line-clamp-2">
                  {featuredDrama.bookName}
                </h1>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {featuredDrama.introduction}
                </p>

                <div className="flex items-center gap-2 mb-4">
                  {featuredDrama.tags?.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <Play className="w-4 h-4 fill-current" />
                  Tonton Sekarang
                </motion.button>
              </motion.div>
            </div>
          </motion.section>
        </Link>
      )}

      {/* Trending Section */}
      <HorizontalScroll title="🔥 Trending Sekarang" className="mt-4">
        {trendingLoading ? (
          <SkeletonRow count={5} />
        ) : (
          trendingData?.slice(1, 10).map((drama: Drama, idx: number) => (
            <DramaCard key={drama.bookId} drama={drama} index={idx} />
          ))
        )}
      </HorizontalScroll>

      {/* Latest Section */}
      <HorizontalScroll title="✨ Terbaru" subtitle="Drama baru setiap hari">
        {latestLoading ? (
          <SkeletonRow count={5} />
        ) : (
          latestData?.slice(0, 10).map((drama: Drama, idx: number) => (
            <DramaCard key={drama.bookId} drama={drama} index={idx} />
          ))
        )}
      </HorizontalScroll>

      {/* VIP Columns */}
      {vipLoading ? (
        <div className="py-4">
          <div className="h-6 w-40 skeleton-pulse mx-4 mb-3" />
          <SkeletonRow count={5} variant="large" />
        </div>
      ) : (
        vipData?.columnVoList?.slice(0, 3).map((column) => (
          <HorizontalScroll
            key={column.columnId}
            title={column.title}
            subtitle={column.subTitle}
          >
            {column.bookList?.slice(0, 8).map((drama: Drama, idx: number) => (
              <DramaCard
                key={drama.bookId}
                drama={drama}
                variant="large"
                index={idx}
              />
            ))}
          </HorizontalScroll>
        ))
      )}

      {/* For You Section */}
      <HorizontalScroll title="🎬 Untuk Kamu" subtitle="Rekomendasi pilihan">
        {trendingData?.slice(5, 15).map((drama: Drama, idx: number) => (
          <DramaCard key={drama.bookId} drama={drama} index={idx} />
        ))}
      </HorizontalScroll>
    </div>
  );
}
