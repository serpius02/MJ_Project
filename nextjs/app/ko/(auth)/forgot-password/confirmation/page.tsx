import ForgotPasswordConfirmationContent from "@/app/ko/(auth)/_components/ForgotPasswordConfirmationContent";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

// Next.js 15에서는 클라이언트 사이드 라우팅 시 useSearchParams()와 같은 특정 훅들이 Suspense 컴포넌트로 감싸져 있어야 함
export default function ForgotPasswordConfirmationPage() {
  return (
    <BackgroundBeamsWithCollision>
      <ForgotPasswordConfirmationContent />
    </BackgroundBeamsWithCollision>
  );
}
