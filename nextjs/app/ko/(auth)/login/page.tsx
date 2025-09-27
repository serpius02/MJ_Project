// app/(auth)/login/page.tsx

import { handlePageAuth } from "@/lib/data/helpers";
import ResponsiveLoginForm from "@/app/ko/(auth)/_components/ResponsiveLoginForm";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

// TODO: 나중에 광고 영상 같은 것 추가로 오른쪽 섹션에 넣어보자!
export default async function LoginPage() {
  await handlePageAuth({
    requireAuth: false,
    authenticatedRedirect: "/ko/",
  });

  return (
    <>
      {/* 모바일 레이아웃 */}
      <div className="flex flex-1 md:hidden">
        <BackgroundBeamsWithCollision>
          <ResponsiveLoginForm isDesktop={false} />
        </BackgroundBeamsWithCollision>
      </div>

      {/* 데스크톱 레이아웃 */}
      <BackgroundBeamsWithCollision>
        <div className="hidden md:flex min-h-screen w-full">
          {/* 로그인 폼 영역 - flex-1로 필요한 만큼 공간 차지 */}
          <div className="flex flex-1 items-center justify-center bg-background p-1">
            <div className="w-full max-w-md">
              <ResponsiveLoginForm isDesktop={true} />
            </div>
            {/* <div className="flex flex-1 items-center justify-center bg-background">
              <div className="w-full max-w-md">
                여기는 새로운 광고 컴포넌트 영역
              </div>
            </div> */}
          </div>
        </div>
      </BackgroundBeamsWithCollision>
    </>
  );
}
