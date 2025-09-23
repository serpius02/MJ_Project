import React from "react";
import { TrendingNewsItemProps } from "@/types/dashboard";
import NewsListItem from "./NewsListItem";

interface NewsListProps {
  items: TrendingNewsItemProps[];
}

export default function NewsList({ items }: NewsListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 bg-card rounded-lg shadow-lg">
        <span className="text-[14px] text-base-secondary">
          해당 카테고리의 뉴스가 없습니다.
        </span>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg px-4 shadow-lg w-full">
      <div className="space-y-0">
        {items.map((item) => (
          <NewsListItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
