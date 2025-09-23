import { Suspense } from "react";
import { SkeletonCard } from "@/app/ko/(auth)/_components/SkeletonCard";
import ForgotPasswordContent from "@/app/ko/(auth)/_components/ForgotPasswordContent";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<SkeletonCard />}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
