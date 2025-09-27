// lib/dal/helpers.ts
import { createClient } from "@/utils/supabase/server";
import { cache } from "react";
import { redirect } from "next/navigation";
import { DalReturn, DalError, ThrowableDalError } from "./types";
import { User } from "@supabase/supabase-js";

// 헬퍼 함수들
export function createSuccessReturn<T>(data: T): DalReturn<T> {
  return { success: true, data };
}

export function createErrorReturn<T>(error: DalError): DalReturn<T> {
  return { success: false, error };
}

// 기본 Supabase 인증 사용자 가져오기 (캐시됨)
export const getSupabaseUser = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }
  return data.user;
});

// 데이터베이스 작업을 래핑하는 헬퍼
export async function dalDbOperation<T>(
  operation: () => Promise<T>
): Promise<DalReturn<T>> {
  try {
    const result = await operation();
    return createSuccessReturn(result);
  } catch (error) {
    if (error instanceof ThrowableDalError) {
      return createErrorReturn(error.dalError);
    }
    // Supabase 에러 체크
    if (error && typeof error === "object" && "code" in error) {
      return createErrorReturn({ type: "supabase-error", error });
    }
    return createErrorReturn({ type: "unknown-error", error });
  }
}

// 인증이 필요한 작업을 래핑하는 헬퍼
export async function dalRequireAuth<T>(
  operation: (user: User) => Promise<DalReturn<T>>,
  options?: { requiredRole?: string }
): Promise<DalReturn<T>> {
  const user = await getSupabaseUser();

  if (!user) {
    return createErrorReturn({ type: "no-user" });
  }

  // 역할 체크가 필요한 경우
  if (options?.requiredRole) {
    const supabase = await createClient();
    const { data: profile, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error || profile?.role !== options.requiredRole) {
      return createErrorReturn({
        type: "no-access",
        requiredRole: options.requiredRole,
      });
    }
  }

  return await operation(user);
}

// 기본 동작을 위한 헬퍼들
export function dalVerifySuccess<T>(dalResult: DalReturn<T>): T {
  const redirectedResult = dalLoginRedirect(dalUnauthorizedRedirect(dalResult));
  return dalThrowError(redirectedResult);
}

export function dalLoginRedirect<T>(dalResult: DalReturn<T>): DalReturn<T> {
  if (!dalResult.success && dalResult.error.type === "no-user") {
    redirect("/login");
  }
  return dalResult;
}

export function dalUnauthorizedRedirect<T>(
  dalResult: DalReturn<T>,
  redirectPath = "/"
): DalReturn<T> {
  if (!dalResult.success && dalResult.error.type === "no-access") {
    redirect(redirectPath);
  }
  return dalResult;
}

export function dalThrowError<T>(dalResult: DalReturn<T>): T {
  if (!dalResult.success) {
    throw new Error(getErrorMessage(dalResult.error));
  }
  return dalResult.data;
}

export function getErrorMessage(error: DalError): string {
  switch (error.type) {
    case "no-user":
      return "인증이 필요한 페이지입니다.";
    case "no-access":
      return error.requiredRole
        ? `${error.requiredRole} 권한이 필요합니다.`
        : "권한이 부족합니다.";
    case "supabase-error":
      return "데이터베이스 오류가 발생했습니다.";
    case "unknown-error":
      return "알 수 없는 오류가 발생했습니다.";
    default:
      return "오류가 발생했습니다.";
  }
}

/**
 * 페이지별 인증 요구사항을 처리하는 헬퍼 함수
 *
 * 사용 예시:
 *
 * // 로그인/회원가입 페이지 - 이미 로그인된 사용자는 홈으로
 * await handlePageAuth({ requireAuth: false });
 *
 * // 일반 보호된 페이지 - 로그인 필수
 * await handlePageAuth({ requireAuth: true });
 *
 * // 관리자 전용 페이지 - 로그인 + admin 역할 필요
 * await handlePageAuth({ requireAuth: true, requiredRole: "admin" });
 *
 * // 커스텀 redirect 경로 지정
 * await handlePageAuth({
 *   requireAuth: false,
 *   authenticatedRedirect: "/dashboard"
 * });
 *
 * await handlePageAuth({
 *   requireAuth: true,
 *   unauthenticatedRedirect: "/custom-login"
 * });
 */

export async function handlePageAuth(config: {
  requireAuth?: boolean;
  requiredRole?: string;
  authenticatedRedirect?: string;
  unauthenticatedRedirect?: string;
}) {
  const {
    requireAuth = false,
    requiredRole,
    authenticatedRedirect = "/ko/",
    unauthenticatedRedirect = "/ko/login",
  } = config;

  const user = await getSupabaseUser();

  // 인증이 필요한 페이지인데 미인증
  if (requireAuth && !user) {
    redirect(unauthenticatedRedirect);
  }

  // 인증이 불필요한 페이지인데 이미 인증됨
  if (!requireAuth && user) {
    redirect(authenticatedRedirect);
  }

  // 특정 역할이 필요한 경우
  if (user && requiredRole) {
    const result = await dalRequireAuth(
      async (user) => dalDbOperation(async () => user),
      { requiredRole }
    );

    if (!result.success) {
      redirect("/ko/"); // 권한 없으면 홈으로
    }
  }

  return user;
}

// 간단한 버전들 (선택적으로 추가; 안 써도 됨)
export async function redirectIfAuthenticated(redirectTo: string = "/ko/") {
  const user = await getSupabaseUser();
  if (user) {
    redirect(redirectTo);
  }
}

export async function redirectIfUnauthenticated(
  redirectTo: string = "/ko/login"
) {
  const user = await getSupabaseUser();
  if (!user) {
    redirect(redirectTo);
  }
}
