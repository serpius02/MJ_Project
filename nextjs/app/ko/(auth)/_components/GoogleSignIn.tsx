"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export default function GoogleSignin() {
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const supabase = createClient();

  const searchParams = useSearchParams();

  const next = searchParams.get("next");

  async function signInWithGoogle() {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback${
            next ? `?next=${encodeURIComponent(next)}` : "?next=%2Fko%2F"
          }`,
        },
      });

      if (error) {
        throw error;
      }
    } catch {
      toast.error("구글 로그인 중에 오류가 발생했습니다. 다시 시도해주세요.");
      setIsGoogleLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={signInWithGoogle}
      disabled={isGoogleLoading}
      className="rounded-md w-full h-12 px-12 py-3 text-base-secondary text-[14px] font-medium"
    >
      {isGoogleLoading ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          로그인...
        </>
      ) : (
        <Image
          src="https://authjs.dev/img/providers/google.svg"
          alt="Google logo"
          width={18}
          height={18}
          className="mr-2"
        />
      )}{" "}
      구글 계정으로 로그인
    </Button>
  );
}
