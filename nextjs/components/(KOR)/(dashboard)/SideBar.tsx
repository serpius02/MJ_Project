"use client";

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/lib/store/sidebar";
import Link from "next/link";

// TODO: Footer 수정

// 아이콘과 텍스트 수직 정렬을 위해 translate-y 를 사용

const items = [
  {
    title: "홈",
    url: "/ko/dashboard",
    iconLight: "/icons/Home/light.svg",
    iconDark: "/icons/Home/dark.svg",
    iconLightHighlight: "/icons/Home/light_highlight.svg",
    iconDarkHighlight: "/icons/Home/dark_highlight.svg",
    iconOffset: "-translate-y-0.5",
  },
  {
    title: "대학",
    url: "/ko/dashboard/university",
    iconLight: "/icons/University/light.svg",
    iconDark: "/icons/University/dark.svg",
    iconLightHighlight: "/icons/University/light_highlight.svg",
    iconDarkHighlight: "/icons/University/dark_highlight.svg",
    iconOffset: "translate-y-0",
  },
  {
    title: "학생",
    url: "/ko/dashboard/student",
    iconLight: "/icons/Student/light.svg",
    iconDark: "/icons/Student/dark.svg",
    iconLightHighlight: "/icons/Student/light_highlight.svg",
    iconDarkHighlight: "/icons/Student/dark_highlight.svg",
    iconOffset: "translate-y-0",
  },
  {
    title: "커리어",
    url: "/ko/dashboard/career",
    iconLight: "/icons/Career/light.svg",
    iconDark: "/icons/Career/dark.svg",
    iconLightHighlight: "/icons/Career/light_highlight.svg",
    iconDarkHighlight: "/icons/Career/dark_highlight.svg",
    iconOffset: "translate-y-0",
  },
  {
    title: "보관함",
    url: "/ko/dashboard/library",
    iconLight: "/icons/Library/light.svg",
    iconDark: "/icons/Library/dark.svg",
    iconLightHighlight: "/icons/Library/light_highlight.svg",
    iconDarkHighlight: "/icons/Library/dark_highlight.svg",
    iconOffset: "translate-y-0",
  },
] as const;

export function SideBar() {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapsed } = useSidebar();

  return (
    <Sidebar
      className={`
        h-[1100px]
        mt-30 mb-6 ml-6
        rounded-lg overflow-hidden
        flex flex-col flex-shrink-0
        transition-all duration-300 ease-in-out shadow-lg
        w-[var(--sidebar-width)]
      `}
    >
      <SidebarContent className="py-4">
        <div
          className={`flex flex-col ${isCollapsed ? "items-center" : "items-end"} p-2`}
        >
          <button
            onClick={toggleCollapsed}
            className="p-1 rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive =
                  pathname === item.url ||
                  (item.url !== "/ko/dashboard" &&
                    pathname.startsWith(`${item.url}/`));

                return (
                  <SidebarMenuItem key={item.title} className="relative py-3">
                    {/* 활성 상태 인디케이터 - 애니메이션 개선 */}
                    <div
                      className={`
                        absolute left-0 top-1/2 -translate-y-1/2
                        w-1 h-7
                        bg-secondary dark:bg-gradient-to-b dark:from-primary dark:via-primary dark:to-primary/80
                        rounded-r-full
                        transition-all duration-300 ease-out
                        -ml-2
                        ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
                      `}
                    />
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={`
                          flex items-center gap-3 py-2 rounded 
                          transition-all duration-300 ease-out
                          relative group overflow-hidden
                          ${isCollapsed ? "justify-center" : "pl-4"} 
                          ${
                            isActive
                              ? "bg-muted text-secondary hover:text-secondary dark:text-primary dark:hover:text-primary font-semibold transform scale-[1.02]"
                              : "hover:bg-muted/50 hover:text-foreground/80 hover:scale-[1.01] active:scale-[0.98]"
                          }
                        `}
                      >
                        {/* 호버 시 배경 애니메이션 */}
                        <div
                          className={`
                          absolute inset-0 bg-gradient-to-r from-transparent via-muted/30 to-transparent
                          transition-all duration-500 ease-out
                          ${isActive ? "opacity-0" : "opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full"}
                        `}
                        />

                        {/* 아이콘 컨테이너 - 애니메이션 개선 */}
                        <div
                          className={`
                          relative flex-shrink-0 transition-all duration-300 ease-out
                          ${isActive ? "scale-110" : "group-hover:scale-105 group-active:scale-95"}
                        `}
                        >
                          <Image
                            src={
                              isActive
                                ? item.iconLightHighlight
                                : item.iconLight
                            }
                            alt={item.title}
                            width={24}
                            height={24}
                            className={`dark:hidden transition-all duration-300 ${item.iconOffset || ""} ${isActive ? "drop-shadow-sm" : ""}`}
                          />
                          <Image
                            src={
                              isActive ? item.iconDarkHighlight : item.iconDark
                            }
                            alt={item.title}
                            width={24}
                            height={24}
                            className={`hidden dark:block transition-all duration-300 ${item.iconOffset || ""} ${isActive ? "drop-shadow-sm" : ""}`}
                          />
                        </div>

                        {/* 텍스트 애니메이션 */}
                        {!isCollapsed && (
                          <span
                            className={`
                            transition-all duration-300 ease-out
                            ${isActive ? "translate-x-1" : "group-hover:translate-x-0.5"}
                          `}
                          >
                            {item.title}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mb-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="justify-center">
                  <Image
                    src="/icons/Info/light.svg"
                    alt="info"
                    width={24}
                    height={24}
                    className="dark:hidden"
                  />
                  <Image
                    src="/icons/Info/dark.svg"
                    alt="info"
                    width={24}
                    height={24}
                    className="hidden dark:block"
                  />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width] text-[14px] font-normal"
              >
                <DropdownMenuItem>
                  <span>계정</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>설정</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>로그아웃</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
