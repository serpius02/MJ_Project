"use client";

import { usePathname } from "next/navigation";
import FloatingNavBar from "@/app/ko/_components/FloatingNavBar";

export function ConditionalNavBar() {
  const pathname = usePathname();

  const hideNav =
    pathname.startsWith("/ko/login") ||
    pathname.startsWith("/ko/register") ||
    pathname.startsWith("/ko/error") ||
    pathname.startsWith("/ko/forgot-password") ||
    pathname.startsWith("/ko/dashboard"); // 🔧 dashboard도 navbar 숨김

  // hideNav가 true면 아무것도 렌더링하지 않음
  if (hideNav) return null;

  return <FloatingNavBar />;
}
