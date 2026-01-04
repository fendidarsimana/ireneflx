import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Crown, Star, Sparkles } from "lucide-react";
import { fetchVip, Drama } from "@/lib/api";
import { DramaCard } from "@/components/DramaCard";
import { HorizontalScroll } from "@/components/HorizontalScroll";
import { SkeletonRow } from "@/components/SkeletonCard";
import { AppHeader } from "@/components/AppHeader";

export default function Vip() {
  const { data: vipData, isLoading } = useQuery({
    queryKey: ["vip"],
    queryFn: fetchVip,
  });

  return (
    <div className="mobile-container pb-24">
      <AppHeader />
      
      {/* VIP Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-6 pt-20 overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: "var(--gradient-primary)",
          }}
        />
        <div
          className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-50"
          style={{ background: "hsl(var(--accent))" }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-accent/20">
              <Crown className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">VIP Exclusive</h1>
              <p className="text-xs text-muted-foreground">
                Akses semua konten premium
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span className="text-sm text-foreground">Tanpa Iklan</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm text-foreground">HD Quality</span>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 rounded-full font-semibold text-sm"
            style={{ background: "var(--gradient-primary)" }}
          >
            Upgrade ke VIP
          </motion.button>
        </div>
      </motion.section>

      {/* VIP Columns */}
      {isLoading ? (
        <div className="space-y-6 py-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <div className="h-6 w-40 skeleton-pulse mx-4 mb-3" />
              <SkeletonRow count={5} variant="large" />
            </div>
          ))}
        </div>
      ) : (
        vipData?.columnVoList?.map((column) => (
          <HorizontalScroll
            key={column.columnId}
            title={column.title}
            subtitle={column.subTitle}
          >
            {column.bookList?.slice(0, 10).map((drama: Drama, idx: number) => (
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

      {/* Benefits section */}
      <section className="p-4 mt-4">
        <h2 className="font-bold text-foreground mb-4">Keuntungan VIP</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Crown, title: "Akses Eksklusif", desc: "Semua episode VIP" },
            { icon: Star, title: "Bebas Iklan", desc: "Nonton tanpa gangguan" },
            { icon: Sparkles, title: "Kualitas HD", desc: "Resolusi terbaik" },
            { icon: Crown, title: "Download", desc: "Tonton offline" },
          ].map((benefit, idx) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 rounded-xl bg-card border border-border"
            >
              <benefit.icon className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-semibold text-foreground text-sm">
                {benefit.title}
              </h3>
              <p className="text-xs text-muted-foreground">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
