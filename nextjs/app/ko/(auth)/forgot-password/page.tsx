import { Suspense } from "react";
import { SkeletonCard } from "@/components/(KOR)/(login)/SkeletonCard";
import ForgotPasswordContent from "@/components/(KOR)/(login)/ForgotPasswordContent";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<SkeletonCard />}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
