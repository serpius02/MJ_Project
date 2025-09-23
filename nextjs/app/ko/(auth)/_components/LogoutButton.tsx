"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { signOut } from "@/app/ko/(auth)/_actions/auth";

const LogoutButton = ({ user }: { user: User | null }) => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      await signOut();
    } catch (error) {
      console.error("로그아웃 중에 오류가 발생했습니다:", error);
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Link href="/ko/login">
        <Button className="flex items-center gap-1 text-base-secondary shrink-0 whitespace-nowrap min-w-[110px] px-4 rounded-2xl text-[14px]">
          로그인
        </Button>
      </Link>
    );
  }

  return (
    <Button
      variant="ghost"
      className="flex items-center gap-1 text-base-secondary shrink-0 whitespace-nowrap min-w-[110px] px-4 rounded-2xl text-[14px]"
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "로그아웃"}
    </Button>
  );
};

export default LogoutButton;
