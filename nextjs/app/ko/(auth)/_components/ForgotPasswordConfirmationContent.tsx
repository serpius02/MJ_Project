"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { forgotPassword } from "@/app/ko/(auth)/_actions/auth";

export default function ForgotPasswordConfirmationContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleSubmit = async () => {
    if (!email) {
      setMessage({
        type: "error",
        text: "이메일 정보가 없습니다. 비밀번호 초기화 페이지로 돌아가 다시 시도해주세요.",
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const result = await forgotPassword({ email });

      if (result.error) {
        setMessage({
          type: "error",
          text:
            result.message || "비밀번호 초기화 이메일 재전송에 실패했습니다.",
        });
      } else {
        setMessage({
          type: "success",
          text: "비밀번호 초기화 이메일이 재전송되었습니다. 메일함을 확인해주세요.",
        });
      }
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "비밀번호 초기화 이메일 재전송 중 오류가 발생했습니다.",
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
          <h3 className="text-[24px] font-bold text-base-primary mt-6 mb-6">
            이메일을 확인해주세요
          </h3>
          <p className="text-[16px] text-base-secondary mb-4">
            비밀번호 초기화 링크를 이메일 주소로 보냈습니다. 이메일을 확인하고
            링크를 클릭하여 비밀번호를 초기화하세요.
          </p>
          <p className="text-[14px] text-base-secondary mb-6">
            이메일을 확인하지 못한 경우, 스팸 폴더를 확인해주세요.
          </p>

          {message && (
            <div
              className={`mb-4 p-3 rounded text-[14px] ${
                message.type === "success"
                  ? "bg-success/10 text-success"
                  : "bg-error/10 text-error"
              }`}
            >
              {message.text}
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-secondary dark:bg-primary hover:bg-secondary/80 dark:hover:bg-primary/80 disabled:bg-muted rounded-md max-w-[300px] h-12 px-12 py-3 text-[16px] font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                재전송 중...
              </>
            ) : (
              "초기화 이메일 재전송"
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}
