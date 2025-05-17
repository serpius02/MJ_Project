"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function EmailVerified() {
  const router = useRouter();
  const dotClass =
    "rounded-full outline outline-8 dark:outline-gray-950 sm:my-6 md:my-8 my-4 size-1 outline-gray-50 bg-green-400";

  return (
    <main className="w-full min-h-screen flex justify-center items-center p-4">
      <div
        className={cn(
          "relative mx-auto w-full max-w-[780px] rounded-lg border border-dashed border-zinc-300 dark:border-zinc-800 px-2 sm:px-4 md:px-6 text-center bg-white dark:bg-zinc-950 overflow-hidden"
        )}
      >
        {/* 위/아래 선 */}
        <div className="absolute left-0 top-4 -z-0 h-px w-full bg-zinc-400 dark:bg-zinc-700 sm:top-6 md:top-8" />
        <div className="absolute bottom-4 left-0 z-0 h-px w-full bg-zinc-400 dark:bg-zinc-700 sm:bottom-6 md:bottom-8" />

        {/* 점 장식 */}
        <div className="absolute inset-0 z-0">
          {/* 가로선(위/아래) */}
          <div className="absolute left-0 top-4 h-px w-full bg-zinc-400 dark:bg-zinc-700 sm:top-6 md:top-8" />
          <div className="absolute bottom-4 left-0 h-px w-full bg-zinc-400 dark:bg-zinc-700 sm:bottom-6 md:bottom-8" />

          {/* 세로선(왼쪽/오른쪽) */}
          <div className="absolute left-4 top-0 h-full w-px bg-zinc-400 dark:bg-zinc-700 sm:left-6 md:left-8" />
          <div className="absolute right-4 top-0 h-full w-px bg-zinc-400 dark:bg-zinc-700 sm:right-6 md:right-8" />

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
          <h3 className="font-inter text-2xl font-bold text-title-primary mt-6 mb-6">
            이메일 인증이 완료되었습니다!
          </h3>
          <p className="font-inter text-body-gray mb-4">
            회원가입이 성공적으로 완료되었습니다. 홈페이지로 이동하려면 아래
            버튼을 클릭해주세요.
          </p>
          <Button
            className="mt-2 bg-blue-500 rounded-md max-w-[300px] h-12 px-12 py-3 text-base font-inter font-medium"
            onClick={() => router.push("/ko/")}
          >
            홈으로 이동하기
          </Button>
        </div>
      </div>
    </main>
  );
}
