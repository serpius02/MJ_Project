// lib/features/users/dal/queries.ts
import { createClient } from "@/utils/supabase/server";
import { dalDbOperation, dalRequireAuth } from "@/lib/data/helpers";
import type { Database } from "@/lib/shared/types/database.types";

type UserProfile = Database["public"]["Tables"]["users"]["Row"];

// 특정 사용자 프로필 조회 (내부 함수 - 인증 체크 없음)
async function _getUserProfile(userId: string) {
  return dalDbOperation(async () => {
    const supabase = await createClient();
    const { data: profile, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      throw new Error(`프로필 조회 실패: ${error.message}`);
    }

    return profile as UserProfile;
  });
}

// 현재 인증된 사용자의 프로필 조회
export async function getCurrentUserProfile() {
  return dalRequireAuth(async (user) => {
    return _getUserProfile(user.id);
  });
}

// 사용자 인증 정보 + 프로필 통합 조회
export async function getAuthenticatedUserWithProfile() {
  return dalRequireAuth(async (user) => {
    const profileResult = await _getUserProfile(user.id);

    if (!profileResult.success) {
      return profileResult; // 에러를 그대로 전파
    }

    return dalDbOperation(async () => ({
      user,
      profile: profileResult.data,
    }));
  });
}

// 특정 역할이 필요한 사용자 정보 조회 (예: 관리자)
export async function getUserWithRole(requiredRole: string) {
  return dalRequireAuth(async (user) => _getUserProfile(user.id), {
    requiredRole,
  });
}

// 닉네임 중복 체크 (인증 불필요)
export async function checkUsernameAvailability(username: string) {
  return dalDbOperation(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("display_name", username)
      .maybeSingle();

    if (error) {
      console.error("닉네임 중복 확인 오류:", error);
      // 에러 발생 시 안전하게 사용 불가로 처리
      return { isAvailable: false, error: true };
    }

    return {
      isAvailable: !data, // data가 없으면 사용 가능
      error: false,
    };
  });
}
