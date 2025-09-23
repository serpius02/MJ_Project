"use client";

import { useEffect, useRef, useState } from "react";
import NewsList from "./NewsList";
import {
  getFilterCategoryList,
  getNewsByCategory,
} from "@/lib/shared/utils/news";
import { sampleNewsItems } from "./TrendingNewsCarousel";
import { Button } from "@/components/ui/button";
import { NewsFilterCategory } from "@/types/dashboard";
import ScrollToTopButton from "./ScrollToTopButton";

const NewsTab = () => {
  const categories = getFilterCategoryList();
  const [activeTab, setActiveTab] = useState<NewsFilterCategory>("전체");
  const [visibleCount, setVisibleCount] = useState(10);
  const sliderRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const ITEMS_PER_LOAD = 10;

  // 탭 변경 시 표시 개수 리셋
  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue as NewsFilterCategory);
    setVisibleCount(10);
  };

  // 더보기 버튼 클릭 - 10개씩 추가
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_LOAD);
  };

  // 현재 카테고리의 뉴스
  const currentCategoryNews = getNewsByCategory(sampleNewsItems, activeTab);
  const hasMoreNews = currentCategoryNews.length > visibleCount;

  // 슬라이더 위치 업데이트
  useEffect(() => {
    const updateSlider = () => {
      const activeIndex = categories.findIndex(
        (cat) => cat.value === activeTab
      );
      const activeTabElement = tabRefs.current[activeIndex];
      const slider = sliderRef.current;

      if (activeTabElement && slider) {
        const { offsetLeft, offsetWidth } = activeTabElement;
        const margin = 8;

        slider.style.transform = `translateX(${offsetLeft + margin}px)`;
        slider.style.width = `${offsetWidth - margin * 2}px`;
      }
    };

    const timer = setTimeout(updateSlider, 50);
    return () => clearTimeout(timer);
  }, [activeTab, categories]);

  return (
    <div className="flex justify-center w-full mt-10 relative">
      <div className="relative w-full max-w-6xl flex flex-col gap-14">
        {/* 탭 컨테이너 */}
        <div className="relative bg-muted border border-border mx-auto flex items-center rounded-xl p-1">
          {/* 애니메이션 슬라이더 - 강화된 대비 효과 */}
          <div
            ref={sliderRef}
            className="absolute rounded-lg transition-all duration-300 ease-out border border-secondary/40 dark:border-primary/40"
            style={{
              height: "40px",
              top: "4px",
              left: "0px",
              background: `hsl(var(--primary))`,
              boxShadow:
                "0 4px 12px rgba(0, 0, 0, 0.25), 0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          />

          {/* 탭 버튼들 */}
          {categories.map((category, index) => {
            const isActive = activeTab === category.value;

            return (
              <button
                key={category.value}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                onClick={() => handleTabChange(category.value)}
                className={`relative z-10 h-10 px-6 text-[14px] font-medium rounded-lg transition-all duration-200 flex items-center justify-center ${
                  isActive
                    ? "text-secondary dark:text-primary font-semibold"
                    : "text-base-secondary hover:text-base-primary"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        {/* 탭 컨텐츠 */}
        <div className="w-full relative">
          {categories.map((category) => {
            const isActive = activeTab === category.value;
            const categoryNews = getNewsByCategory(
              sampleNewsItems,
              category.value
            );
            const categoryVisibleNews = categoryNews.slice(
              0,
              isActive ? visibleCount : 10
            );

            return (
              <div
                key={category.value}
                className={`w-full transition-all duration-700 ease-out ${
                  isActive
                    ? "opacity-100 z-10 translate-x-0 relative"
                    : "opacity-0 z-0 pointer-events-none translate-x-2 absolute inset-0"
                }`}
              >
                <NewsList items={categoryVisibleNews} />
              </div>
            );
          })}
        </div>

        {/* 더보기 버튼 */}
        {hasMoreNews && (
          <div className="flex justify-center -mt-12">
            <Button
              onClick={handleLoadMore}
              className="w-full py-6 text-[14px] font-medium border border-border bg-muted hover:bg-muted/50 transition-colors text-base-primary shadow-lg"
            >
              더보기
            </Button>
          </div>
        )}
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default NewsTab;
