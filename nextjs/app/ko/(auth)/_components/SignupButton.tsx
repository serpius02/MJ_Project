"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const SignupButton = () => {
  const router = useRouter();

  const handleSignup = () => {
    router.push("/ko/register");
  };

  return (
    <Button
      className="flex items-center gap-2 font-nanum text-primary-foreground shrink-0 whitespace-nowrap min-w-[110px] px-4 text-sm h-10 rounded-full"
      onClick={handleSignup}
    >
      회원가입
    </Button>
  );
};

export default SignupButton;
