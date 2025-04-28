"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { Zap } from "lucide-react";

const NavBar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "뉴스", href: "/ko/news" },
    { name: "제품소개", href: "/ko/product" },
    { name: "자원", href: "/ko/resource" },
    { name: "가격", href: "/ko/price" },
  ];

  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 px-6">
      <div className="max-w-full h-16 flex items-center justify-between mx-auto gap-6 pl-2">
        {/* TODO: 로고 이미지 추가 및 링크 수정 */}
        <Link
          href="/"
          className="whitespace-nowrap text-xl text-title-primary font-pretendard font-extrabold tracking-wider flex items-center gap-1 shrink-0"
        >
          <Image src="/logo-vercel.svg" alt="logo" width={24} height={24} />
          엠제이에듀
        </Link>

        {/* TODO: 메뉴 수정 */}
        <div className="flex-1 flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap text-lg font-pretendard ${
                  isActive
                    ? "text-title-primary font-extrabold"
                    : "text-title-gray font-bold"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* TODO: 프로필 버튼 추가 */}
        {/* TODO: 버튼 기능 추가 */}
        <Button className="flex items-center gap-1 font-pretendard shrink-0 whitespace-nowrap min-w-[110px] px-4">
          <Zap className="w-4 h-4" />
          업그레이드
        </Button>
      </div>
    </nav>
  );
};

export default NavBar;
