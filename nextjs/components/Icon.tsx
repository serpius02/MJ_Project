import { SVGProps } from "react";

// 1. 사용할 아이콘들을 모두 여기서 직접 import 합니다.
import ToMainIcon from "@/public/icons/24-to-main.svg";
import HomeIcon from "@/public/icons/24-home.svg";
import XmarkIcon from "@/public/icons/24-xmark.svg";
import MenuIcon from "@/public/icons/24-menu.svg";
import SchoolIcon from "@/public/icons/24-school.svg";
import MapStarIcon from "@/public/icons/24-map-star.svg";
import SidebarLeftShowIcon from "@/public/icons/24-sidebar-left-show.svg";
import SidebarLeftHideIcon from "@/public/icons/24-sidebar-left-hide.svg";
import SettingsIcon from "@/public/icons/24-settings.svg";
import PersonReadingIcon from "@/public/icons/24-person-reading.svg";
import ChevronRightIcon from "@/public/icons/24-chevron-right.svg";
import BookMarkIcon from "@/public/icons/24-bookmark.svg";
import SearchIcon from "@/public/icons/24-search.svg";
import MoreHorizontalIcon from "@/public/icons/24-more-horizontal.svg";
import MoonIcon from "@/public/icons/24-moon.svg";
import SunIcon from "@/public/icons/24-sun.svg";
import LayoutDashboardIcon from "@/public/icons/24-layout-dashboard.svg";
import ChevronDownIcon from "@/public/icons/24-chevron-down.svg";
import CircleQuestionIcon from "@/public/icons/24-circle-question.svg";
import SlidersIcon from "@/public/icons/24-sliders.svg";
import LoaderIcon from "@/public/icons/24-loader.svg";
import LogoutIcon from "@/public/icons/24-logout.svg";
import LoginIcon from "@/public/icons/24-login.svg";
import SubscriptionIcon from "@/public/icons/24-subscription.svg";
import CrownIcon from "@/public/icons/24-crown.svg";
import LogoIcon from "@/public/icons/Logo.svg";

// 2. 아이콘 이름과 컴포넌트를 매핑하는 객체를 만듭니다.
export const ICONS = {
  toMain: ToMainIcon,
  home: HomeIcon,
  xmark: XmarkIcon,
  menu: MenuIcon,
  school: SchoolIcon,
  mapStar: MapStarIcon,
  sidebarLeftShow: SidebarLeftShowIcon,
  sidebarLeftHide: SidebarLeftHideIcon,
  settings: SettingsIcon,
  personReading: PersonReadingIcon,
  chevronRight: ChevronRightIcon,
  bookmark: BookMarkIcon,
  search: SearchIcon,
  moreHorizontal: MoreHorizontalIcon,
  moon: MoonIcon,
  sun: SunIcon,
  layoutDashboard: LayoutDashboardIcon,
  chevronDown: ChevronDownIcon,
  circleQuestion: CircleQuestionIcon,
  sliders: SlidersIcon,
  loader: LoaderIcon,
  logout: LogoutIcon,
  login: LoginIcon,
  subscription: SubscriptionIcon,
  crown: CrownIcon,
  logo: LogoIcon,
} as const;

// 3. 아이콘 이름 타입을 정의합니다.
export type IconName = keyof typeof ICONS;

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  className?: string;
}

const Icon = ({ name, className, ...props }: IconProps) => {
  // 4. 이름에 맞는 SVG 컴포넌트를 렌더링합니다.
  const SVGIconComponent = ICONS[name];

  if (!SVGIconComponent) {
    return null; // 혹은 에러 처리
  }

  return <SVGIconComponent className={className} {...props} />;
};

export default Icon;
