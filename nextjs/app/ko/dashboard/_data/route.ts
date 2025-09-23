import { IconName } from "@/components/Icon";

export interface RouteConfig {
  title: string;
  breadcrumb?: string;
  description?: string;
  url?: string;
  icon?: IconName;
  isActive?: boolean;
  showInSidebar?: boolean; // 사이드바에 표시할지 여부
  items?: RouteConfig[]; // 하위 메뉴
}

// 통합 라우트 설정 - 사이드바와 breadcrumb 모두 관리
export const routeConfig: Record<string, RouteConfig> = {
  "/ko/dashboard": {
    title: "홈",
    breadcrumb: "홈",
    url: "/ko/dashboard",
    icon: "home",
    isActive: true,
    showInSidebar: true,
    description: "대시보드 홈입니다.",
    items: [
      {
        title: "대시보드 홈",
        breadcrumb: "대시보드 홈",
        url: "/ko/dashboard/",
      },
    ],
  },

  // 핵심 기능
  "/ko/dashboard/college-search": {
    title: "미국 대학",
    breadcrumb: "미국 대학",
    url: "/ko/dashboard/college-search", // 키와 동일하게
    icon: "school",
    isActive: true,
    showInSidebar: true,
    description: "전국의 대학들을 검색하고 정보를 확인하세요.",
    items: [
      {
        title: "대학 정보",
        breadcrumb: "대학 정보",
        url: "/ko/dashboard/US-college/info",
      },
      {
        title: "즐겨찾기",
        breadcrumb: "즐겨찾기",
        url: "/ko/dashboard/college-search/favorites",
      },
      {
        title: "비교하기",
        breadcrumb: "비교",
        url: "/ko/dashboard/college-search/compare",
      },
    ],
  },
  "/ko/dashboard/college-search/explore": {
    title: "대학 탐색",
    breadcrumb: "탐색",
    url: "/ko/dashboard/college-search/explore",
  },
  "/ko/dashboard/college-search/favorites": {
    title: "즐겨찾기",
    breadcrumb: "즐겨찾기",
    url: "/ko/dashboard/college-search/favorites",
  },
  "/ko/dashboard/college-search/compare": {
    title: "비교하기",
    breadcrumb: "비교",
    url: "/ko/dashboard/college-search/compare",
  },

  "/ko/dashboard/admission-helper": {
    title: "입시 도우미",
    breadcrumb: "입시 도우미",
    url: "/ko/dashboard/admission-helper",
    icon: "mapStar",
    isActive: true,
    showInSidebar: true,
    items: [
      {
        title: "에세이 도우미",
        breadcrumb: "에세이",
        url: "/ko/dashboard/admission-helper/essay",
      },
      {
        title: "일정 관리",
        breadcrumb: "일정",
        url: "/ko/dashboard/admission-helper/schedule",
      },
      {
        title: "진학 상담",
        breadcrumb: "상담",
        url: "/ko/dashboard/admission-helper/counseling",
      },
    ],
  },

  // 학습 도구
  "/ko/dashboard/learning-materials": {
    title: "학습 자료",
    breadcrumb: "학습 자료",
    url: "/ko/dashboard/learning-materials",
    icon: "personReading",
    isActive: true,
    showInSidebar: true,
    items: [
      {
        title: "강의 노트",
        breadcrumb: "노트",
        url: "/ko/dashboard/learning-materials/notes",
      },
      {
        title: "연습 문제",
        breadcrumb: "연습",
        url: "/ko/dashboard/learning-materials/practice",
      },
      {
        title: "모의고사",
        breadcrumb: "모의고사",
        url: "/ko/dashboard/learning-materials/mock-test",
      },
    ],
  },

  // 설정
  "/ko/dashboard/account-settings": {
    title: "계정 설정",
    breadcrumb: "설정",
    url: "/ko/dashboard/account-settings",
    icon: "settings",
    isActive: true,
    showInSidebar: true,
    items: [
      {
        title: "프로필",
        breadcrumb: "프로필",
        url: "/ko/dashboard/account-settings/profile",
      },
      {
        title: "알림 설정",
        breadcrumb: "알림",
        url: "/ko/dashboard/account-settings/notifications",
      },
      {
        title: "개인정보",
        breadcrumb: "개인정보",
        url: "/ko/dashboard/account-settings/privacy",
      },
    ],
  },
};

// 경로별 설정을 가져오는 헬퍼 함수
export const getRouteConfig = (pathname: string): RouteConfig | null => {
  return routeConfig[pathname] || null;
};

// Add type conversion function
const convertToNavMainItems = (items: RouteConfig[]) => {
  return items
    .filter((item): item is RouteConfig & { url: string } => !!item.url)
    .map((item) => ({
      title: item.title,
      url: item.url,
      icon: item.icon,
      isActive: item.isActive,
      items: item.items?.map((subItem) => ({
        title: subItem.title,
        url: subItem.url!,
      })),
    }));
};

// // TODO: 사이드바의 항목을 손대면, 여기도 동시에 수정을 해 나가야
export const getSidebarMenus = () => {
  const home: RouteConfig[] = [];
  const coreFeatures: RouteConfig[] = [];
  const tools: RouteConfig[] = [];
  const settings: RouteConfig[] = [];

  Object.values(routeConfig).forEach((config) => {
    if (!config.showInSidebar || !config.url) return;

    if (config.url === "/ko/dashboard") {
      home.push(config);
    } else if (
      config.url?.includes("college-search") ||
      config.url?.includes("US-college") ||
      config.url?.includes("admission-helper")
    ) {
      coreFeatures.push(config);
    } else if (config.url?.includes("learning-materials")) {
      tools.push(config);
    } else if (config.url?.includes("settings")) {
      settings.push(config);
    }
  });

  return {
    home: convertToNavMainItems(home),
    coreFeatures: convertToNavMainItems(coreFeatures),
    tools: convertToNavMainItems(tools),
    settings: convertToNavMainItems(settings),
  };
};

// 경로의 breadcrumb 체인을 생성하는 함수
export const getBreadcrumbChain = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);
  const chain: { title: string; url: string; isLast: boolean }[] = [];

  // 홈 추가
  chain.push({
    title: "홈",
    url: "/ko/dashboard",
    isLast: pathname === "/ko/dashboard",
  });

  if (pathname === "/ko/dashboard") {
    return chain;
  }

  // 각 세그먼트별로 breadcrumb 생성
  for (let i = 3; i < segments.length; i++) {
    // ko/dashboard 이후부터
    const currentPath = "/" + segments.slice(0, i + 1).join("/");
    const config = getRouteConfig(currentPath);

    if (config) {
      chain.push({
        title: config.breadcrumb || config.title,
        url: currentPath,
        isLast: i === segments.length - 1,
      });
    }
  }

  return chain;
};
