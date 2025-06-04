"use client";

import React from "react";
import { type CarouselApi } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { TrendingNewsItemProps } from "@/types/news";
import TrendingNewsCarouselContents from "./TrendingNewsCarouselContents";

const sampleNewsItems: TrendingNewsItemProps[] = [
  {
    id: "news-1",
    title:
      "첫 번째 트렌드 뉴스 제목 이건 의도적으로 조금 길게 해보았습니다. 한 번 견뎌보세요!",
    description:
      "이것은 첫 번째 트렌드 뉴스의 간략한 설명입니다. 흥미로운 내용이 많습니다.",
    href: "/news/article-1",
    image:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    publishedAt: "2024-01-15",
  },
  {
    id: "news-2",
    title: "두 번째 주목할 만한 뉴스",
    description:
      "최신 기술 동향과 관련된 두 번째 뉴스입니다. 자세한 내용을 확인해보세요.",
    href: "/news/article-2",
    image:
      "https://images.unsplash.com/photo-1495020689067-958852a7765e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    publishedAt: "2024-01-14",
  },
  {
    id: "news-3",
    title: "세 번째 주요 업데이트 소식",
    description:
      "커뮤니티에서 가장 많이 논의된 세 번째 주요 업데이트에 대한 내용입니다.",
    href: "/news/article-3",
    image:
      "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    publishedAt: "2024-01-13",
  },
  {
    id: "news-4",
    title: "네 번째 혁신적인 개발 소식",
    description:
      "새로운 프레임워크와 도구들이 개발자 생태계에 미치는 영향을 분석합니다.",
    href: "/news/article-4",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    publishedAt: "2024-01-12",
  },
  {
    id: "news-5",
    title: "다섯 번째 미래 전망 리포트",
    description:
      "2024년 기술 트렌드와 산업 전망에 대한 종합적인 분석을 제공합니다.",
    href: "/news/article-5",
    image:
      "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    publishedAt: "2024-01-11",
  },
  {
    id: "news-6",
    title: "글로벌 스타트업 투자 동향",
    description:
      "벤처캐피털의 최신 투자 패턴과 유망한 스타트업 섹터를 살펴봅니다.",
    href: "/news/article-6",
    image:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    publishedAt: "2024-01-10",
  },
  {
    id: "news-7",
    title: "AI 윤리 가이드라인 발표",
    description:
      "인공지능 개발과 활용에 대한 새로운 윤리적 기준이 제시되었습니다.",
    href: "/news/article-7",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    publishedAt: "2024-01-09",
  },
  {
    id: "news-8",
    title: "클라우드 보안 혁신 기술",
    description:
      "차세대 클라우드 보안 솔루션이 어떻게 데이터를 보호하는지 알아보세요.",
    href: "/news/article-8",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    publishedAt: "2024-01-08",
  },
  {
    id: "news-9",
    title: "모바일 개발의 새로운 패러다임",
    description:
      "크로스 플랫폼 개발 도구들이 모바일 앱 개발에 미치는 변화를 탐구합니다.",
    href: "/news/article-9",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    publishedAt: "2024-01-07",
  },
  {
    id: "news-10",
    title: "웹3.0 시대의 새로운 기회",
    description:
      "블록체인과 탈중앙화 기술이 만들어가는 미래 인터넷의 모습을 예측합니다.",
    href: "/news/article-10",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    publishedAt: "2024-01-06",
  },
];

// TODO: 스타일링 (hover하면 좌우 화살표 뜨고, 맨끝의 카드들은 살짝)
export default function TrendingNewsCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();

  return (
    <div className="relative">
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
          slidesToScroll: 1,
          containScroll: "trimSnaps",
          align: "start",
        }}
        className="w-full max-w-8xl"
      >
        <CarouselContent className="-ml-2">
          {sampleNewsItems.map((item, index) => (
            <CarouselItem
              key={item.id}
              className="pl-2 basis-1/2 md:basis-1/3 lg:basis-1/5"
            >
              <div className="p-1 h-full">
                <TrendingNewsCarouselContents item={item} className="h-full" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <button
        onClick={() => api?.scrollPrev()}
        className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-black/50 hover:bg-black/70 transition-transform duration-200"
      >
        <ChevronLeft className="h-6 w-6 text-white relative left-[-0.5px]" />
      </button>
      <button
        onClick={() => api?.scrollNext()}
        className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-black/50 hover:bg-black/70 transition-transform duration-200"
      >
        <ChevronRight className="h-6 w-6 text-white relative right-[-0.5px]" />
      </button>
    </div>
  );
}
