import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { CDSData } from "./columns";
import Image from "next/image";

interface UniversityCardProps {
  university: CDSData;
  className?: string;
  onClick?: (university: CDSData) => void;
}

export const UniversityCard: React.FC<UniversityCardProps> = ({
  university,
  className = "",
  onClick,
}) => {
  const handleClick = () => {
    onClick?.(university);
  };

  // 대학교 캠퍼스 이미지 (placeholder 또는 실제 이미지)
  const getCampusImage = () => {
    // 실제 프로젝트에서는 university 데이터에서 캠퍼스 이미지 URL을 가져올 수 있습니다
    // 현재는 unsplash 이미지를 사용합니다 (대학/캠퍼스 관련 이미지)
    const campusImages = [
      "https://images.unsplash.com/photo-1682687220247-9f786e34d472?q=80&w=870",
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=870",
      "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=870",
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=870",
      "https://images.unsplash.com/photo-1555993539-1732b0258370?q=80&w=870",
      "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?q=80&w=870",
    ];

    // unitId를 기반으로 일관된 이미지 선택
    const imageIndex = university.unitId % campusImages.length;
    return campusImages[imageIndex];
  };

  return (
    <Card
      className={`font-inter-tight w-full max-w-sm hover:shadow-lg transition-all duration-300 cursor-pointer group/card overflow-hidden p-0 border-0 border-t border-t-gray-100 ${className}`}
      onClick={handleClick}
    >
      {/* 헤더 이미지 영역 */}
      <div className="relative h-60 overflow-hidden rounded-xl">
        <Image
          src={getCampusImage()}
          alt={`${university.institutionName} campus`}
          fill
          className="object-cover transition-transform duration-300 group-hover/card:scale-105"
        />
        {/* 호버 시 어두워지는 오버레이 */}
        <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/20 transition-all duration-300" />

        {/* 기본 그라데이션 오버레이 (가독성을 위해) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      <CardContent className="px-4 pb-4">
        {/* 대학 정보 섹션 */}
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="h-12 w-12 shadow-sm">
            <AvatarImage
              src={university.logoUrl}
              alt={university.institutionName}
            />
            <AvatarFallback className="text-base-primary text-[16px]">
              {university.institutionName
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 min-w-0 items-start gap-2">
            <p className="text-base-primary text-[16px] font-semibold line-clamp-2">
              {university.institutionName}
            </p>
            <p className="text-base-primary text-[10px] flex-shrink-0">
              {university.control}
            </p>
          </div>
        </div>

        <Separator className="my-6" />

        {/* 주요 통계 */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-base-secondary text-[12px]">총 학부생</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {university.ugFFTotal?.toLocaleString() || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-base-secondary text-[12px]">총 대학원생</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {university.gradFFTotal?.toLocaleString() || "N/A"}
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">지원자 수</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {university.ffAppliedTotal?.toLocaleString() || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">등록률</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {university.retentionRate
                  ? `${university.retentionRate}%`
                  : "N/A"}
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          {/* 학비 정보 */}
          <div className="text-sm">
            <p className="text-gray-500 dark:text-gray-400 mb-1">
              유학생 총 비용
            </p>
            <p className="font-bold text-lg text-gray-900 dark:text-gray-100">
              ${university.totalCost?.toLocaleString() || "N/A"}
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <div>
                학비: $
                {university.tuitionNonResident?.toLocaleString() || "N/A"}
              </div>
              <div>
                기숙사비: ${university.roomAndBoard?.toLocaleString() || "N/A"}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
