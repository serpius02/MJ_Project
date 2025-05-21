"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { signOut } from "@/actions/auth";
import { LogOut } from "lucide-react";
import { LogIn } from "lucide-react";

const ProfileLogoutButton = ({ user }: { user: User | null }) => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      await signOut();
    } catch {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Link href="/ko/login">
        <Button variant="ghost" className="w-full font-inter">
          로그인
          <LogIn className="w-4 h-4" />
        </Button>
      </Link>
    );
  }

  return (
    <Button
      variant="ghost"
      className="w-full font-inter"
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          로그아웃
          <LogOut className="w-4 h-4" />
        </>
      )}
    </Button>
  );
};

export default ProfileLogoutButton;
