"use client";

import { useState, useEffect } from "react";
import { ArrowUpToLine } from "lucide-react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // 스크롤 위치 감지
  useEffect(() => {
    const toggleVisibility = () => {
      // 300px 이상 스크롤하면 버튼 표시
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // 상단으로 스크롤
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="absolute right-1 bottom-4 bg-gradient-to-r from-secondary via-secondary to-secondary/90 dark:from-primary dark:via-primary dark:to-primary/90 hover:from-secondary/90 hover:to-secondary dark:hover:from-primary/60 dark:hover:to-primary text-secondary-foreground dark:text-primary-foreground p-3 rounded-full shadow-lg hover:shadow-xl active:shadow-md transition-all duration-300 ease-in-out z-10 border border-secondary/30 dark:border-primary/30 hover:scale-110"
          aria-label="맨 위로 이동"
        >
          <ArrowUpToLine className="w-6 h-6" />
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;
