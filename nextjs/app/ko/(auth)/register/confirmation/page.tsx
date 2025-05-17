import { Suspense } from "react";
import RegisterConfirmationContent from "@/components/(KOR)/(login)/RegisterConfirmationContent";

export default function RegisterConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex justify-center items-center">
          로딩 중...
        </div>
      }
    >
      <RegisterConfirmationContent />
    </Suspense>
  );
}
