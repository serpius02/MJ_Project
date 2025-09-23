// TODO: 카테고리 추가 혹은 세분화 필요
export type NewsCategory = "인생" | "진로" | "대학" | "기타";

export type NewsFilterCategory = "전체" | NewsCategory;

// 뱃지 카테고리 타입 정의 - 간소화
export interface BadgeCategoryProps {
  isImportant?: boolean; // 중요 - true면 뱃지 표시, false면 숨김
  isPremium?: boolean; // 프리미엄 - true면 뱃지 표시, false면 숨김
}

export interface TrendingNewsItemProps {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
  publishedAt: string;
  category: NewsCategory;
  badges?: BadgeCategoryProps; // 뱃지 정보 추가
}

export interface ExtraCurricular {
  program: string;
  institution: string;
  price: string;
  format: string;
  deadline: string;
  imageUrl: string;
}

export interface DashboardCardData {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  href?: string;
}

export interface DogEarCardProps {
  title: string;
  description: string;
  category: string;
  date: string;
  badges?: {
    isImportant?: boolean;
    isPremium?: boolean;
  };
}

export interface CourseCardProps {
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  badges?: {
    isImportant?: boolean;
    isPremium?: boolean;
  };
}
