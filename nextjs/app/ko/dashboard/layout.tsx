// 서버 컴포넌트화 시켰음
// TODO: 쿠키 사용에 대한 동의 얻기
import { cookies } from "next/headers";

import { SideBar2 } from "@/app/ko/dashboard/_components/SideBar2";
import { BreadcrumbHeader } from "@/app/ko/dashboard/_components/BreadcrumbHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// PPR 활성화 시켰음
export const experimental_ppr = true;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <SideBar2 />
      <SidebarInset>
        <BreadcrumbHeader />
        <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
