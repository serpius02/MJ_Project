"use client";

import React, { useEffect, useRef } from "react";
import useUser from "@/lib/shared/store/user";
import gsap from "gsap";
import Link from "next/link";
import Image from "next/image";
import MobileMenu from "./MobileMenu";
import ProfileButton from "@/app/ko/_components/ProfileButton";
import UpgradePlanButton from "@/app/ko/_components/UpgradePlanButton";
import Logo from "@/components/Logo";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ModeToggle } from "@/components/ModeToggle";
import { useTheme } from "next-themes";
import { Indicator } from "./Indicator";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import LoginButton from "../(auth)/_components/LoginButton";
import SignupButton from "../(auth)/_components/SignupButton";

export interface NavItem {
  name: string;
  href: string;
  color: string;
}

gsap.registerPlugin(ScrollTrigger);

// TODO: 메뉴 수정 (특히 색상에 대해서는 추후에 추가 확인 필요)
const navItems: NavItem[] = [
  { name: "뉴스", href: "/ko/news", color: "var(--nav-news)" },
  { name: "대시보드", href: "/ko/dashboard", color: "var(--nav-dashboard)" },
  { name: "제품소개", href: "/ko/product", color: "var(--nav-product)" },
  { name: "리소스", href: "/ko/resource", color: "var(--nav-resource)" },
  { name: "가격", href: "/ko/price", color: "var(--nav-price)" },
];

export default function FloatingNavBar() {
  const pathname = usePathname();
  const user = useUser((state) => state.user);
  const navRef = useRef<HTMLElement>(null); // 🔧 타입 명시
  const { resolvedTheme } = useTheme(); // 🔧 테마 상태 직접 감지

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 사용자 로그인 여부 확인
  const isLoggedIn = user !== null;

  // 메뉴가 열렸을 때 배경 스크롤을 막는 효과 (이전과 동일)
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const isDark = resolvedTheme === "dark";
    // 🔧 다크 모드 색상을 더 정확하게
    const bgColor = isDark
      ? "rgba(33, 34, 34, 0.85)" // �� #212222를 85% 투명도로
      : "rgba(249, 250, 251, 0.90)";
    const borderColor = isDark
      ? "rgba(58, 59, 60, 1.0)" // 정확한 #3A3B3C
      : "rgba(222, 226, 230, 1.0)";

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        gsap.set(navRef.current, {
          backgroundColor: isDark ? "#18191A" : "transparent",
          backdropFilter: "blur(0px)",
          border: "1px solid transparent",
        });

        gsap.to(navRef.current, {
          backgroundColor: bgColor,
          border: `1px solid ${borderColor}`,
          backdropFilter: "blur(16px)",
          duration: 0.6, // 🔧 다크모드에서 더 천천히
          keyframes: [
            { y: -5, duration: 0.1 },
            { y: 0, duration: 0.2 },
          ],
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: "body",
            start: "top -1px",
            end: "bottom bottom",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, navRef);

    return () => ctx.revert();
  }, [pathname, resolvedTheme]);

  useEffect(() => {
    const handleResize = () => {
      // lg 브레이크포인트 (1024px) 이상이 되면 모바일 메뉴 닫기
      if (window.innerWidth >= 1024 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    // 리사이즈 이벤트 리스너 추가
    window.addEventListener("resize", handleResize);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className="sticky top-5 max-w-xl lg:max-w-[1440px] rounded-full border z-50 px-6 mx-auto my-4 
           bg-[rgba(249,250,251,0.9)] border-[rgba(222,226,230,1)] backdrop-blur-lg
           dark:bg-[#212222] dark:border-[rgba(58,59,60,1)]
           lg:bg-transparent lg:backdrop-blur-none lg:border-transparent"
        role="navigation"
        aria-label="Floating NavBar"
      >
        <div className="h-16 flex items-center justify-between mx-auto gap-20">
          {/* TODO: 로고 이미지 추가 및 링크 수정, text-base는 16px, h-6은 대략 24px */}
          <Link
            href="/"
            className="whitespace-nowrap text-foreground tracking-wider shrink-0"
          >
            <Logo
              width={24}
              height={24}
              showText={true}
              text="엠제이에듀"
              textClassName="font-nanum font-medium text-foreground tracking-wider"
            />
          </Link>
          {/* TODO: 메뉴 수정 */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              return (
                <div
                  className="flex items-center gap-2 hover:scale-105 transition-all duration-200 group"
                  key={item.href}
                >
                  <Indicator
                    color={item.color}
                    className="group-hover:opacity-100 opacity-70"
                  />
                  <Link
                    href={item.href}
                    className="whitespace-nowrap font-nanum text-secondary-foreground group-hover:text-foreground group-hover:font-medium"
                  >
                    {item.name}
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="hidden lg:flex items-center gap-3">
            {/* TODO: 구독 버튼 기능 추가 */}
            <ModeToggle />
            {isLoggedIn ? (
              <>
                <UpgradePlanButton />
                <ProfileButton user={user} />
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <LoginButton />
                  <SignupButton />
                </div>
              </>
            )}
          </div>
          <div className="flex items-center lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label={isMenuOpen ? "닫기" : "메뉴"}
              className="p-2 relative z-50 transition-transform duration-200 hover:scale-110"
            >
              <Image
                src={isMenuOpen ? "/icons/24-xmark.svg" : "/icons/24-menu.svg"}
                alt={isMenuOpen ? "닫기" : "메뉴"}
                width={24}
                height={24}
                className={`h-6 w-6 transition-all duration-500 ${
                  isMenuOpen ? "rotate-90" : "rotate-0"
                }`}
              />
            </Button>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <MobileMenu navItems={navItems} onClose={() => setIsMenuOpen(false)} />
      )}
    </>
  );
}
