import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Heart,
  Share2,
  ChevronDown,
  Star,
  Eye,
  Users,
  ArrowLeft,
  Lock,
} from "lucide-react";
import {
  fetchDetail,
  fetchAllEpisodes,
  formatViewCount,
  formatDuration,
} from "@/lib/api";
import { VideoPlayer } from "@/components/VideoPlayer";

export default function DramaDetail() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const { data: detailData, isLoading: detailLoading } = useQuery({
    queryKey: ["detail", bookId],
    queryFn: () => fetchDetail(bookId!),
    enabled: !!bookId,
  });

  const { data: episodes, isLoading: episodesLoading } = useQuery({
    queryKey: ["episodes", bookId],
    queryFn: () => fetchAllEpisodes(bookId!),
    enabled: !!bookId,
  });

  const book = detailData?.data?.book;
  const chapterList = detailData?.data?.chapterList || [];

  // Auto-play first unlocked episode
  useEffect(() => {
    if (chapterList.length > 0) {
      const firstUnlocked = chapterList.findIndex((ch) => ch.unlock);
      if (firstUnlocked !== -1) {
        setCurrentEpisodeIndex(firstUnlocked);
      }
    }
  }, [chapterList]);

  const handlePlayEpisode = (index: number) => {
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  };

  const handleEpisodeChange = (index: number) => {
    setCurrentEpisodeIndex(index);
  };

  if (detailLoading) {
    return (
      <div className="mobile-container">
        <div className="aspect-[2/3] w-full skeleton-pulse" />
        <div className="p-4 space-y-4">
          <div className="h-8 w-3/4 skeleton-pulse" />
          <div className="h-4 w-full skeleton-pulse" />
          <div className="h-4 w-2/3 skeleton-pulse" />
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="mobile-container flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Drama tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="mobile-container">
      <AnimatePresence>
        {isPlaying && episodes && episodes.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black"
          >
            <VideoPlayer
              episodes={episodes}
              currentIndex={currentEpisodeIndex}
              onEpisodeChange={handleEpisodeChange}
              onClose={() => setIsPlaying(false)}
              dramaName={book.bookName}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pb-24"
          >
            {/* Hero Cover */}
            <div className="relative">
              <img
                src={book.cover}
                alt={book.bookName}
                className="w-full aspect-[3/4] object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: "var(--gradient-hero)" }}
              />

              {/* Back button */}
              <button
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 w-10 h-10 rounded-full glass flex items-center justify-center touch-button"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>

              {/* Play button overlay */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handlePlayEpisode(currentEpisodeIndex)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
              >
                <Play className="w-8 h-8 text-primary-foreground fill-current ml-1" />
              </motion.button>

              {/* Drama info at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h1 className="text-xl font-bold text-foreground mb-2">
                  {book.bookName}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{formatViewCount(book.viewCount)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{formatViewCount(book.followCount)}</span>
                  </div>
                  <span>{book.chapterCount} Episode</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {book.tags?.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-around p-4 border-b border-border">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handlePlayEpisode(currentEpisodeIndex)}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Play className="w-4 h-4 fill-current" />
                Tonton
              </motion.button>

              <button
                onClick={() => setIsLiked(!isLiked)}
                className="flex flex-col items-center gap-1 touch-button"
              >
                <Heart
                  className={`w-6 h-6 transition-colors ${
                    isLiked ? "text-primary fill-primary" : "text-muted-foreground"
                  }`}
                />
                <span className="text-xs text-muted-foreground">Suka</span>
              </button>

              <button className="flex flex-col items-center gap-1 touch-button">
                <Share2 className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Bagikan</span>
              </button>
            </div>

            {/* Description */}
            <div className="p-4 border-b border-border">
              <p
                className={`text-sm text-muted-foreground ${
                  showFullDescription ? "" : "line-clamp-3"
                }`}
              >
                {book.introduction}
              </p>
              {book.introduction && book.introduction.length > 100 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="flex items-center gap-1 text-primary text-sm mt-2"
                >
                  {showFullDescription ? "Sembunyikan" : "Selengkapnya"}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      showFullDescription ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}
            </div>

            {/* Cast */}
            {book.performerList && book.performerList.length > 0 && (
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-foreground mb-3">Pemeran</h3>
                <div className="flex gap-4 overflow-x-auto">
                  {book.performerList.map((performer) => (
                    <div
                      key={performer.performerId}
                      className="flex flex-col items-center flex-shrink-0"
                    >
                      <img
                        src={performer.performerAvatar}
                        alt={performer.performerName}
                        className="w-16 h-16 rounded-full object-cover mb-2"
                      />
                      <span className="text-xs text-foreground text-center w-16 line-clamp-2">
                        {performer.performerName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Episodes */}
            <div className="p-4">
              <h3 className="font-semibold text-foreground mb-3">
                Episode ({book.chapterCount})
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {chapterList.map((chapter, idx) => (
                  <motion.button
                    key={chapter.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (chapter.unlock) {
                        handlePlayEpisode(idx);
                      }
                    }}
                    className={`relative aspect-video rounded-lg overflow-hidden ${
                      !chapter.unlock ? "opacity-60" : ""
                    } ${
                      idx === currentEpisodeIndex
                        ? "ring-2 ring-primary"
                        : ""
                    }`}
                  >
                    <img
                      src={chapter.cover}
                      alt={chapter.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      {chapter.unlock ? (
                        <span className="text-xs font-bold text-foreground">
                          {idx + 1}
                        </span>
                      ) : (
                        <Lock className="w-4 h-4 text-foreground" />
                      )}
                    </div>
                    {chapter.chapterPrice > 0 && (
                      <div className="absolute top-1 right-1 px-1 py-0.5 rounded text-[8px] font-bold bg-accent text-accent-foreground">
                        VIP
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
