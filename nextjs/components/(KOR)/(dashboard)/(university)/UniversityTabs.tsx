"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

// TODO: 탭 선택에 따라서 UniversitySection에서 표시되는 화면 변경
interface Tab {
  id: string;
  label: string;
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: Tab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, tabs, activeTab, onTabChange, ...props }, ref) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [activeIndex, setActiveIndex] = useState(() => {
      if (activeTab) {
        const index = tabs.findIndex((tab) => tab.id === activeTab);
        return index !== -1 ? index : 0;
      }
      return 0;
    });
    const [hoverStyle, setHoverStyle] = useState({});
    const [activeStyle, setActiveStyle] = useState({
      left: "0px",
      width: "0px",
    });
    const [isDark, setIsDark] = useState(false);
    const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Theme 감지
    useEffect(() => {
      const checkTheme = () => {
        setIsDark(document.documentElement.classList.contains("dark"));
      };

      checkTheme();

      // MutationObserver로 테마 변경 감지
      const observer = new MutationObserver(checkTheme);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      return () => observer.disconnect();
    }, []);

    useEffect(() => {
      if (hoveredIndex !== null) {
        const hoveredElement = tabRefs.current[hoveredIndex];
        if (hoveredElement) {
          const { offsetLeft, offsetWidth } = hoveredElement;
          setHoverStyle({
            left: `${offsetLeft}px`,
            width: `${offsetWidth}px`,
          });
        }
      }
    }, [hoveredIndex]);

    useEffect(() => {
      const activeElement = tabRefs.current[activeIndex];
      if (activeElement) {
        const { offsetLeft, offsetWidth } = activeElement;
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    }, [activeIndex]);

    useEffect(() => {
      requestAnimationFrame(() => {
        const firstElement = tabRefs.current[0];
        if (firstElement) {
          const { offsetLeft, offsetWidth } = firstElement;
          setActiveStyle({
            left: `${offsetLeft}px`,
            width: `${offsetWidth}px`,
          });
        }
      });
    }, []);

    // 테마에 따른 neon glow 스타일 (은은한 효과)
    const getNeonGlowStyle = () => {
      if (isDark) {
        return {
          boxShadow: `
            0px 0px 2px 0px rgba(34, 197, 94, 0.5),
            0px 0px 4px 0px rgba(34, 197, 94, 0.3),
            0px 0px 8px 0px rgba(34, 197, 94, 0.2)
          `,
        };
      } else {
        return {
          boxShadow: `
            0px 0px 2px 0px rgba(147, 51, 234, 0.5),
            0px 0px 4px 0px rgba(147, 51, 234, 0.3),
            0px 0px 8px 0px rgba(147, 51, 234, 0.2)
          `,
        };
      }
    };

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        <div className="relative">
          {/* Hover Highlight */}
          <div
            className="absolute h-[30px] transition-all duration-300 ease-out bg-[#0e0f1114] dark:bg-[#ffffff1a] rounded-[6px] flex items-center"
            style={{
              ...hoverStyle,
              opacity: hoveredIndex !== null ? 1 : 0,
            }}
          />

          {/* Active Indicator - 형광바 스타일 (고정) */}
          <div
            className="absolute bottom-[-9px] h-[2px] rounded-full transition-all duration-300 ease-out 
             bg-secondary dark:bg-primary"
            style={{
              ...activeStyle,
              ...getNeonGlowStyle(),
            }}
          />

          {/* Hover Indicator - 연한 색 (hover시에만 표시) */}
          <div
            className="absolute bottom-[-9px] h-[2px] rounded-full transition-all duration-300 ease-out 
             bg-secondary/40 dark:bg-primary/40"
            style={{
              ...hoverStyle,
              opacity:
                hoveredIndex !== null && hoveredIndex !== activeIndex ? 1 : 0,
            }}
          />

          {/* Tabs */}
          <div className="relative flex space-x-[6px] items-center">
            {tabs.map((tab, index) => (
              <div
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                className={cn(
                  "px-3 py-2 cursor-pointer transition-colors duration-300 h-[30px]",
                  index === activeIndex
                    ? "text-[#0e0e10] dark:text-white"
                    : "text-[#0e0f1199] dark:text-[#ffffff99]"
                )}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => {
                  setActiveIndex(index);
                  onTabChange?.(tab.id);
                }}
              >
                <div className="font-medium text-[14px] text-base-primary leading-5 whitespace-nowrap flex items-center justify-center h-full">
                  {tab.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);
Tabs.displayName = "Tabs";

export { Tabs };
