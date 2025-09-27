import React from "react";
import { Badge } from "@/components/ui/badge";
import { TrendingNewsItemProps } from "@/types/dashboard";
import { Star, Crown } from "lucide-react";

interface NewsBadgesProps {
  category: string;
  badges?: TrendingNewsItemProps["badges"];
}

export default function NewsBadges({ category, badges }: NewsBadgesProps) {
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {/* 카테고리 */}
      <span className="text-[12px] text-base-secondary font-medium">
        {category}
      </span>

      {/* 구분선과 뱃지들이 있을 때만 표시 */}
      {(badges?.isImportant || badges?.isPremium) && (
        <>
          {/* 구분선 */}
          <span className="text-[12px] text-base-secondary/50">|</span>

          {/* 중요 뱃지 */}
          {badges?.isImportant && (
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0.5 h-auto flex items-center gap-1 bg-muted text-base-secondary border-border"
            >
              <Star className="h-2.5 w-2.5" />
              중요
            </Badge>
          )}

          {/* 프리미엄 뱃지 */}
          {badges?.isPremium && (
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0.5 h-auto flex items-center gap-1 bg-muted text-base-secondary border-border"
            >
              <Crown className="h-2.5 w-2.5" />
              프리미엄
            </Badge>
          )}
        </>
      )}
    </div>
  );
}
