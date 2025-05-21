"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/ModeToggle";
import ProfileButton from "./(login)/ProfileButton";
import useUser from "@/lib/store/user";
import UpgradePlanButton from "./(login)/UpgradePlanButton";

// import { useEffect } from "react";
// import { useState } from "react";
// import { User } from "@supabase/supabase-js";
// import { createClient } from "@/utils/supabase/client";

const NavBar = () => {
  const pathname = usePathname();

  // Zustand를 사용해 사용자 정보를 읽어오는 함수
  const user = useUser((state) => state.user);

  // const [user, setUser] = useState<User | null>(null);

  // useEffect(() => {
  //   const getUser = async () => {
  //     const supabase = await createClient();
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();
  //     setUser(user);
  //   };
  //   getUser();
  // }, []);

  const navItems = [
    { name: "뉴스", href: "/ko/news" },
    { name: "제품소개", href: "/ko/product" },
    { name: "자원", href: "/ko/resource" },
    { name: "가격", href: "/ko/price" },
  ];

  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 px-6">
      <div className="max-w-full h-16 flex items-center justify-between mx-auto gap-20 pl-2">
        {/* TODO: 로고 이미지 추가 및 링크 수정 */}
        <Link
          href="/"
          className="whitespace-nowrap text-title-primary font-inter font-[15px] tracking-wider flex items-center gap-1 shrink-0"
        >
          <Image src="/logo-vercel.svg" alt="logo" width={24} height={24} />
          엠제이에듀
        </Link>

        {/* TODO: 메뉴 수정 */}
        <div className="flex-1 flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap font-inter ${
                  isActive ? "text-title-primary font-bold" : "text-title-gray"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-4">
          <UpgradePlanButton />
          <ModeToggle />
          {/* TODO: 프로필 버튼으로 대체 */}
          <ProfileButton user={user} />
          {/* TODO: 구독 버튼 기능 추가 */}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
