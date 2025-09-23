import {
  TrendingNewsItemProps,
  NewsCategory,
  NewsFilterCategory,
} from "@/types/dashboard";

// 카테고리별로 뉴스 필터링하는 함수 (UI 필터용)
export const getNewsByCategory = (
  items: TrendingNewsItemProps[],
  filterCategory: NewsFilterCategory
): TrendingNewsItemProps[] => {
  if (filterCategory === "전체") {
    return items;
  }
  return items.filter((item) => item.category === filterCategory);
};

// 날짜별 정렬
export const sortNewsByDate = (
  items: TrendingNewsItemProps[],
  order: "asc" | "desc" = "desc"
) => {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.publishedAt);
    const dateB = new Date(b.publishedAt);
    return order === "desc"
      ? dateB.getTime() - dateA.getTime()
      : dateA.getTime() - dateB.getTime();
  });
};

// 뉴스 검색
export const searchNews = (items: TrendingNewsItemProps[], query: string) => {
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
  );
};

// 카테고리별 뉴스 개수
export const getNewsCounts = (items: TrendingNewsItemProps[]) => {
  const counts = items.reduce(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    },
    {} as Record<NewsCategory, number>
  );

  return {
    전체: items.length,
    ...counts,
  };
};

// UI 필터 카테고리 목록 (전체 옵션 포함)
export const getFilterCategoryList = () => [
  { value: "전체" as const, label: "전체" },
  { value: "인생" as const, label: "인생" },
  { value: "진로" as const, label: "진로" },
  { value: "대학" as const, label: "대학" },
  { value: "기타" as const, label: "기타" },
];

// 실제 뉴스 카테고리 목록 (전체 옵션 제외)
export const getNewsCategoryList = () => [
  { value: "인생" as const, label: "인생" },
  { value: "진로" as const, label: "진로" },
  { value: "대학" as const, label: "대학" },
  { value: "기타" as const, label: "기타" },
];
