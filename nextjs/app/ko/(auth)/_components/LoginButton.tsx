"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const LoginButton = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/ko/login");
  };

  return (
    <Button
      variant="ghost"
      className="flex items-center gap-2 font-nanum shrink-0 whitespace-nowrap min-w-[90px] px-4 text-sm h-10 rounded-full"
      onClick={handleLogin}
    >
      로그인
    </Button>
  );
};

export default LoginButton;
