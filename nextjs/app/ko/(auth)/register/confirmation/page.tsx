import { Suspense } from "react";
import { SkeletonCard } from "@/components/(KOR)/(login)/SkeletonCard";
import RegisterConfirmationContent from "@/components/(KOR)/(login)/RegisterConfirmationContent";

export default function RegisterConfirmationPage() {
  return (
    <Suspense fallback={<SkeletonCard />}>
      <RegisterConfirmationContent />
    </Suspense>
  );
}
