"use client";

import * as React from "react";
import Link from "next/link";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import LogoSVG from "@/components/LogoSVG";
import { getSidebarMenus } from "../_data/route";
import { IconName } from "@/components/Icon";

interface ProjectData {
  name: string;
  url: string;
  icon: IconName;
}

const userData = {
  name: "사용자",
  email: "user@example.com",
  avatar: "/avatars/user.jpg",
};

// TODO: 프로젝트 내용 변경
// TODO: 사이드바가 접혔을 때 hover 시 tooltip을 제대로 잘 못 띄우는 문제 + navigation이 제대로 안 되는 문제
const projects: ProjectData[] = [
  {
    name: "최근 검색",
    url: "#",
    icon: "search",
  },
  {
    name: "저장된 목록",
    url: "#",
    icon: "bookmark",
  },
];

export function SideBar2({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { home, coreFeatures, tools, settings } = getSidebarMenus();
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton size="lg" asChild>
          <Link href="/ko">
            {state === "collapsed" ? (
              // 접혔을 때: 로고만 표시
              <div className="flex items-center justify-center">
                <LogoSVG className="size-8" />
              </div>
            ) : (
              // 펼쳐졌을 때: 로고 + 텍스트
              <div className="flex items-center gap-2">
                <LogoSVG className="size-6" />
                <div className="flex flex-col justify-center gap-0.5 leading-none font-nanum mt-0.5">
                  <span className="font-semibold">엠제이에듀</span>
                  <span className="text-xs text-muted-foreground">v1.0.0</span>
                </div>
              </div>
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent>
        {home.length > 0 && <NavMain items={home} title="홈" />}
        <NavMain items={coreFeatures} title="핵심 기능" />
        <NavMain items={tools} title="학습 도구" />
        <NavMain items={settings} title="설정" />

        {/* TODO: 프로젝트 데이터 수정 */}
        <NavProjects projects={projects} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
