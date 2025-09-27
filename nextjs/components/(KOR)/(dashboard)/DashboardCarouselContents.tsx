// components/(KOR)/(dashboard)/DashboardCarouselContents.tsx

import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DashboardCardData } from "@/types/dashboard";

export const DashboardCarouselContents = ({
  title,
  description,
  date,
  imageUrl,
  href,
}: DashboardCardData) => {
  return (
    // 주변 환경경에 맞춘 커스텀 레이아웃
    <Card className="relative w-[300px] sm:w-[380px] md:w-[480px] lg:w-[600px] aspect-[16/9] overflow-hidden rounded-lg shadow-xl">
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover"
        sizes="450px"
        priority
      />
      <div
        className="absolute inset-0 bg-gradient-to-t
                   from-black/80 via-black/40 to-transparent"
      />
      {/* 여기서 text는 그림 위에 올라가서 그냥 다크/라이트 모드 상관없이 내가 생각하기에 적당한 흰색 계통의 색을 넣어줬음 */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <h3 className="font-semibold text-[16px] text-[#E7EAEB] line-clamp-1">
          {title}
        </h3>
        <p className="text-[14px] text-[#E7EAEB] line-clamp-2 mt-1">
          {description}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[12px] text-[#DCE3EB]">{date}</span>
          {href && (
            <Link
              href={href}
              className="flex items-center text-[14px] text-secondary dark:text-primary transition-colors"
            >
              더보기
              <ChevronRight className="size-4" />
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
};
