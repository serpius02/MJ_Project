import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import ResponsiveForgotPasswordForm from "../_components/ResponsiveForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <>
      {/* 모바일 레이아웃 */}
      <div className="flex flex-1 md:hidden">
        <BackgroundBeamsWithCollision>
          <ResponsiveForgotPasswordForm isDesktop={false} />
        </BackgroundBeamsWithCollision>
      </div>

      {/* 데스크톱 레이아웃 */}
      <BackgroundBeamsWithCollision>
        <div className="hidden md:flex min-h-screen w-full">
          {/* 비밀번호 초기화 폼 영역 */}
          <div className="flex flex-1 items-center justify-center bg-background p-1">
            <div className="w-full max-w-md">
              <ResponsiveForgotPasswordForm isDesktop={true} />
            </div>
          </div>
        </div>
      </BackgroundBeamsWithCollision>
    </>
  );
}
