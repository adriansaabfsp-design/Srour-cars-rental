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

export default function ImageGallery({ photos, images, alt, videoUrl, onPlayVideo }: ImageGalleryProps) {
  // Build ordered list of { url, label } from photos or fallback to images
  const photoList = (() => {
    if (photos && Object.values(photos).some(Boolean)) {
      return PHOTO_LABELS
        .filter((p) => photos[p.key])
        .map((p) => ({ url: photos[p.key]!, label: p.label }));
    }
    if (images && images.length > 0) {
      const labels = ["Main Photo", "Front View", "Back View", "Left Side", "Right Side"];
      return images.map((url, i) => ({ url, label: labels[i] || `Photo ${i + 1}` }));
    }
    return [];
  })();

  const [selected, setSelected] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const thumbnailRef = useRef<HTMLDivElement>(null);

  // Preload adjacent images
  useEffect(() => {
    if (photoList.length <= 1) return;
    const preloadIndexes = [
      (selected + 1) % photoList.length,
      (selected - 1 + photoList.length) % photoList.length,
    ];
    preloadIndexes.forEach((idx) => {
      const img = new Image();
      img.src = photoList[idx].url;
    });
  }, [selected, photoList]);

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
    const newIdx = selected === 0 ? photoList.length - 1 : selected - 1;
    navigate(newIdx, "left");
  }, [selected, photoList.length, navigate]);

  const goNext = useCallback(() => {
    const newIdx = selected === photoList.length - 1 ? 0 : selected + 1;
    navigate(newIdx, "right");
  }, [selected, photoList.length, navigate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goPrev, goNext]);

  if (photoList.length === 0) {
    return (
      <div className="flex aspect-[16/10] w-full items-center justify-center border border-luxury-border bg-luxury-card text-white/10">
        <svg className="h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
        </svg>
      </div>
    );
  }

  // Separate the angle thumbnails (everything after index 0)
  const angleThumbnails = photoList.length > 1 ? photoList.slice(1) : [];

  return (
    <div>
      {/* Main Hero Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden border border-luxury-border bg-black">
        {/* Current image */}
        <img
          src={photoList[selected].url}
          alt={`${alt} - ${photoList[selected].label}`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Incoming image during animation */}
        {isAnimating && (
          <img
            src={photoList[displayIndex].url}
            alt={`${alt} - ${photoList[displayIndex].label}`}
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              animation: `${direction === "right" ? "gallerySlideInRight" : "gallerySlideInLeft"} 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
            }}
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

        {/* Video play button overlay */}
        {videoUrl && onPlayVideo && (
          <button
            onClick={onPlayVideo}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 group"
          >
            <div className="flex h-20 w-20 items-center justify-center border-2 border-white/30 bg-black/60 backdrop-blur-sm transition-all duration-300 group-hover:border-terra group-hover:bg-black/80 group-hover:scale-110">
              <svg className="h-8 w-8 text-white ml-1 transition-colors group-hover:text-terra" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="mt-2 block text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 group-hover:text-terra transition-colors">
              Play Video
            </span>
          </button>
        )}

        {/* Arrow navigation */}
        {photoList.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 border border-white/10 bg-black/70 p-3 backdrop-blur-sm transition-all hover:border-terra/30 hover:bg-black/90"
            >
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 border border-white/10 bg-black/70 p-3 backdrop-blur-sm transition-all hover:border-terra/30 hover:bg-black/90"
            >
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Counter */}
            <div className="absolute bottom-3 right-3 z-10 bg-black/80 px-3 py-1 text-xs font-bold text-white/60">
              {(isAnimating ? displayIndex : selected) + 1} / {photoList.length}
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
                    ? "border-terra opacity-100 navy-glow"
                    : "border-luxury-border opacity-50 hover:opacity-80"
                }`}
              >
                <img src={photo.url} alt={`${alt} - ${photo.label}`} className="h-full w-full object-cover" />
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
