import { Suspense } from "react";
import ForgotPasswordContent from "@/components/(KOR)/(login)/ForgotPasswordContent";

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex justify-center items-center">
          로딩 중...
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}
