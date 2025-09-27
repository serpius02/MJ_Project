// lib/features/users/dal/mutations.ts
import { createClient } from "@/utils/supabase/server";
import { dalDbOperation, dalRequireAuth } from "@/lib/data/helpers";
import { revalidateTag } from "next/cache";
import type { Database } from "@/lib/shared/types/database.types";

type UserUpdateData = Database["public"]["Tables"]["users"]["Update"];

// 사용자 프로필 업데이트
export function updateUserProfile(updates: Partial<UserUpdateData>) {
  return dalRequireAuth(async (user) => {
    return dalDbOperation(async () => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        throw new Error(`프로필 업데이트 실패: ${error.message}`);
      }

      revalidateTag(`user:${user.id}`);
      return data;
    });
  });
}

// 사용자 삭제 (관리자만)
export function deleteUser(userId: string) {
  return dalRequireAuth(
    async () => {
      return dalDbOperation(async () => {
        const supabase = await createClient();
        const { error } = await supabase
          .from("users")
          .delete()
          .eq("id", userId);

        if (error) {
          throw new Error(`사용자 삭제 실패: ${error.message}`);
        }

        revalidateTag(`user:${userId}`);
        revalidateTag("users");
        return { success: true };
      });
    },
    { requiredRole: "admin" }
  );
}

// 사용자 역할 변경 (관리자만)
export function updateUserRole(userId: string, newRole: string) {
  return dalRequireAuth(
    async () => {
      return dalDbOperation(async () => {
        const supabase = await createClient();
        const { data, error } = await supabase
          .from("users")
          .update({ role: newRole })
          .eq("id", userId)
          .select()
          .single();

        if (error) {
          throw new Error(`역할 변경 실패: ${error.message}`);
        }

        revalidateTag(`user:${userId}`);
        return data;
      });
    },
    { requiredRole: "admin" }
  );
}
