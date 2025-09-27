// app/ko/(auth)/email-verified/page.tsx

import EmailVerifiedConfirmationContent from "@/app/ko/(auth)/_components/EmailVerifiedConfirmationContent";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

export default function EmailVerifiedPage() {
  return (
    <BackgroundBeamsWithCollision>
      <EmailVerifiedConfirmationContent />
    </BackgroundBeamsWithCollision>
  );
}
