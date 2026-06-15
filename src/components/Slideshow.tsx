"use client";

import Image from "next/image";
import {
  type TouchEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SlideshowSlide = {
  kind: "raster" | "svg" | "file";
  url: string;
  width?: number | null;
  height?: number | null;
  alt?: string | null;
  title?: string | null;
  caption?: string | null;
};

const defaultFrameAspectRatio = 4 / 3;
const minFrameAspectRatio = 1;
const maxFrameAspectRatio = 16 / 9;
const maxSlideshowFrameHeight = 660;
const minSlideshowWidth = 640;
const maxSlideshowWidth = 1024;

function shouldIgnoreSlideshowKeydown(event: KeyboardEvent) {
  const target = event.target;

  return (
    event.defaultPrevented ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    (target instanceof HTMLElement &&
      (target.isContentEditable ||
        target.tagName === "INPUT" ||
        target.tagName === "SELECT" ||
        target.tagName === "TEXTAREA"))
  );
}

function getSlideAspectRatio({ width, height }: SlideshowSlide) {
  if (!width || !height) {
    return null;
  }

  const aspectRatio = width / height;

  return Number.isFinite(aspectRatio) && aspectRatio > 0 ? aspectRatio : null;
}

function getMedianAspectRatio(slides: SlideshowSlide[]) {
  const aspectRatios = slides
    .map(getSlideAspectRatio)
    .filter((aspectRatio): aspectRatio is number => aspectRatio !== null)
    .sort((first, second) => first - second);

  return (
    aspectRatios[Math.floor((aspectRatios.length - 1) / 2)] ??
    defaultFrameAspectRatio
  );
}

function getSlideshowLayout(slides: SlideshowSlide[]) {
  const aspectRatio = Math.min(
    maxFrameAspectRatio,
    Math.max(minFrameAspectRatio, getMedianAspectRatio(slides)),
  );
  const preferredMaxWidth = Math.min(
    maxSlideshowWidth,
    Math.round(maxSlideshowFrameHeight * aspectRatio),
  );
  const minWidth = Math.min(minSlideshowWidth, preferredMaxWidth);

  return {
    aspectRatio,
    maxWidth: Math.max(minWidth, preferredMaxWidth),
  };
}

function getAdjacentSlideIndexes({
  activeIndex,
  slides,
}: {
  activeIndex: number;
  slides: SlideshowSlide[];
}) {
  if (slides.length < 2) {
    return [];
  }

  return slides.length === 2
    ? [activeIndex === 0 ? 1 : 0]
    : [
        activeIndex === 0 ? slides.length - 1 : activeIndex - 1,
        activeIndex === slides.length - 1 ? 0 : activeIndex + 1,
      ];
}

export function Slideshow({
  ariaLabel,
  slides,
}: {
  ariaLabel: string;
  slides: SlideshowSlide[];
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeIndex = Math.min(selectedIndex, Math.max(0, slides.length - 1));
  const activeSlide = slides[activeIndex] ?? slides[0];
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const thumbnailStripRef = useRef<HTMLDivElement | null>(null);
  const thumbnailButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hasMultipleSlides = slides.length > 1;
  const slideshowLayout = getSlideshowLayout(slides);
  const adjacentSlideIndexes = getAdjacentSlideIndexes({
    activeIndex,
    slides,
  });
  const hasCaption = Boolean(activeSlide?.title || activeSlide?.caption);

  const showSlide = useCallback(
    (nextIndex: number) => {
      const normalizedIndex = Math.min(
        Math.max(0, nextIndex),
        Math.max(0, slides.length - 1),
      );

      if (normalizedIndex === activeIndex) {
        return;
      }

      setSelectedIndex(normalizedIndex);
    },
    [activeIndex, slides.length],
  );

  const showPrevious = useCallback(() => {
    showSlide(activeIndex === 0 ? slides.length - 1 : activeIndex - 1);
  }, [activeIndex, showSlide, slides.length]);

  const showNext = useCallback(() => {
    showSlide(activeIndex === slides.length - 1 ? 0 : activeIndex + 1);
  }, [activeIndex, showSlide, slides.length]);

  useEffect(() => {
    const strip = thumbnailStripRef.current;
    const thumbnail = thumbnailButtonRefs.current[activeIndex];

    if (!strip || !thumbnail) {
      return;
    }

    const stripRect = strip.getBoundingClientRect();
    const thumbnailRect = thumbnail.getBoundingClientRect();
    const thumbnailLeft =
      thumbnailRect.left - stripRect.left + strip.scrollLeft;
    const thumbnailRight = thumbnailLeft + thumbnailRect.width;
    const visibleLeft = strip.scrollLeft;
    const visibleRight = visibleLeft + strip.clientWidth;

    if (thumbnailLeft >= visibleLeft && thumbnailRight <= visibleRight) {
      return;
    }

    const targetLeft =
      thumbnailLeft - (strip.clientWidth - thumbnailRect.width) / 2;
    const maxScrollLeft = strip.scrollWidth - strip.clientWidth;
    strip.scrollTo({
      left: Math.max(0, Math.min(targetLeft, maxScrollLeft)),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, [activeIndex]);

  useEffect(() => {
    if (!hasMultipleSlides) {
      return;
    }

    function handleKeydown(event: KeyboardEvent) {
      if (shouldIgnoreSlideshowKeydown(event)) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPrevious();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showNext();
      }
    }

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [hasMultipleSlides, showNext, showPrevious]);

  if (!activeSlide) {
    return null;
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    const touch = event.touches[0];

    if (!touch || !hasMultipleSlides) {
      return;
    }

    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const start = touchStart.current;
    const touch = event.changedTouches[0];
    touchStart.current = null;

    if (!start || !touch || !hasMultipleSlides) {
      return;
    }

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) {
      return;
    }

    if (deltaX > 0) {
      showNext();
    } else {
      showPrevious();
    }
  }

  return (
    <figure
      aria-label={ariaLabel}
      className="border-border/45 bg-card/75 mx-auto grid w-full overflow-hidden rounded-md border shadow-sm"
      style={{ maxWidth: slideshowLayout.maxWidth }}
    >
      <div
        className="relative touch-pan-y overflow-hidden bg-gray-100"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="relative w-full"
          style={{ aspectRatio: slideshowLayout.aspectRatio }}
        >
          <Image
            src={activeSlide.url}
            alt={activeSlide.alt || activeSlide.title || ""}
            fill
            className="object-contain"
            sizes={`(min-width: 1024px) ${slideshowLayout.maxWidth}px, calc(100vw - 2rem)`}
            unoptimized={activeSlide.kind === "svg"}
          />
          {adjacentSlideIndexes.map((index) => {
            const slide = slides[index];

            return (
              <Image
                key={`${slide.url}-${index}`}
                src={slide.url}
                alt=""
                aria-hidden="true"
                fill
                className="pointer-events-none opacity-0"
                loading="eager"
                fetchPriority="low"
                sizes={`(min-width: 1024px) ${slideshowLayout.maxWidth}px, calc(100vw - 2rem)`}
                unoptimized={slide.kind === "svg"}
              />
            );
          })}
        </div>
        {hasMultipleSlides ? (
          <>
            <div className="absolute top-3 right-3 rounded-full bg-black/45 px-2.5 py-1 text-[0.7rem] font-medium text-white/85">
              {activeIndex + 1} / {slides.length}
            </div>
            <div className="absolute inset-y-0 right-3 left-3 hidden items-center justify-between sm:flex">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                aria-label="Previous image"
                className="bg-background/50 text-foreground/85 hover:bg-background/75 shadow-sm"
                onClick={showPrevious}
              >
                <ChevronLeft className="size-5" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                aria-label="Next image"
                className="bg-background/50 text-foreground/85 hover:bg-background/75 shadow-sm"
                onClick={showNext}
              >
                <ChevronRight className="size-5" />
              </Button>
            </div>
          </>
        ) : null}
      </div>
      {hasMultipleSlides || hasCaption ? (
        <figcaption className="grid min-w-0 gap-3 p-3 md:p-4">
          {hasMultipleSlides ? (
            <div
              ref={thumbnailStripRef}
              className="flex gap-2 overflow-x-auto pb-1"
            >
              {slides.map((slide, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    type="button"
                    key={`${slide.url}-${index}`}
                    ref={(element) => {
                      thumbnailButtonRefs.current[index] = element;
                    }}
                    aria-label={`Show ${slide.title || slide.alt || "image"}`}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "focus-visible:ring-ring relative size-16 flex-none overflow-hidden rounded-md border bg-gray-100 transition outline-none focus-visible:ring-3 sm:size-20",
                      isActive
                        ? "border-primary ring-primary/35 ring-2"
                        : "border-border/60 opacity-75 hover:opacity-100",
                    )}
                    onClick={() => showSlide(index)}
                  >
                    <Image
                      src={slide.url}
                      alt=""
                      fill
                      className="object-contain p-1"
                      loading="eager"
                      sizes="(min-width: 640px) 80px, 64px"
                      unoptimized={slide.kind === "svg"}
                    />
                  </button>
                );
              })}
            </div>
          ) : null}
          {hasCaption ? (
            <div>
              {activeSlide.title ? (
                <h2 className="text-xl leading-tight">{activeSlide.title}</h2>
              ) : null}
              {activeSlide.caption ? (
                <p
                  className={cn(
                    "text-muted-foreground text-sm leading-6",
                    activeSlide.title ? "mt-2" : undefined,
                  )}
                >
                  {activeSlide.caption}
                </p>
              ) : null}
            </div>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
