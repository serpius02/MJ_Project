"use client";

import NavBar from "@/components/(KOR)/NavBar";
import React from "react";
import { usePathname } from "next/navigation";
import SessionProvider from "@/components/ui/session-provider";

// 로그인 페이지에서는 레이아웃에 네비바를 숨김 (혹은 나중에 네비바를 놔둘 건지도 생각해 볼 것!)
const KoLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const hideNav =
    pathname.startsWith("/ko/login") ||
    pathname.startsWith("/ko/register") ||
    pathname.startsWith("/ko/error") ||
    pathname.startsWith("/ko/forgot-password");

  return (
    <div>
      {!hideNav && <NavBar />}
      {children}
      <SessionProvider />
    </div>
  );
};

export default KoLayout;
