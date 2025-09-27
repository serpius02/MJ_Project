"use client";

import React from "react";
import { type CarouselApi } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { TrendingNewsItemProps } from "@/types/dashboard";
import TrendingNewsCarouselContents from "./TrendingNewsCarouselContents";

export const sampleNewsItems: TrendingNewsItemProps[] = [
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
    category: "진로",
    badges: {
      isImportant: true,
      isPremium: false,
    },
  },
  {
    id: "news-2",
    title: "두 번째 주목할 만한 뉴스",
    description:
      "최신 기술 동향과 관련된 두 번째 뉴스입니다. 자세한 내용을 확인해보세요. 이것은 첫 번째 트렌드 뉴스의 간략한 설명입니다. 흥미로운 내용이 많습니다.이것은 첫 번째 트렌드 뉴스의 간략한 설명입니다. 흥미로운 내용이 많습니다.이것은 첫 번째 트렌드 뉴스의 간략한 설명입니다. 흥미로운 내용이 많습니다.이것은 첫 번째 트렌드 뉴스의 간략한 설명입니다. 흥미로운 내용이 많습니다.이것은 첫 번째 트렌드 뉴스의 간략한 설명입니다. 흥미로운 내용이 많습니다.이것은 첫 번째 트렌드 뉴스의 간략한 설명입니다. 흥미로운 내용이 많습니다.이것은 첫 번째 트렌드 뉴스의 간략한 설명입니다. 흥미로운 내용이 많습니다.",
    href: "/news/article-2",
    image:
      "https://images.unsplash.com/photo-1495020689067-958852a7765e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    publishedAt: "2024-01-14",
    category: "대학",
    badges: {
      isImportant: false,
      isPremium: true,
    },
  },
  {
    id: "news-3",
    title:
      "세 번째 주요 업데이트 소식. 세 번째 주요 업데이트 소식. 세 번째 주요 업데이트 소식.세 번째 주요 업데이트 소식. 세 번째 주요 업데이트 소식.세 번째 주요 업데이트 소식.세 번째 주요 업데이트 소식.세 번째 주요 업데이트 소식.",
    description:
      "커뮤니티에서 가장 많이 논의된 세 번째 주요 업데이트에 대한 내용입니다.",
    href: "/news/article-3",
    image:
      "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    publishedAt: "2024-01-13",
    category: "기타",
    badges: {
      isImportant: false,
      isPremium: false,
    },
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
    category: "대학",
    badges: {
      isImportant: true,
      isPremium: true,
    },
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
    category: "기타",
    badges: {
      isImportant: false,
      isPremium: true,
    },
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
    category: "기타",
    badges: {
      isImportant: true,
      isPremium: true,
    },
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
    category: "인생",
    badges: {
      isImportant: true,
      isPremium: false,
    },
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
    category: "진로",
    badges: {
      isImportant: false,
      isPremium: true,
    },
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
    category: "인생",
    badges: {
      isImportant: false,
      isPremium: false,
    },
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
    category: "진로",
    badges: {
      isImportant: false,
      isPremium: true,
    },
  },
  {
    id: "news-11",
    title: "2024년 입시 정보 완전 정복 가이드",
    description:
      "수시와 정시 전형 변화사항부터 면접 준비 팁까지, 대입 준비생들이 꼭 알아야 할 모든 정보를 한눈에 정리했습니다.",
    href: "/news/article-11",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    publishedAt: "2024-01-05",
    category: "대학",
    badges: {
      isImportant: true,
      isPremium: false,
    },
  },
  {
    id: "news-12",
    title: "고등학생을 위한 시간 관리 비법",
    description:
      "공부와 취미, 그리고 휴식의 균형을 맞춰주는 실질적인 시간 관리 방법을 소개합니다.",
    href: "/news/article-12",
    image:
      "https://images.unsplash.com/photo-1506784693919-ef06d93c28c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    publishedAt: "2024-01-04",
    category: "인생",
    badges: {
      isImportant: false,
      isPremium: false,
    },
  },
  {
    id: "news-13",
    title: "프로그래밍 언어 학습 로드맵 2024",
    description:
      "초보자를 위한 프로그래밍 언어 선택 가이드와 단계별 학습 계획을 제시합니다. Python부터 JavaScript까지 상세한 분석.",
    href: "/news/article-13",
    image:
      "https://images.unsplash.com/photo-1484417894907-623942c8ee29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    publishedAt: "2024-01-03",
    category: "진로",
    badges: {
      isImportant: true,
      isPremium: true,
    },
  },
  {
    id: "news-14",
    title: "대학생활 첫 학기 적응 가이드",
    description:
      "새내기들이 대학 생활에 성공적으로 적응할 수 있는 실용적인 조언들을 담았습니다.",
    href: "/news/article-14",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    publishedAt: "2024-01-02",
    category: "대학",
    badges: {
      isImportant: false,
      isPremium: false,
    },
  },
  {
    id: "news-15",
    title: "스트레스 관리와 멘탈 케어 방법",
    description:
      "학업 스트레스와 미래에 대한 불안감을 건강하게 관리하는 방법들을 전문가의 조언과 함께 소개합니다.",
    href: "/news/article-15",
    image:
      "https://images.unsplash.com/photo-1544027993-37dbfe43562a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    publishedAt: "2024-01-01",
    category: "인생",
    badges: {
      isImportant: true,
      isPremium: false,
    },
  },
  {
    id: "news-16",
    title: "디자인 분야 진로 탐색과 포트폴리오 준비",
    description:
      "UI/UX 디자인부터 그래픽 디자인까지, 디자인 분야별 특징과 포트폴리오 제작 가이드를 제공합니다.",
    href: "/news/article-16",
    image:
      "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    publishedAt: "2023-12-31",
    category: "진로",
    badges: {
      isImportant: false,
      isPremium: true,
    },
  },
  {
    id: "news-17",
    title: "장학금 지원 프로그램 총정리",
    description:
      "정부와 민간에서 제공하는 다양한 장학금 프로그램 정보와 신청 방법을 상세히 안내합니다.",
    href: "/news/article-17",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    publishedAt: "2023-12-30",
    category: "대학",
    badges: {
      isImportant: true,
      isPremium: false,
    },
  },
  {
    id: "news-18",
    title: "독서 습관 기르기 프로젝트",
    description:
      "바쁜 일상 속에서도 꾸준히 독서할 수 있는 방법과 추천 도서 리스트를 소개합니다.",
    href: "/news/article-18",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    publishedAt: "2023-12-29",
    category: "인생",
    badges: {
      isImportant: false,
      isPremium: false,
    },
  },
  {
    id: "news-19",
    title: "데이터 사이언스 분야 취업 가이드",
    description:
      "빅데이터와 AI 시대에 주목받는 데이터 사이언티스트가 되기 위한 필수 역량과 학습 경로를 제시합니다.",
    href: "/news/article-19",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    publishedAt: "2023-12-28",
    category: "진로",
    badges: {
      isImportant: true,
      isPremium: true,
    },
  },
  {
    id: "news-20",
    title: "대학 생활 비용 절약 꿀팁 모음",
    description:
      "학비부터 생활비까지, 대학생들이 경제적 부담을 줄일 수 있는 실질적인 방법들을 공개합니다.",
    href: "/news/article-20",
    image:
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    publishedAt: "2023-12-27",
    category: "대학",
    badges: {
      isImportant: false,
      isPremium: false,
    },
  },
  {
    id: "news-21",
    title: "건강한 수면 패턴 만들기",
    description:
      "야간 학습과 늦은 취침으로 망가진 수면 리듬을 회복하는 과학적인 방법들을 알아봅니다.",
    href: "/news/article-21",
    image:
      "https://images.unsplash.com/photo-1520206318432-f3c6781b8b4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    publishedAt: "2023-12-26",
    category: "인생",
    badges: {
      isImportant: true,
      isPremium: false,
    },
  },
  {
    id: "news-22",
    title: "마케팅 분야 직무와 커리어 패스",
    description:
      "디지털 마케팅부터 브랜드 매니지먼트까지, 마케팅 분야의 다양한 직무와 성장 경로를 탐색해봅니다.",
    href: "/news/article-22",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    publishedAt: "2023-12-25",
    category: "진로",
    badges: {
      isImportant: false,
      isPremium: true,
    },
  },
  {
    id: "news-23",
    title: "효과적인 발표와 프레젠테이션 스킬",
    description:
      "학교 발표부터 취업 면접까지, 자신감 있는 발표를 위한 실전 노하우를 공유합니다.",
    href: "/news/article-23",
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a814c963?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    publishedAt: "2023-12-24",
    category: "기타",
    badges: {
      isImportant: true,
      isPremium: false,
    },
  },
  {
    id: "news-24",
    title: "전공 선택의 고민과 해결책",
    description:
      "진로가 불분명한 학생들을 위한 전공 탐색 방법과 의사결정 가이드를 제공합니다.",
    href: "/news/article-24",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    publishedAt: "2023-12-23",
    category: "대학",
    badges: {
      isImportant: false,
      isPremium: false,
    },
  },
  {
    id: "news-25",
    title: "운동과 건강 관리의 중요성",
    description:
      "학업에 집중하느라 소홀해지기 쉬운 건강 관리, 간단한 운동부터 시작하는 방법을 알려드립니다.",
    href: "/news/article-25",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    publishedAt: "2023-12-22",
    category: "인생",
    badges: {
      isImportant: false,
      isPremium: false,
    },
  },
  {
    id: "news-26",
    title: "IT 스타트업 인턴십 준비 가이드",
    description:
      "기술 스타트업에서 인턴십 기회를 얻기 위한 준비 과정과 지원 전략을 상세히 설명합니다.",
    href: "/news/article-26",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    publishedAt: "2023-12-21",
    category: "진로",
    badges: {
      isImportant: true,
      isPremium: true,
    },
  },
  {
    id: "news-27",
    title: "효율적인 노트 정리 방법론",
    description:
      "수업 내용을 체계적으로 정리하고 복습하기 쉽게 만드는 노트 작성 기법들을 소개합니다.",
    href: "/news/article-27",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    publishedAt: "2023-12-20",
    category: "기타",
    badges: {
      isImportant: false,
      isPremium: false,
    },
  },
  {
    id: "news-28",
    title: "해외 대학 진학 준비 체크리스트",
    description:
      "해외 유학을 꿈꾸는 학생들을 위한 준비 과정과 필요한 서류, 시험 정보를 총정리했습니다.",
    href: "/news/article-28",
    image:
      "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    publishedAt: "2023-12-19",
    category: "대학",
    badges: {
      isImportant: true,
      isPremium: true,
    },
  },
  {
    id: "news-29",
    title: "인간관계와 소통 스킬 향상법",
    description:
      "학교생활과 사회생활에서 원만한 인간관계를 유지하기 위한 소통 기술을 알아봅니다.",
    href: "/news/article-29",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    publishedAt: "2023-12-18",
    category: "인생",
    badges: {
      isImportant: false,
      isPremium: false,
    },
  },
  {
    id: "news-30",
    title: "창업 아이디어 발굴과 사업 계획서 작성",
    description:
      "젊은 나이에 창업을 꿈꾸는 학생들을 위한 아이디어 발굴 방법과 실전 창업 준비 과정을 안내합니다.",
    href: "/news/article-30",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    publishedAt: "2023-12-17",
    category: "진로",
    badges: {
      isImportant: true,
      isPremium: true,
    },
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
          {sampleNewsItems.map((item) => (
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
