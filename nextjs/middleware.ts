import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

// 이렇게 matcher를 주면 지정한 경로에 대해서만 middleware를 적용할 수 있음
// const { data } = await Supabase.auth.getSession();
// if (data.session) {
//   if (data.session.user.user_metadata.role !== "admin") {
//     return NextResponse.redirect(new URL("/ko/", request.url));
//   }
// } else {
//   return NextResponse.redirect(new URL("/ko/", request.url));
// }
// export const config = {
//   matcher: ["/dashboard/:path*"],
// };
