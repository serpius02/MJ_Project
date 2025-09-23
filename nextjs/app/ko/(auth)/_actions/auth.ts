"use server";

import { createClient } from "@/utils/supabase/server";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@/app/ko/(auth)/_schemas/auth";
import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";

// TODO: 닉네임 중복 체크 로직 완성시켜야 함!
export async function isUsernameTaken(username: string) {
  const supabase = await createClient();

  console.log("닉네임 중복 체크 시작:", username);

  try {
    // display_name이 username과 일치하는 레코드가 있는지 확인
    const { data, error } = await supabase
      .from("users")
      .select("display_name") // id 제거하고 display_name만 선택
      .eq("display_name", username)
      .maybeSingle();

    console.log("조회 결과:", { data, error, username });

    if (error && error.code !== "PGRST116") {
      return {
        error: true,
        message: "닉네임 중복 확인 중 오류가 발생했습니다.",
      };
    }

    const exists = !!data; // data가 있으면 이미 존재하는 닉네임
    console.log(`닉네임 "${username}" 존재 여부:`, exists);

    return {
      exists,
      status: "success",
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      error: true,
      message: "닉네임 중복 확인 중 예상치 못한 오류가 발생했습니다.",
    };
  }
}

export const signIn = async ({
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

// signUp 함수 수정
export const signUp = async ({
  email,
  password,
  passwordConfirm,
  username,
}: {
  email: string;
  password: string;
  passwordConfirm: string;
  username: string;
}) => {
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

  const isNameTaken = await isUsernameTaken(username);
  if (isNameTaken.exists) {
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

  // 트리거가 자동으로 public.users에 동기화하므로 수동 동기화 불필요!

  return {
    success: true,
    message: "인증 이메일을 보내드렸습니다. 확인해주세요.",
  };
};

// 로그아웃 처리만 하고, 성공/실패 결과만 반환.
// 페이지 이동은 클라이언트 컴포넌트 (ProfileButton)에서 처리하자.
export async function signOut() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error("로그아웃에 실패했습니다.");
    }

    revalidatePath("/ko/", "layout");
    // redirect("/ko/login");

    return { success: true, message: "로그아웃에 성공했습니다." };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export const forgotPassword = async ({ email }: { email: string }) => {
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

  // supabase authentication from here
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email);

  console.log("err: ", error);
  // if (error === null) {
  //   return {
  //     error: true,
  //     message: "No such email registered",
  //   };
  // }

  if (error) {
    return {
      error: true,
      message: error.message,
    };
  }

  // User successfully found
  return {
    success: true,
    message:
      "등록된 계정으로 비밀번호 재설정 이메일이 전송되었습니다. 메일함을 확인해주세요.",
  };
};

export const resetPassword = async ({
  password,
  passwordConfirm,
}: {
  password: string;
  passwordConfirm: string;
}) => {
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

  console.log("data : ", data);

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

  // User successfully created
  return {
    success: true,
    message: "비밀번호 변경이 완료되었습니다.",
  };
};
