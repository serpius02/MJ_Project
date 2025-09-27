import React from "react";

import Link from "next/link";
import Image from "next/image";
import { TrendingNewsItemProps } from "@/types/dashboard";
import { ChevronRight } from "lucide-react";

// TODO: 추가 스타일링 (카테고리, 날짜)
interface Props {
  item: TrendingNewsItemProps;
  className?: string; // 외부에서 추가적인 스타일링을 위한 className prop
}

const TrendingNewsCard = ({ item, className }: Props) => {
  return (
    <div
      className={`group block rounded-xl overflow-hidden bg-card shadow-lg ${className || ""}`}
    >
      {/* 고정 비율로 분할 */}
      <div className="flex flex-col h-full">
        {/* 이미지 영역 - 고정 비율 (40%) */}
        <div className="relative h-[40%] min-h-[8rem] overflow-hidden">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="absolute h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* 텍스트 영역 - 고정 비율 (60%) */}
        <div className="h-[60%] p-4 bg-card flex flex-col justify-between">
          <div>
            <div className="mb-2 font-semibold text-[16px] text-base-primary line-clamp-1">
              {item.title}
            </div>
            <div className="mb-3 text-[14px] text-base-secondary line-clamp-2">
              {item.description}
            </div>
          </div>

          {/* 하단 영역: 왼쪽에 날짜, 오른쪽에 더보기 */}
          <div className="flex justify-between items-center">
            <div className="text-[12px] text-base-secondary">
              {new Date(item.publishedAt).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>

            <Link
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-[12px] text-secondary dark:text-primary hover:text-secondary/80 dark:hover:text-primary/80 transition-colors w-fit"
            >
              더보기
              <ChevronRight className="size-3 relative transition-transform duration-200 group-hover:scale-120" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingNewsCard;
