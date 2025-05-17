import { z } from "zod";

// 일단 validation.ts 에서 각종 오류 메세지를 추가해서 auth.ts로 보냄
// auth.ts에서 메시지를 받아서 실제 FormMessage에 메시지를 표시함 (각 필드 바로 밑에)
// auth.ts에서는 validation.ts에서 받은 메시지를 우선적으로 출력하되, 오류가 없을 경우 기본 메시지를 출력함

// 비밀번호 스키마
export const passwordSchema = z
  .string()
  .min(6, "비밀번호는 최소 6자 이상이어야 합니다.")
  .regex(/[0-9]/, "비밀번호에 최소 1개 이상의 숫자가 포함되어야 합니다.")
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    "비밀번호에 최소 1개 이상의 특수 문자가 포함되어야 합니다."
  )
  .regex(/[A-Z]/, "비밀번호에 최소 1개 이상의 대문자가 포함되어야 합니다.")
  .regex(/[a-z]/, "비밀번호에 최소 1개 이상의 소문자가 포함되어야 합니다.");

// 이메일 스키마
export const emailSchema = z.string().email("이메일 형식이 올바르지 않습니다.");

// 비밀번호 확인 스키마
export const passwordMatchSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["passwordConfirm"],
        message: "비밀번호가 일치하지 않습니다.",
      });
    }
  });

// 비밀번호 변경 스키마
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["passwordConfirm"],
        message: "비밀번호가 일치하지 않습니다.",
      });
    }
  });

// 비밀번호 초기화를 위한 이메일 전송 스키마
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// 로그인 스키마
export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// 회원가입 스키마
export const signUpSchema = z
  .object({ email: emailSchema })
  .and(passwordMatchSchema);

export type PasswordSchema = z.infer<typeof passwordSchema>;
export type EmailSchema = z.infer<typeof emailSchema>;
export type PasswordMatchSchema = z.infer<typeof passwordMatchSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type SignInSchema = z.infer<typeof signInSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
