"use client";
import React, { useState } from "react";
import Image from "next/image";
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  LogOut,
  LogIn,
  Loader2,
  CircleHelp,
  ChevronDown,
} from "lucide-react";
import { User } from "@supabase/supabase-js";
import { signOut } from "@/actions/auth";

// TODO: 나중에 유저가 직접 설정한 이미지 추가할 수 있도록?
const ProfileButton = ({ user }: { user: User | null }) => {
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
      await signOut();
    } catch {
      setLoading(false);
    }
  };

  // TODO: 페이지 추가 (도움말, 계정설정, 프로필 설정) 및 미들웨어 추가 조정
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="flex items-center gap-1">
        <Image
          src={avatarSvg}
          alt="profile"
          width={35}
          height={35}
          className="rounded-full ring-2 ring-gray-300"
        />
        <ChevronDown
          className={`w-4 h-4 opacity-60 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </PopoverTrigger>
      <PopoverContent className="font-inter text-sm p-2 w-65">
        <div className="py-2 flex-col">
          <div className="font-inter font-medium text-body-gray px-3 py-1.5 mb-1">
            {user?.user_metadata.email}
          </div>
          <Link href="/ko/help" className="block">
            <Button
              variant="ghost"
              className="w-full font-inter flex justify-between items-center text-title-primary group"
            >
              도움말
              <CircleHelp className="w-4 h-4 text-title-primary transition-transform duration-200 group-hover:-translate-x-0.5" />
            </Button>
          </Link>
          <Link href="/ko/profile" className="block">
            <Button
              variant="ghost"
              className="w-full font-inter flex justify-between items-center text-title-primary group"
            >
              계정 설정
              <LayoutDashboard className="w-4 h-4 text-title-primary transition-transform duration-200 group-hover:-translate-x-0.5" />
            </Button>
          </Link>
        </div>
        <Separator className="my-2" />
        {user ? (
          <Button
            variant="ghost"
            className="w-full font-inter flex justify-between items-center text-title-primary group"
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span className="font-inter font-medium text-title-gray">
                  로그아웃
                </span>
                <LogOut className="w-4 h-4 text-title-gray transition-transform duration-200 group-hover:-translate-x-0.5" />
              </>
            )}
          </Button>
        ) : (
          <Link href="/ko/login">
            <Button
              variant="ghost"
              className="w-full font-inter flex justify-between items-center text-title-primary group"
            >
              로그인
              <LogIn className="w-4 h-4 text-title-primary transition-transform duration-200 group-hover:-translate-x-0.5" />
            </Button>
          </Link>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default ProfileButton;
