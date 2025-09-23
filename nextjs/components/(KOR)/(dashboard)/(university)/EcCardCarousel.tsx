"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExtraCurricular } from "@/types/dashboard";
import { EcCard } from "./EcCard";

// TODO: 필터 기능 추가 (추가로 테이블 구조도 수정해야)

// React의 key prop을 위한 임시 ID를 포함하는 타입
type ItemWithTempKey = ExtraCurricular & { tempKey: number };

interface EcCarouselProps {
  // 표시할 비교과 활동 데이터 배열
  items: ExtraCurricular[];
}

export const EcCardCarousel: React.FC<EcCarouselProps> = ({ items }) => {
  const [cardSize, setCardSize] = useState(160);
  const [ecList, setEcList] = useState<ItemWithTempKey[]>([]);

  // props로 받은 items가 변경되면 ecList 상태를 초기화합니다.
  useEffect(() => {
    setEcList(items.map((item) => ({ ...item, tempKey: Math.random() })));
  }, [items]);

  // 화면 크기에 따라 카드 사이즈를 조절하는 로직 (640px 이상이면 matches가 true)
  // 필요하다면 카드 사이즈를 다르게 설정하자
  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 160 : 160);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // 카드를 움직이는 핵심 로직
  const handleMove = (steps: number) => {
    if (steps === 0) return; // 중앙 카드를 클릭하면 아무것도 하지 않음

    const newList = [...ecList];
    if (steps > 0) {
      // 오른쪽 카드를 클릭 -> 왼쪽으로 이동
      for (let i = 0; i < steps; i++) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempKey: Math.random() }); // 애니메이션을 위해 새로운 key 부여
      }
    } else {
      // 왼쪽 카드를 클릭 -> 오른쪽으로 이동
      for (let i = 0; i > steps; i--) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempKey: Math.random() }); // 애니메이션을 위해 새로운 key 부여
      }
    }
    setEcList(newList);
  };

  // 데이터가 없으면 아무것도 렌더링하지 않음
  if (ecList.length === 0) {
    return null;
  }

  return (
    <div
      className="relative w-full overflow-hidden bg-card rounded-lg"
      style={{ height: 350 }}
    >
      {ecList.map((item, index) => {
        // 배열의 인덱스를 기반으로 중앙이 0이 되도록 position을 계산합니다.
        const position = index - Math.floor(ecList.length / 2);

        return (
          <EcCard
            key={item.tempKey} // 상태 업데이트 시 리렌더링을 위한 고유 key
            extraCurricular={item}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}

      {/* 네비게이션 버튼 */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full text-2xl transition-colors",
            "bg-background border-2 border-border hover:bg-primary hover:text-primary-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          aria-label="Previous card"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full text-2xl transition-colors",
            "bg-background border-2 border-border hover:bg-primary hover:text-primary-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          aria-label="Next card"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};
