// lib/data/auth.ts
import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import { getUserProfile } from "./users";

// 사용자 세션을 가져와서 사용자 정보를 반환
export const getAuthenticatedUser = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null; // 오류가 있거나 유저가 없으면 null 반환
  }
  return data.user;
});

// 인증이 필요한 페이지에서 사용할 헬퍼 (Data Access Layer)
export const requireAuth = cache(async () => {
  const user = await getAuthenticatedUser();

  if (!user) {
    // redirect('/login') 또는 에러 throw 등 처리
    throw new Error("인증이 필요한 페이지입니다.");
  }

  return user;
});

// 인증이 필요한 페이지에서 사용할 헬퍼 (Data Access Layer; user || admin)
export const requireRole = cache(async (requiredRole: string) => {
  const user = await requireAuth();
  const profile = await getUserProfile(user.id);

  if (profile?.role !== requiredRole) {
    throw new Error("권한이 부족합니다.");
  }

  return { user, profile };
});

// 닉네임 중복 체크 로직 (회원 가입 시에 사용되는...)
export async function isUsernameTaken(username: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("display_name", username)
    .maybeSingle();

  if (error) {
    console.error("닉네임 중복 확인 오류:", error);
    return true; // 오류 발생 시 일단 사용 불가로 처리
  }
  return !!data; // data가 있으면 true (사용 중), 없으면 false
}
