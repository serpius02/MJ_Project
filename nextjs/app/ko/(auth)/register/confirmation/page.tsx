import { Suspense } from "react";
import { SkeletonCard } from "@/app/ko/(auth)/_components/SkeletonCard";
import RegisterConfirmationContent from "@/app/ko/(auth)/_components/RegisterConfirmationContent";

export default function RegisterConfirmationPage() {
  return (
    <Suspense fallback={<SkeletonCard />}>
      <RegisterConfirmationContent />
    </Suspense>
  );
}
