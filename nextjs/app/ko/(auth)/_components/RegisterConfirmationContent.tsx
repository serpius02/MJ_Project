"use client";

import * as React from "react";
import Icon from "@/components/Icon";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { resendVerificationEmailAction } from "@/app/ko/(auth)/_actions/auth-actions";
import LogoSVG from "@/components/LogoSVG";

interface Message {
  type: "success" | "error";
  text: string;
}

export default function RegistrationConfirmationContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleResendEmail = async () => {
    if (!email) {
      setMessage({
        type: "error",
        text: "이메일 정보가 없습니다. 회원가입 페이지로 돌아가 다시 시도해주세요.",
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const result = await resendVerificationEmailAction({ email });

      setMessage({
        type: result.error ? "error" : "success",
        text: result.error
          ? result.message || "인증 이메일 재전송에 실패했습니다."
          : "인증 이메일이 재전송되었습니다. 메일함을 확인해주세요.",
      });
    } catch (error) {
      console.error("인증 이메일 재전송 오류:", error);
      setMessage({
        type: "error",
        text: "인증 이메일 재전송 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const dotClass =
    "rounded-full outline outline-8 dark:outline-card sm:my-6 md:my-8 my-4 size-1 outline-card bg-success";

  return (
    <main className="w-full min-h-screen flex justify-center items-center p-4">
      <div
        className={cn(
          "relative mx-auto w-full max-w-[780px] rounded-lg border border-dashed border-border px-2 sm:px-4 md:px-6 text-center bg-card overflow-hidden"
        )}
      >
        {/* 위/아래 선 */}
        <div className="absolute left-0 top-4 -z-0 h-px w-full bg-border sm:top-6 md:top-8" />
        <div className="absolute bottom-4 left-0 z-0 h-px w-full bg-border sm:bottom-6 md:bottom-8" />

        {/* 점 장식 */}
        <div className="absolute inset-0 z-0">
          {/* 가로선(위/아래) */}
          <div className="absolute left-0 top-4 h-px w-full bg-border sm:top-6 md:top-8" />
          <div className="absolute bottom-4 left-0 h-px w-full bg-border sm:bottom-6 md:bottom-8" />

          {/* 세로선(왼쪽/오른쪽) */}
          <div className="absolute left-4 top-0 h-full w-px bg-border sm:left-6 md:left-8" />
          <div className="absolute right-4 top-0 h-full w-px bg-border sm:right-6 md:right-8" />

          {/* 점 장식 */}
          <div className="absolute grid h-full w-full grid-cols-2 place-content-between px-4 sm:px-6 md:px-8">
            <div className={`${dotClass} -translate-x-[2.5px]`} />
            <div className={`${dotClass} translate-x-[2.5px] place-self-end`} />
            <div className={`${dotClass} -translate-x-[2.5px]`} />
            <div className={`${dotClass} translate-x-[2.5px] place-self-end`} />
          </div>
        </div>

        {/* 본문 */}
        <div className="relative z-20 mx-auto p-4 pb-12 sm:p-6 sm:pb-16 md:p-8 md:pb-20">
          <div className="flex flex-col justify-center items-center mt-4 mb-6">
            <LogoSVG width={64} height={64} />
            <h1 className="text-2xl font-bold mt-6 mb-6">
              이메일을 확인해주세요
            </h1>
          </div>

          {email && (
            <p className="text-sm text-muted-foreground mb-4">
              <span className="font-medium">{email}</span>로 전송되었습니다.
            </p>
          )}

          <p className="text-base mb-4">
            인증 링크가 이메일로 전송되었습니다. 받은 편지함을 확인하시고, 계정
            활성화를 위해 이메일의 링크를 클릭해주세요.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            이메일을 확인하지 못한 경우, 스팸 폴더를 확인해주세요.
          </p>

          {message && (
            <div
              className={`mb-4 p-3 rounded text-sm ${
                message.type === "success"
                  ? "bg-status-success/10 text-status-success border border-status-success/20"
                  : "bg-status-destructive/10 text-status-destructive border border-status-destructive/20"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button
              type="submit"
              onClick={handleResendEmail}
              disabled={isLoading || !email}
              className="rounded-md w-full sm:w-auto h-12 px-12 py-3 text-primary-foreground font-medium"
            >
              {isLoading ? (
                <>
                  <Icon name="loader" className="mr-2 h-4 w-4 animate-spin" />
                  재전송 중...
                </>
              ) : (
                "인증 이메일 재전송"
              )}
            </Button>

            <Button
              type="button"
              onClick={() => window.history.back()}
              variant="secondary"
              className="rounded-md w-full sm:w-auto h-12 px-12 py-3 font-medium"
            >
              이전으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
