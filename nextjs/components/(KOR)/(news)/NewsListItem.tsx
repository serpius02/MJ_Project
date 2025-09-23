import React from "react";
import { TrendingNewsItemProps } from "@/types/dashboard";
import Link from "next/link";
import Image from "next/image";
import NewsBadges from "@/components/(KOR)/(news)/NewsBadges";

interface NewsListItemProps {
  item: TrendingNewsItemProps;
}

// TODO: 링크 클릭 시에 새 창을 띄울 지 생각해봐야 함
// TODO: 이미지 로드가 안 될 시에 대체 이미지 파일도 미리 넣어둬야 함
export default function NewsListItem({ item }: NewsListItemProps) {
  // 통합 날짜 포맷 (년월일 + 요일)
  const getFormattedDate = (date: string) => {
    return new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  return (
    <div className="border-b border-border last:border-b-0 pb-6 hover:bg-muted/50 transition-colors p-6">
      <Link href={item.href} target="_blank" rel="noopener noreferrer">
        <div className="flex gap-6">
          {/* 왼쪽 썸네일 이미지 */}
          <div className="flex-shrink-0 w-[140px] h-[100px]">
            <Image
              src={item.image}
              alt={item.title}
              width={140}
              height={100}
              className="w-full h-full rounded-md object-cover object-center bg-muted"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSrI1HgkpCDNdl2bNUu0kVsUPKqITNdGfSYSRwNrPKr9zn1eFABWz0XSTzJD0UGdlQGpMeCvXGSTrQqmlUKKGc//2Q=="
            />
          </div>

          {/* 제목 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-semibold text-[18px] text-base-primary line-clamp-1 pr-4">
                {item.title}
              </h3>

              {/* 오른쪽 상단: 날짜 */}
              <span className="text-[12px] text-base-secondary font-medium flex-shrink-0">
                {getFormattedDate(item.publishedAt)}
              </span>
            </div>

            {/* 제목 아래: 뱃지들 */}
            <div className="mb-4">
              <NewsBadges category={item.category} badges={item.badges} />
            </div>

            <p className="text-[14px] text-base-secondary line-clamp-2 mb-2">
              {item.description}
            </p>

            {/* 하단은 비워두거나 다른 정보 추가 */}
            <div className="flex items-center justify-between">
              {/* 필요하면 다른 정보 추가 */}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
