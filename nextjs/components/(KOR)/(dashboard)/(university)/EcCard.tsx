// src/components/ui/EcCard.tsx (모던 디자인으로 완전 개편)

"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ExtraCurricular } from "@/types/dashboard";

// TODO: 전체 디자인 수정 및 뱃지를 이용한 필터 기능 추가
// TODO: 데이터 연결 및 세부 스타일링

// EcCard 컴포넌트의 props 타입을 정의합니다.
interface EcCardProps {
  // 카드에 표시될 데이터
  extraCurricular: ExtraCurricular;
  // 카드의 위치 (0이 중앙, 양수는 오른쪽, 음수는 왼쪽)
  position: number;
  // 카드의 크기 (px)
  cardSize: number;
  // [추가됨] 부모(캐러셀)의 카드 이동 함수를 받기 위한 prop
  handleMove?: (steps: number) => void;
}

export const EcCard: React.FC<EcCardProps> = ({
  extraCurricular,
  position,
  cardSize,
  handleMove,
}) => {
  // position이 0인지 여부로 중앙 카드인지 판단합니다.
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove?.(position)}
      className={cn(
        "absolute left-1/2 top-1/2 rounded-2xl backdrop-blur-sm transition-all duration-500 ease-in-out overflow-hidden group",
        handleMove && "cursor-pointer",
        isCenter ? "z-20" : "z-10",
        isCenter
          ? "bg-gradient-to-br from-secondary/30 to-secondary/20 dark:from-primary/30 dark:to-primary/20 border-2 border-secondary/40 dark:border-primary/40 shadow-2xl shadow-secondary/20 dark:shadow-primary/20"
          : "bg-background/80 dark:bg-background/60 border border-border hover:bg-background/90 dark:hover:bg-background/70 hover:border-secondary/30 dark:hover:border-primary/30"
      )}
      style={{
        width: cardSize * 1.4,
        height: cardSize * 1.4,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.2) * position}px)
          translateY(${isCenter ? -20 : position % 2 ? 10 : -10}px)
          scale(${isCenter ? 1.05 : 0.95})
          rotate(${isCenter ? 0 : position % 2 ? 1 : -1}deg)
        `,
        backdropFilter: "blur(20px)",
        boxShadow: isCenter
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px hsl(var(--secondary) / 0.2), inset 0 1px 0 0 hsl(var(--secondary) / 0.2)"
          : "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 0 0 1px hsl(var(--border))",
      }}
    >
      {/* 상단 이미지 영역 */}
      <div className="relative h-22 overflow-hidden rounded-t-2xl">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
        <Image
          src={extraCurricular.imageUrl}
          alt={extraCurricular.program}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* 프로그램 태그 */}
        <div className="absolute top-3 left-3 z-20">
          <span className="px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full text-foreground text-xs font-medium border border-border">
            {extraCurricular.format}
          </span>
        </div>
      </div>

      {/* 카드 내용 */}
      <div className="p-4 flex flex-col h-full">
        {/* 기관명 */}
        <h3
          className={cn(
            "text-sm font-semibold mb-2 line-clamp-2",
            isCenter
              ? "text-secondary-foreground dark:text-primary-foreground"
              : "text-foreground"
          )}
        >
          {extraCurricular.institution}
        </h3>

        {/* 프로그램 이름 */}
        <p
          className={cn(
            "text-xs mb-3 line-clamp-2 leading-relaxed",
            isCenter
              ? "text-secondary-foreground/80 dark:text-primary-foreground/80"
              : "text-base-primary"
          )}
        >
          {extraCurricular.program}
        </p>

        {/* 하단 정보 */}
        <div className="mt-auto">
          {/* 가격 */}
          <div className="flex items-center justify-between mb-2">
            <span
              className={cn(
                "text-lg font-bold",
                isCenter
                  ? "text-secondary dark:text-primary"
                  : "text-foreground"
              )}
            >
              {extraCurricular.price}
            </span>
            <span
              className={cn(
                "text-xs px-2 py-1 rounded-full bg-muted/80 backdrop-blur-sm border border-border",
                isCenter
                  ? "text-secondary-foreground dark:text-primary-foreground"
                  : "text-muted-foreground"
              )}
            >
              {extraCurricular.deadline.split("-")[1]}/
              {extraCurricular.deadline.split("-")[2]}
            </span>
          </div>

          {/* 액션 버튼 */}
          {isCenter && (
            <button
              onClick={(e) => e.stopPropagation()}
              className="w-full py-2 bg-secondary/20 hover:bg-secondary/30 dark:bg-primary/20 dark:hover:bg-primary/30 backdrop-blur-sm rounded-lg text-secondary dark:text-primary text-sm font-medium border border-secondary/30 dark:border-primary/30 transition-all duration-200 hover:scale-105"
            >
              자세히 보기
            </button>
          )}
        </div>
      </div>

      {/* 글로우 효과 (중앙 카드만) */}
      {isCenter && (
        <div className="absolute inset-0 bg-secondary/10 dark:bg-primary/10 backdrop-blur-lg rounded-2xl -z-10" />
      )}
    </div>
  );
};
