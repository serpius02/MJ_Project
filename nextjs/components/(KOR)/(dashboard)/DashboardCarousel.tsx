"use client";

import React, { useCallback, useState, useEffect } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
import { DashboardCarouselContents } from "./DashboardCarouselContents";
import { DashboardCardData } from "@/types/dashboard";

const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(0);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowWidth;
};

interface DashboardCarouselProps {
  slides: DashboardCardData[];
}

function getCardStyle(
  index: number,
  activeIndex: number,
  totalSlides: number,
  screenWidth: number
): React.CSSProperties {
  let offset = index - activeIndex;
  const half = Math.floor(totalSlides / 2);
  if (offset > half) offset -= totalSlides;
  if (offset < -half) offset += totalSlides;

  // TODO: 여기 responsive하게 만들어야 함. 일단 나중에
  // 한 번에 보이는 카드 개수 7개
  const isVisible = Math.abs(offset) <= 3;

  // 화면이 1920px보다 작을 때 (모바일: 단일 카드)
  if (screenWidth < 2000) {
    return {
      transform: `translateX(0) scale(${offset === 0 ? 1 : 0.8})`,
      zIndex: offset === 0 ? 1 : 0,
      opacity: offset === 0 ? 1 : 0,
      transition: "all 0.4s ease-out",
    };
  }

  // 데스크톱: 다중 카드 (사용자 설정값 기반)
  const scale = 1 - Math.abs(offset) * 0.1;
  const translateX = offset * 25; // 카드를 자신의 너비의 40%만큼 밀어냅니다.
  const rotateY = offset * -30;
  const translateY = Math.abs(offset) * 1; // 수직 위치 보정
  const zIndex = totalSlides - Math.abs(offset);

  return {
    transform: `translateX(${translateX}%) translateY(${translateY}%) scale(${scale}) rotateY(${rotateY}deg)`,
    zIndex,
    opacity: isVisible ? 1 : 0,
    transition: "all 0.4s ease-out",
  };
}

const DashboardCarousel = ({ slides }: DashboardCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalSlides = slides.length;
  const screenWidth = useWindowWidth();
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalSlides, isPaused]);

  const handlePrev = useCallback(
    () => setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides),
    [totalSlides]
  );
  const handleNext = useCallback(
    () => setActiveIndex((prev) => (prev + 1) % totalSlides),
    [totalSlides]
  );

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setDragging(true);
    if ("touches" in e) {
      setDragStartX(e.touches[0].clientX);
    } else {
      setDragStartX(e.clientX);
    }
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging || dragStartX === null) return;
    let clientX;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    const diff = clientX - dragStartX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handlePrev();
      else handleNext();
      setDragging(false);
      setDragStartX(null);
    }
  };

  const handleDragEnd = () => {
    setDragging(false);
    setDragStartX(null);
  };

  return (
    <div className="relative group w-full">
      <div
        className="relative flex items-center justify-center w-full h-[180px] sm:h-[200px] md:h-[250px] lg:h-[300px] py-6 sm:py-4 md:py-2 lg:py-0"
        style={{ perspective: "1500px" }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {slides.map((item, index) => (
          <div
            key={item.id}
            className="absolute"
            style={getCardStyle(index, activeIndex, totalSlides, screenWidth)}
          >
            <DashboardCarouselContents {...item} />
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      {/* TODO: Pagination dot 개수를 나중에 실제 데이터 개수와 일치시켜야 */}
      <div className="flex justify-center mt-4 sm:mt-14 gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`
              w-3 h-3 rounded-full
              transition-all duration-200
              ${
                activeIndex === idx
                  ? "bg-secondary/80 dark:bg-primary/80 scale-110 shadow"
                  : "bg-muted/60 hover:bg-secondary/40 dark:bg-muted/60 dark:hover:bg-primary/40"
              }
            `}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardCarousel;
