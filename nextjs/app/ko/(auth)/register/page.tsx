// TODO: 회원가입 약관 넣어야 하나?
// TODO: 서버 액션, useActionState, Form (next/form)을 활용해서 코드 바꿔야 할 듯. 물론 스타일링도
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import ResponsiveRegisterForm from "../_components/ResponsiveRegisterForm";

export default function RegisterPage() {
  return (
    <>
      {/* 모바일 레이아웃 */}
      <div className="flex flex-1 md:hidden">
        <BackgroundBeamsWithCollision>
          <ResponsiveRegisterForm isDesktop={false} />
        </BackgroundBeamsWithCollision>
      </div>

      {/* 데스크톱 레이아웃 */}
      <BackgroundBeamsWithCollision>
        <div className="hidden md:flex min-h-screen w-full">
          {/* 회원가입 폼 영역 */}
          <div className="flex flex-1 items-center justify-center bg-background p-1">
            <div className="w-full max-w-md">
              <ResponsiveRegisterForm isDesktop={true} />
            </div>
          </div>
        </div>
      </BackgroundBeamsWithCollision>
    </>
  );
}
