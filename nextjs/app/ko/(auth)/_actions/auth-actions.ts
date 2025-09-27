"use server";

import { createClient } from "@/utils/supabase/server";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@/app/ko/(auth)/_schemas/auth";
import { revalidatePath } from "next/cache";
import { checkUsernameAvailability } from "@/app/ko/(auth)/_data/queries";
// import { redirect } from "next/navigation";

// TODO: 닉네임 중복 체크 로직 완성시켜야 함!
// 닉네임 중복 체크 (DAL 패턴 사용)
export async function checkUsernameAction(username: string) {
  const result = await checkUsernameAvailability(username);

  if (!result.success) {
    return {
      error: true,
      message: "닉네임 중복 확인 중 오류가 발생했습니다.",
    };
  }

  return {
    exists: !result.data.isAvailable,
    status: "success",
  };
}

export const signInAction = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const signInUserValidation = signInSchema.safeParse({
    email,
    password,
  });

  if (!signInUserValidation.success) {
    return {
      error: true,
      message:
        signInUserValidation.error.issues[0]?.message ??
        "로그인 중에 오류가 발생했습니다. 다시 시도해주세요.",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error: true,
      message: error.message,
    };
  }

  if (!data.user) {
    return {
      error: true,
      message: "로그인에 실패했습니다. 다시 시도해주세요.",
    };
  }

  // // 로그인 성공 시 users 테이블 동기화
  // await syncUserToDatabase(supabase, data.user);

  return {
    success: true,
    message: "로그인에 성공했습니다.",
    user: {
      id: data.user.id,
      email: data.user.email,
      // Add any other user data you want to return
    },
  };
};

// 회원가입 (DAL 패턴 일부 활용)
export async function signUpAction({
  email,
  password,
  passwordConfirm,
  username,
}: {
  email: string;
  password: string;
  passwordConfirm: string;
  username: string;
}) {
  const signUpValidation = signUpSchema.safeParse({
    email,
    password,
    passwordConfirm,
    username,
  });

  if (!signUpValidation.success) {
    return {
      error: true,
      message:
        signUpValidation.error.issues[0]?.message ??
        "회원가입 중에 오류가 발생했습니다. 다시 시도해주세요.",
    };
  }

  // DAL 함수 사용
  const usernameCheck = await checkUsernameAction(username);
  if (usernameCheck.exists) {
    return {
      error: true,
      message: "이미 사용중인 닉네임입니다.",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });

  if (error) {
    return { error: true, message: error.message };
  }

  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return { error: true, message: "이미 사용중인 이메일입니다." };
  }

  return {
    success: true,
    message: "인증 이메일을 보내드렸습니다. 확인해주세요.",
  };
}

// 로그아웃
export async function signOutAction() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error("로그아웃에 실패했습니다.");
    }

    revalidatePath("/", "layout");

    return { success: true, message: "로그아웃에 성공했습니다." };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

// 비밀번호 찾기
export async function forgotPasswordAction({ email }: { email: string }) {
  const forgotPasswordValidation = forgotPasswordSchema.safeParse({
    email,
  });

  if (!forgotPasswordValidation.success) {
    return {
      error: true,
      message:
        forgotPasswordValidation.error.issues[0]?.message ??
        "비밀번호 초기화 중에 오류가 발생했습니다. 다시 시도해주세요.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    return {
      error: true,
      message: error.message,
    };
  }

  return {
    success: true,
    message:
      "등록된 계정으로 비밀번호 재설정 이메일이 전송되었습니다. 메일함을 확인해주세요.",
  };
}

// 비밀번호 재설정
export async function resetPasswordAction({
  password,
  passwordConfirm,
}: {
  password: string;
  passwordConfirm: string;
}) {
  const resetPasswordValidation = resetPasswordSchema.safeParse({
    password,
    passwordConfirm,
  });

  if (!resetPasswordValidation.success) {
    return {
      error: true,
      message:
        resetPasswordValidation.error.issues[0]?.message ??
        "비밀번호 초기화 중에 오류가 발생했습니다. 다시 시도해주세요.",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.updateUser({
    password: password,
  });

  console.log(data);

  if (error) {
    // 이전 비밀번호와 동일한 경우 체크
    if (error.message.includes("new password should be different")) {
      return {
        error: true,
        message: "새 비밀번호는 현재 비밀번호와 달라야 합니다.",
      };
    }

    return {
      error: true,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "비밀번호 변경이 완료되었습니다.",
  };
}

// 인증 이메일 재전송 (RegisterConfirmationContent.tsx)
export async function resendVerificationEmailAction({
  email,
}: {
  email: string;
}) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
    });

    if (error) {
      return {
        error: true,
        message: error.message || "인증 이메일 재전송에 실패했습니다.",
      };
    }

    return {
      success: true,
      message: "인증 이메일이 재전송되었습니다.",
    };
  } catch (error) {
    console.error("인증 이메일 재전송 오류:", error);
    return {
      error: true,
      message: "인증 이메일 재전송 중 오류가 발생했습니다.",
    };
  }
}
