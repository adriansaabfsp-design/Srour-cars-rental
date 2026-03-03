"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { CarPhotos } from "@/lib/types";

const PHOTO_LABELS: { key: keyof CarPhotos; label: string }[] = [
  { key: "main", label: "Main Photo" },
  { key: "front", label: "Front View" },
  { key: "back", label: "Back View" },
  { key: "left", label: "Left Side" },
  { key: "right", label: "Right Side" },
];

interface ImageGalleryProps {
  photos?: CarPhotos;
  images?: string[];
  alt: string;
  videoUrl?: string;
  onPlayVideo?: () => void;
}

type GalleryItem = {
  type: "image" | "video";
  url: string;
  label: string;
  thumb: string;
};

function getYouTubeId(url: string): string | null {
  const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[1].length === 11 ? match[1] : null;
}

export default function ImageGallery({ photos, images, alt, videoUrl, onPlayVideo }: ImageGalleryProps) {
  // Build ordered image list from photos or fallback to images
  const imageList = (() => {
    if (photos && Object.values(photos).some(Boolean)) {
      return PHOTO_LABELS
        .filter((p) => photos[p.key])
        .map((p) => ({ type: "image" as const, url: photos[p.key]!, label: p.label, thumb: photos[p.key]! }));
    }
    if (images && images.length > 0) {
      const labels = ["Main Photo", "Front View", "Back View", "Left Side", "Right Side"];
      return images.map((url, i) => ({ type: "image" as const, url, label: labels[i] || `Photo ${i + 1}`, thumb: url }));
    }
    return [];
  })();

  const galleryItems: GalleryItem[] = (() => {
    if (!videoUrl) return imageList;

    const youtubeId = getYouTubeId(videoUrl);
    const videoThumb = youtubeId
      ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
      : imageList[0]?.url || "";

    const videoItem: GalleryItem = {
      type: "video",
      url: videoUrl,
      label: "Video",
      thumb: videoThumb,
    };

    if (imageList.length === 0) return [videoItem];

    return [imageList[0], videoItem, ...imageList.slice(1)];
  })();

  const [selected, setSelected] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  // Preload adjacent images
  useEffect(() => {
    if (galleryItems.length <= 1) return;
    const preloadIndexes = [
      (selected + 1) % galleryItems.length,
      (selected - 1 + galleryItems.length) % galleryItems.length,
    ];
    preloadIndexes.forEach((idx) => {
      if (galleryItems[idx].thumb) {
        const img = new Image();
        img.src = galleryItems[idx].thumb;
      }
    });
  }, [selected, galleryItems]);

  // Scroll thumbnail into view
  useEffect(() => {
    if (thumbnailRef.current) {
      const thumbs = thumbnailRef.current.children;
      if (thumbs[selected]) {
        (thumbs[selected] as HTMLElement).scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [selected]);

  const navigate = useCallback(
    (newIndex: number, dir: "left" | "right") => {
      if (isAnimating || newIndex === selected) return;
      setDirection(dir);
      setIsAnimating(true);
      setDisplayIndex(newIndex);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setSelected(newIndex);
        setIsAnimating(false);
      }, 400);
    },
    [isAnimating, selected]
  );

  const goPrev = useCallback(() => {
    const newIdx = selected === 0 ? galleryItems.length - 1 : selected - 1;
    navigate(newIdx, "left");
  }, [selected, galleryItems.length, navigate]);

  const goNext = useCallback(() => {
    const newIdx = selected === galleryItems.length - 1 ? 0 : selected + 1;
    navigate(newIdx, "right");
  }, [selected, galleryItems.length, navigate]);

  // Swipe support for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Only trigger if horizontal swipe is dominant and long enough
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) goNext();
      else goPrev();
    }
  }, [goNext, goPrev]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goPrev, goNext]);

  if (galleryItems.length === 0) {
    return (
      <div className="flex aspect-[16/10] w-full items-center justify-center border border-luxury-border bg-luxury-card text-gray-900/10">
        <svg className="h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
        </svg>
      </div>
    );
  }

  // Thumbnails after main slot (index 0)
  const angleThumbnails = galleryItems.length > 1 ? galleryItems.slice(1) : [];
  const currentItem = galleryItems[selected];
  const displayItem = galleryItems[displayIndex];

  return (
    <div>
      {/* Main Hero Image */}
      <div
        ref={heroRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative aspect-[16/10] w-full overflow-hidden border border-luxury-border bg-white"
      >
        {/* Current image */}
        <img
          src={currentItem.thumb || currentItem.url}
          alt={`${alt} - ${currentItem.label}`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Incoming image during animation */}
        {isAnimating && (
          <img
            src={displayItem.thumb || displayItem.url}
            alt={`${alt} - ${displayItem.label}`}
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              animation: `${direction === "right" ? "gallerySlideInRight" : "gallerySlideInLeft"} 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
            }}
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

        {/* Video play button overlay (only on video slot) */}
        {currentItem.type === "video" && onPlayVideo && (
          <button
            onClick={onPlayVideo}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 group"
          >
            <div className="flex h-20 w-20 items-center justify-center border-2 border-white/30 bg-black/60 backdrop-blur-sm transition-all duration-300 group-hover:border-navy group-hover:bg-black/80 group-hover:scale-110">
              <svg className="h-8 w-8 text-white ml-1 transition-colors group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="mt-2 block text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 group-hover:text-white transition-colors">
              Play Video
            </span>
          </button>
        )}

        {/* Arrow navigation — desktop only */}
        {galleryItems.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 border border-white/10 bg-black/70 p-3 backdrop-blur-sm transition-all hover:border-navy/30 hover:bg-black/90 hidden sm:block"
            >
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 border border-white/10 bg-black/70 p-3 backdrop-blur-sm transition-all hover:border-navy/30 hover:bg-black/90 hidden sm:block"
            >
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Counter */}
            <div className="absolute bottom-3 right-3 z-10 bg-black/80 px-3 py-1 text-xs font-bold text-white/60">
              {(isAnimating ? displayIndex : selected) + 1} / {galleryItems.length}
            </div>

            {/* Swipe hint — mobile only, fades after first interaction */}
            <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 bg-black/60 px-2.5 py-1 backdrop-blur-sm sm:hidden">
              <svg className="h-3 w-3 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span className="text-[9px] font-bold uppercase tracking-wider text-white/50">Swipe</span>
            </div>
          </>
        )}
      </div>

      {/* Angle photo thumbnails — 4 columns below the hero */}
      {angleThumbnails.length > 0 && (
        <div ref={thumbnailRef} className="mt-3 grid grid-cols-4 gap-2">
          {angleThumbnails.map((photo, i) => {
            const actualIndex = i + 1; // offset by 1 since main is index 0
            const isActive = selected === actualIndex;
            return (
              <button
                key={photo.label}
                onClick={() => navigate(actualIndex, actualIndex > selected ? "right" : "left")}
                className={`group relative aspect-[4/3] overflow-hidden border transition-all duration-300 ${
                  isActive
                    ? "border-navy opacity-100 navy-glow"
                    : "border-luxury-border opacity-50 hover:opacity-80"
                }`}
              >
                <img src={photo.thumb || photo.url} alt={`${alt} - ${photo.label}`} className="h-full w-full object-cover" />
                {photo.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <svg className="h-8 w-8 text-white/90" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* CSS animations */}
      <style jsx>{`
        @keyframes gallerySlideInRight {
          from { transform: translateX(100%); opacity: 0.5; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes gallerySlideInLeft {
          from { transform: translateX(-100%); opacity: 0.5; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
