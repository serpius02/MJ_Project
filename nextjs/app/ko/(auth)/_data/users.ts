// lib/data/users.ts
import { createClient } from "@/utils/supabase/server";
import { requireAuth } from "./auth";
import { Database } from "@/lib/shared/types/database.types";

type UserProfile = Database["public"]["Tables"]["users"]["Row"];

export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    throw new Error(`프로필 조회 실패: ${error.message}`);
  }

  return profile;
}

// 사용자 인증 정보 + 프로필 통합 조회
export async function getAuthenticatedUserProfile() {
  const user = await requireAuth(); // 미리 인증 검증

  if (!user) {
    return null;
  }

  const profile = await getUserProfile(user.id);
  return { user, profile };
}
