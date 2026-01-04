import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipForward,
  SkipBack,
  List,
  X,
  Loader2,
} from "lucide-react";
import Hls from "hls.js";
import { Episode, formatDuration } from "@/lib/api";

interface VideoPlayerProps {
  episodes: Episode[];
  currentIndex: number;
  onEpisodeChange: (index: number) => void;
  onClose?: () => void;
  dramaName: string;
}

export function VideoPlayer({
  episodes,
  currentIndex,
  onEpisodeChange,
  onClose,
  dramaName,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showEpisodeList, setShowEpisodeList] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const currentEpisode = episodes[currentIndex];

  // Get video URL - prefer 720p for mobile performance
  const getVideoUrl = useCallback(() => {
    if (!currentEpisode?.cdnList?.[0]?.videoPathList) return "";
    const videoList = currentEpisode.cdnList[0].videoPathList;
    const preferred = videoList.find((v) => v.quality === 720 && v.isDefault === 1);
    const fallback = videoList.find((v) => v.quality === 720);
    const any = videoList[0];
    return (preferred || fallback || any)?.videoPath || "";
  }, [currentEpisode]);

  // Initialize HLS
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const videoUrl = getVideoUrl();
    if (!videoUrl) return;

    setIsLoading(true);

    // Check if it's an HLS stream
    if (videoUrl.includes(".m3u8")) {
      if (Hls.isSupported()) {
        hlsRef.current = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hlsRef.current.loadSource(videoUrl);
        hlsRef.current.attachMedia(video);
        hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false);
          video.play().catch(() => setIsPlaying(false));
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoUrl;
        video.addEventListener("loadedmetadata", () => {
          setIsLoading(false);
          video.play().catch(() => setIsPlaying(false));
        });
      }
    } else {
      // MP4
      video.src = videoUrl;
      video.addEventListener("loadeddata", () => {
        setIsLoading(false);
        video.play().catch(() => setIsPlaying(false));
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [currentEpisode, getVideoUrl]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };
    const handleDurationChange = () => setDuration(video.duration);
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleEnded = () => {
      if (currentIndex < episodes.length - 1) {
        onEpisodeChange(currentIndex + 1);
      }
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("ended", handleEnded);
    };
  }, [currentIndex, episodes.length, onEpisodeChange]);

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Auto-hide controls
  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    if (isPlaying && !showEpisodeList) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying, showEpisodeList]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Fallback for WebView
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skipForward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
  };

  const skipBackward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
  };

  const goToNextEpisode = () => {
    if (currentIndex < episodes.length - 1) {
      onEpisodeChange(currentIndex + 1);
    }
  };

  const goToPrevEpisode = () => {
    if (currentIndex > 0) {
      onEpisodeChange(currentIndex - 1);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative bg-black ${isFullscreen ? "video-fullscreen" : "aspect-video w-full"}`}
      onClick={resetControlsTimeout}
      onTouchStart={resetControlsTimeout}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        autoPlay
        poster={currentEpisode?.chapterImg}
      />

      {/* Loading spinner */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/50"
          >
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col justify-between"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-3">
                {onClose && (
                  <button onClick={onClose} className="touch-button">
                    <X className="w-6 h-6 text-foreground" />
                  </button>
                )}
                <div>
                  <p className="text-foreground font-semibold text-sm line-clamp-1">
                    {dramaName}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {currentEpisode?.chapterName || `Episode ${currentIndex + 1}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEpisodeList(!showEpisodeList)}
                className="touch-button"
              >
                <List className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Center controls */}
            <div className="flex items-center justify-center gap-8">
              <button
                onClick={goToPrevEpisode}
                disabled={currentIndex === 0}
                className="touch-button opacity-80 disabled:opacity-30"
              >
                <SkipBack className="w-8 h-8 text-foreground" />
              </button>

              <button
                onClick={skipBackward}
                className="touch-button opacity-80"
              >
                <div className="relative">
                  <SkipBack className="w-10 h-10 text-foreground" />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                    10
                  </span>
                </div>
              </button>

              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center touch-button"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-primary-foreground" />
                ) : (
                  <Play className="w-8 h-8 text-primary-foreground ml-1" />
                )}
              </button>

              <button onClick={skipForward} className="touch-button opacity-80">
                <div className="relative">
                  <SkipForward className="w-10 h-10 text-foreground" />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                    10
                  </span>
                </div>
              </button>

              <button
                onClick={goToNextEpisode}
                disabled={currentIndex >= episodes.length - 1}
                className="touch-button opacity-80 disabled:opacity-30"
              >
                <SkipForward className="w-8 h-8 text-foreground" />
              </button>
            </div>

            {/* Bottom controls */}
            <div className="p-4 bg-gradient-to-t from-black/80 to-transparent">
              {/* Progress bar */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-foreground w-12">
                  {formatDuration(currentTime * 1000)}
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress || 0}
                  onChange={handleSeek}
                  className="flex-1 h-1 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                  style={{
                    background: `linear-gradient(to right, hsl(var(--primary)) ${progress}%, hsl(var(--muted)) ${progress}%)`,
                  }}
                />
                <span className="text-xs text-foreground w-12 text-right">
                  {formatDuration(duration * 1000)}
                </span>
              </div>

              {/* Bottom buttons */}
              <div className="flex items-center justify-between">
                <button onClick={toggleMute} className="touch-button">
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-foreground" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-foreground" />
                  )}
                </button>

                <button onClick={toggleFullscreen} className="touch-button">
                  {isFullscreen ? (
                    <Minimize className="w-5 h-5 text-foreground" />
                  ) : (
                    <Maximize className="w-5 h-5 text-foreground" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Episode list overlay */}
      <AnimatePresence>
        {showEpisodeList && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute top-0 right-0 bottom-0 w-72 bg-background/95 backdrop-blur-xl border-l border-border overflow-y-auto"
          >
            <div className="sticky top-0 p-4 bg-background border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-foreground">Daftar Episode</h3>
              <button
                onClick={() => setShowEpisodeList(false)}
                className="touch-button"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-2">
              {episodes.map((ep, idx) => (
                <button
                  key={ep.chapterId}
                  onClick={() => {
                    onEpisodeChange(idx);
                    setShowEpisodeList(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    idx === currentIndex
                      ? "bg-primary/20 border border-primary/50"
                      : "hover:bg-card active:bg-card"
                  }`}
                >
                  <div className="relative w-20 h-12 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={ep.chapterImg}
                      alt={ep.chapterName}
                      className="w-full h-full object-cover"
                    />
                    {idx === currentIndex && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Play className="w-4 h-4 text-primary fill-primary" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p
                      className={`text-sm font-medium ${
                        idx === currentIndex ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {ep.chapterName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ep.chargeChapter ? "VIP" : "Gratis"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
