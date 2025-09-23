"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { signUp, isUsernameTaken } from "@/app/ko/(auth)/_actions/auth";
import { signUpSchema } from "@/app/ko/(auth)/_schemas/auth";
import { z } from "zod";

// TODO: 회원가입 약관 넣어야 하나?
// TODO: 서버 액션, useActionState, Form (next/form)을 활용해서 코드 바꿔야 할 듯. 물론 스타일링도
export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 중복확인 상태 추가
  const [usernameCheckStatus, setUsernameCheckStatus] = useState<
    "unchecked" | "checking" | "available" | "taken"
  >("unchecked");
  const [lastCheckedUsername, setLastCheckedUsername] = useState<string>("");

  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    mode: "all",
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
      username: "",
    },
  });

  // Add this to watch for username changes
  const watchedUsername = form.watch("username");

  // Add this useEffect to reset status when username changes
  useEffect(() => {
    if (
      watchedUsername !== lastCheckedUsername &&
      usernameCheckStatus !== "unchecked"
    ) {
      setUsernameCheckStatus("unchecked");
    }
  }, [watchedUsername, lastCheckedUsername, usernameCheckStatus]);

  // 중복확인 버튼 핸들러
  const handleUsernameCheck = useCallback(async () => {
    const currentUsername = form.getValues("username");

    setUsernameCheckStatus("checking");
    setLastCheckedUsername(currentUsername);

    try {
      const result = await isUsernameTaken(currentUsername);

      if (result.error) {
        setUsernameCheckStatus("unchecked");
        alert(result.message);
      } else if (result.exists) {
        setUsernameCheckStatus("taken");
      } else {
        setUsernameCheckStatus("available");
      }
    } catch (error) {
      console.error("닉네임 체크 에러:", error);
      setUsernameCheckStatus("unchecked");
      alert("닉네임 확인 중 오류가 발생했습니다.");
    }
  }, [form]);

  const handleSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setServerError(null);
    setIsLoading(true);

    try {
      const response = await signUp({
        email: data.email,
        password: data.password,
        passwordConfirm: data.passwordConfirm,
        username: data.username,
      });

      if (response.error) {
        setServerError(response.message);
      } else {
        router.push(
          `/ko/register/confirmation?email=${encodeURIComponent(data.email)}`
        );
      }
    } catch (error) {
      console.error(error);
      setServerError("회원가입 중에 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen flex justify-center items-center">
      <Card className="flex flex-col w-[400px]">
        <CardHeader>
          <CardTitle className="text-[24px] w-full text-center font-medium mb-6 text-base-primary">
            회원가입
          </CardTitle>
          <CardDescription className="text-[14px] text-base-secondary">
            회원가입을 위한 정보를 입력해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="flex flex-col gap-4">
                <div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-[14px] text-base-secondary">
                          이메일
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="example@company.com"
                            className="text-[14px] text-base-primary placeholder:text-base-secondary w-full px-4 p-2 h-10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-[14px] text-base-secondary">
                          닉네임
                        </FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input
                              {...field}
                              type="text"
                              placeholder="닉네임"
                              className="text-[14px] text-base-primary placeholder:text-base-secondary flex-1 px-4 p-2 h-10"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              className="text-[14px] text-base-primary px-4 h-10"
                              onClick={handleUsernameCheck}
                              disabled={usernameCheckStatus === "checking"}
                            >
                              {usernameCheckStatus === "checking"
                                ? "확인중..."
                                : "중복확인"}
                            </Button>
                          </div>
                        </FormControl>

                        {/* 상태 메시지 */}
                        {!form.formState.errors.username && (
                          <>
                            {usernameCheckStatus === "available" && (
                              <p className="text-[14px] font-medium text-success">
                                사용 가능한 닉네임입니다.
                              </p>
                            )}
                            {usernameCheckStatus === "taken" && (
                              <p className="text-[14px] font-medium text-error">
                                이미 사용중인 닉네임입니다.
                              </p>
                            )}
                            {usernameCheckStatus === "unchecked" &&
                              watchedUsername &&
                              watchedUsername.length >= 2 && (
                                <p className="text-[14px] font-medium text-amber-600 dark:text-amber-400">
                                  닉네임 중복확인을 해주세요.
                                </p>
                              )}
                          </>
                        )}

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-[14px] text-base-secondary">
                          비밀번호
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="••••••••"
                            className="text-[14px] text-base-primary placeholder:text-base-secondary w-full px-4 p-2 h-10"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="passwordConfirm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-[14px] text-base-secondary">
                          비밀번호 재입력
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="••••••••"
                            className="text-[14px] text-base-primary placeholder:text-base-secondary w-full px-4 p-2 h-10"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {serverError && (
                    <p className="text-error text-[14px] mt-2">{serverError}</p>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-secondary dark:bg-primary hover:bg-secondary/80 dark:hover:bg-primary/80 disabled:bg-muted rounded-md w-full h-12 px-12 py-3 text-[16px] font-medium mt-4"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    회원가입 중...
                  </>
                ) : (
                  "회원가입"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <div className="text-base-secondary text-[14px]">
            이미 회원이신가요?{" "}
            <Link
              href="/ko/login"
              className="hover:text-secondary dark:hover:text-primary transition-colors"
            >
              로그인
            </Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
