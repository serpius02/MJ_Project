import { Suspense } from "react";
import { SkeletonCard } from "@/components/(KOR)/(login)/SkeletonCard";
import ForgotPasswordConfirmationContent from "@/components/(KOR)/(login)/ForgotPasswordConfirmationContent";

// Next.js 15에서는 클라이언트 사이드 라우팅 시 useSearchParams()와 같은 특정 훅들이 Suspense 컴포넌트로 감싸져 있어야 함
export default function ForgotPasswordConfirmationPage() {
  return (
    <Suspense fallback={<SkeletonCard />}>
      <ForgotPasswordConfirmationContent />
    </Suspense>
  );
}
