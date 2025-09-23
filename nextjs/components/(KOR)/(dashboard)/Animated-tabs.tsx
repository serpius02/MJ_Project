"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";

export interface AnimatedTabsProps {
  tabs: { label: string; value: string }[];
  onTabChange?: (value: string) => void;
  defaultValue?: string;
}

// TODO: 탭 리스트 수정
export function AnimatedTabs({
  tabs,
  onTabChange,
  defaultValue,
}: AnimatedTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0].value);
  const sliderRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onTabChange?.(value);
  };

  // 슬라이더 위치 업데이트
  useEffect(() => {
    const updateSlider = () => {
      const activeIndex = tabs.findIndex((tab) => tab.value === activeTab);
      const activeTabElement = tabRefs.current[activeIndex];
      const slider = sliderRef.current;

      if (activeTabElement && slider) {
        const { offsetLeft, offsetWidth } = activeTabElement;
        const margin = 2;

        slider.style.transform = `translateX(${offsetLeft + margin}px)`;
        slider.style.width = `${offsetWidth - margin * 2}px`;
      }
    };

    const timer = setTimeout(updateSlider, 50);
    return () => clearTimeout(timer);
  }, [activeTab, tabs]);

  // 탭 버튼 수를 늘리면 w-[237px] 대신 다른 수를 넣어주면 됨
  return (
    <div className="relative bg-background border border-border flex items-center rounded-full p-0.5 w-[237px]">
      {/* 애니메이션 슬라이더 - 강화된 대비 효과 */}
      <div
        ref={sliderRef}
        className="absolute rounded-full transition-all duration-300 ease-out border border-secondary/40 dark:border-primary/40"
        style={{
          height: "32px",
          top: "2px",
          left: "0px",
          backgroundColor: `var(--card)`,
          boxShadow:
            "0 4px 12px rgba(0, 0, 0, 0.25), 0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      />

      {/* 탭 버튼들 */}
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.value;

        return (
          <button
            key={tab.value}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            onClick={() => handleTabChange(tab.value)}
            className={`relative z-10 h-8 px-4 text-[12px] font-medium rounded-full transition-all duration-200 flex items-center justify-center flex-shrink-0 whitespace-nowrap ${
              isActive
                ? "text-secondary dark:text-primary font-semibold"
                : "text-base-secondary hover:text-base-primary"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
