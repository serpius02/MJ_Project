"use client";
import React, { useState } from "react";
import Image from "next/image";

// TODO: dicebear 아이콘을 이런 식으로 띄우기 보다는 아예 데이터베이스에 저장할 이미지를 만들어둬야 할 수도 (심지어 로그 아웃되었는데도 이미지가 뜸)
// TODO: 로그 아웃이 되면 로그인? 이라는 버튼이 떠야 할 듯
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { signOut } from "@/app/ko/(auth)/_actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import Link from "next/link";
import useUser from "@/lib/shared/store/user";

// TODO: 나중에 유저가 직접 설정한 이미지 추가할 수 있도록?
const ProfileButton = ({ user }: { user: User | null }) => {
  const router = useRouter();
  const setUser = useUser((state) => state.setUser);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const avatarSvg =
    user?.user_metadata.avatar_url ||
    createAvatar(avataaars, {
      seed: user?.user_metadata.email || "default",
    }).toDataUri();

  const handleLogout = async () => {
    setLoading(true);

    try {
      const result = await signOut();
      if (result.success) {
        setUser(null); // Zustand 상태 즉시 업데이트
        toast.success("안전하게 로그아웃되었습니다!");
        router.push("/ko/");
      } else {
        toast.error(result.message || "로그아웃 중에 오류가 발생했습니다.");
      }
    } catch {
      toast.error("예상치 못한 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.user_metadata.role === "admin";

  // TODO: 페이지 추가 (도움말, 계정설정, 프로필 설정) 및 미들웨어 추가 조정
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="flex items-center gap-1">
        <Image
          src={avatarSvg}
          alt="profile"
          width={35}
          height={35}
          className="rounded-full ring-2 ring-border"
        />
        <Icon
          name="chevronDown"
          className={`w-5 h-5 opacity-60 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </PopoverTrigger>
      <PopoverContent className="font-nanum text-sm p-2 w-65">
        <div className="py-2 flex-col">
          <div className="font-medium text-foreground px-3 py-1.5 mb-1">
            {user?.user_metadata.email}
          </div>
          <Link href="/ko/help" className="block">
            <Button
              variant="ghost"
              className="w-full flex justify-between items-center text-foreground group"
            >
              도움말
              <Icon
                name="circleQuestion"
                className="w-4 h-4 text-foreground transition-transform duration-200 group-hover:scale-120"
              />
            </Button>
          </Link>
          <Link href="/ko/profile" className="block">
            <Button
              variant="ghost"
              className="w-full flex justify-between items-center text-foreground group"
            >
              계정 설정
              <Icon
                name="sliders"
                className="w-4 h-4 text-foreground transition-transform duration-200 group-hover:scale-120"
              />
            </Button>
          </Link>
          {isAdmin && (
            <Link href="/ko/admin-dashboard" className="block">
              <Button
                variant="ghost"
                className="w-full flex justify-between items-center text-foreground group"
              >
                관리자 대시보드
                <Icon
                  name="layoutDashboard"
                  className="w-4 h-4 text-foreground transition-transform duration-200 group-hover:scale-120"
                />
              </Button>
            </Link>
          )}
        </div>
        <Separator className="my-2" />
        {user ? (
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center text-foreground group"
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? (
              <Icon name="loader" className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span className="font-medium text-foreground">로그아웃</span>
                <Icon
                  name="logout"
                  className="w-4 h-4 text-foreground transition-transform duration-200 group-hover:scale-120"
                />
              </>
            )}
          </Button>
        ) : (
          <Link href="/ko/login">
            <Button
              variant="ghost"
              className="w-full flex justify-between items-center text-foreground group"
            >
              로그인
              <Icon
                name="login"
                className="w-4 h-4 text-foreground transition-transform duration-200 group-hover:scale-120"
              />
            </Button>
          </Link>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default ProfileButton;
