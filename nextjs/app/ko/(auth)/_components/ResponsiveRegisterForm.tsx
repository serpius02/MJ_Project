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
import Link from "next/link";
import {
  signUpAction,
  checkUsernameAction,
} from "@/app/ko/(auth)/_actions/auth-actions";
import { signUpSchema } from "@/app/ko/(auth)/_schemas/auth";
import { z } from "zod";
import LogoSVG from "@/components/LogoSVG";
import Icon from "@/components/Icon";

interface ResponsiveRegisterProps {
  isDesktop?: boolean;
}

const ResponsiveRegisterForm = ({
  isDesktop = false,
}: ResponsiveRegisterProps) => {
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
      const result = await checkUsernameAction(currentUsername);

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
      const response = await signUpAction({
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

  // 데스크톱 버전
  if (isDesktop) {
    return (
      <div className="w-full min-h-screen flex flex-col gap-5 justify-center items-center">
        <LogoSVG width={64} height={64} />
        <Card className="flex flex-col w-[400px] border-0 shadow-none bg-background text-foreground">
          <CardHeader>
            <CardTitle className="text-2xl w-full text-center font-bold mb-1">
              회원가입
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mx-auto mb-3">
              빈칸에 회원가입을 위한 정보를 입력해주세요.
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
                          <FormLabel className="font-medium text-sm">
                            이메일
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="example@company.com"
                              className="text-sm text-foreground placeholder:text-muted-foreground w-full px-4 p-2 h-10"
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
                          <FormLabel className="font-medium text-sm">
                            닉네임
                          </FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input
                                {...field}
                                type="text"
                                placeholder="닉네임"
                                className="text-sm text-foreground placeholder:text-muted-foreground w-full px-4 p-2 h-10"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                className="text-xs px-3 h-10 whitespace-nowrap"
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
                                <p className="text-sm font-medium text-status-success">
                                  사용 가능한 닉네임입니다.
                                </p>
                              )}
                              {usernameCheckStatus === "taken" && (
                                <p className="text-sm font-medium text-status-destructive">
                                  이미 사용중인 닉네임입니다.
                                </p>
                              )}
                              {usernameCheckStatus === "unchecked" &&
                                watchedUsername &&
                                watchedUsername.length >= 2 && (
                                  <p className="text-sm font-medium text-status-destructive">
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
                          <FormLabel className="font-medium text-sm">
                            비밀번호
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="••••••••"
                              className="text-sm text-foreground placeholder:text-muted-foreground w-full px-4 p-2 h-10"
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
                          <FormLabel className="font-medium text-sm">
                            비밀번호 재입력
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="••••••••"
                              className="text-sm text-foreground placeholder:text-muted-foreground w-full px-4 p-2 h-10"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {serverError && (
                      <div className="text-destructive text-sm">
                        {serverError}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex flex-col">
                  <Button
                    type="submit"
                    disabled={isLoading || !form.formState.isValid}
                    className="rounded-md w-full h-12 px-12 py-3 text-primary-foreground font-medium"
                  >
                    {isLoading ? (
                      <>
                        <Icon
                          name="loader"
                          className="mr-2 h-4 w-4 animate-spin"
                        />
                        회원가입 중...
                      </>
                    ) : (
                      "회원가입"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <div className="w-full text-center items-center justify-center">
              <p className="text-sm text-muted-foreground">
                이미 회원이신가요?{" "}
                <Link
                  href="/ko/login"
                  className="text-foreground hover:underline"
                >
                  로그인
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // 모바일 버전
  return (
    <div className="w-full min-h-screen flex flex-col gap-5 justify-center items-center">
      <LogoSVG width={64} height={64} />
      <Card className="flex flex-col w-[400px] shadow-none bg-background text-foreground">
        <CardHeader>
          <CardTitle className="text-2xl w-full text-center font-bold mb-1">
            회원가입
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mx-auto mb-3">
            빈칸에 회원가입을 위한 정보를 입력해주세요.
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
                        <FormLabel className="font-medium text-sm">
                          이메일
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="example@company.com"
                            className="text-sm text-foreground placeholder:text-muted-foreground w-full px-4 p-2 h-10"
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
                        <FormLabel className="font-medium text-sm">
                          닉네임
                        </FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input
                              {...field}
                              type="text"
                              placeholder="닉네임"
                              className="text-sm text-foreground placeholder:text-muted-foreground w-full px-4 p-2 h-10"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              className="text-xs px-3 h-10 whitespace-nowrap"
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
                              <p className="text-sm font-medium text-status-success">
                                사용 가능한 닉네임입니다.
                              </p>
                            )}
                            {usernameCheckStatus === "taken" && (
                              <p className="text-sm font-medium text-status-destructive">
                                이미 사용중인 닉네임입니다.
                              </p>
                            )}
                            {usernameCheckStatus === "unchecked" &&
                              watchedUsername &&
                              watchedUsername.length >= 2 && (
                                <p className="text-sm font-medium text-status-destructive">
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
                        <FormLabel className="font-medium text-sm">
                          비밀번호
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="••••••••"
                            className="text-sm text-foreground placeholder:text-muted-foreground w-full px-4 p-2 h-10"
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
                        <FormLabel className="font-medium text-sm">
                          비밀번호 재입력
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="••••••••"
                            className="text-sm text-foreground placeholder:text-muted-foreground w-full px-4 p-2 h-10"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {serverError && (
                    <div className="text-destructive text-sm">
                      {serverError}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 flex flex-col">
                <Button
                  type="submit"
                  disabled={isLoading || !form.formState.isValid}
                  className="rounded-md w-full h-12 px-12 py-3 text-primary-foreground font-medium"
                >
                  {isLoading ? (
                    <>
                      <Icon
                        name="loader"
                        className="mr-2 h-4 w-4 animate-spin"
                      />
                      회원가입 중...
                    </>
                  ) : (
                    "회원가입"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className="w-full text-center items-center justify-center">
            <p className="text-sm text-muted-foreground">
              이미 회원이신가요?{" "}
              <Link
                href="/ko/login"
                className="text-foreground hover:underline"
              >
                로그인
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResponsiveRegisterForm;
