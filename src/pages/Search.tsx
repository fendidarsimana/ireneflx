import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search as SearchIcon, X, TrendingUp } from "lucide-react";
import { fetchSearch, fetchTrending, Drama } from "@/lib/api";
import { DramaCard } from "@/components/DramaCard";
import { SkeletonCard } from "@/components/SkeletonCard";

export default function Search() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => fetchSearch(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
  });

  const { data: trendingData } = useQuery({
    queryKey: ["trending"],
    queryFn: fetchTrending,
  });

  const clearSearch = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
  }, []);

  const showResults = debouncedQuery.length >= 2;

  return (
    <div className="mobile-container pb-24">
      {/* Search header */}
      <div className="sticky top-0 z-40 p-4 glass border-b border-border">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari drama, aktor, genre..."
            className="w-full h-12 pl-12 pr-12 rounded-full bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 touch-button"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {showResults ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-lg font-bold text-foreground mb-4">
              Hasil Pencarian
            </h2>
            {searchLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonCard key={i} variant="compact" />
                ))}
              </div>
            ) : searchResults && searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((drama: Drama, idx: number) => (
                  <DramaCard
                    key={drama.bookId}
                    drama={drama}
                    variant="compact"
                    index={idx}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <SearchIcon className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Tidak ada hasil untuk "{debouncedQuery}"
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Coba kata kunci lain
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Trending searches */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">
                  Trending Sekarang
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingData?.slice(0, 8).map((drama: Drama) => (
                  <button
                    key={drama.bookId}
                    onClick={() => setQuery(drama.bookName)}
                    className="px-3 py-2 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-primary/20 active:bg-primary/20 transition-colors"
                  >
                    {drama.bookName.split(" ").slice(0, 3).join(" ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular tags */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-3">
                Genre Populer
              </h2>
              <div className="flex flex-wrap gap-2">
                {[
                  "Romantis",
                  "CEO",
                  "Perselingkuhan",
                  "Balas Dendam",
                  "Hidden Identity",
                  "Amnesia",
                  "Second Chance",
                  "Penyesalan",
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-2 rounded-full bg-card text-card-foreground text-sm border border-border hover:border-primary active:border-primary transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
