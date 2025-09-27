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
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { forgotPasswordAction } from "@/app/ko/(auth)/_actions/auth-actions";
import {
  forgotPasswordSchema,
  ForgotPasswordSchema,
} from "@/app/ko/(auth)/_schemas/auth";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/Icon";
import LogoSVG from "@/components/LogoSVG";

interface ResponsiveForgotPasswordProps {
  isDesktop?: boolean;
}

const ResponsiveForgotPasswordForm = ({
  isDesktop = false,
}: ResponsiveForgotPasswordProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ForgotPasswordSchema>({
    mode: "all",
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: decodeURIComponent(searchParams.get("email") ?? ""),
    },
  });

  const handleSubmit = async (data: ForgotPasswordSchema) => {
    setServerError(null);
    setIsLoading(true);

    try {
      const response = await forgotPasswordAction({ email: data.email });

      if (response.error) {
        setServerError(response.message);
      } else {
        router.push(
          `/ko/forgot-password/confirmation?email=${encodeURIComponent(data.email)}`
        );
      }
    } catch (error) {
      console.error("비밀번호 초기화 요청 오류:", error);
      setServerError(
        "비밀번호 초기화 중에 오류가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 데스크톱 버전
  if (isDesktop) {
    return (
      <div className="w-full min-h-screen flex flex-col gap-5 justify-center items-center">
        <LogoSVG width={64} height={64} />
        <Card className="flex flex-col w-[500px] border-0 shadow-none bg-background text-foreground">
          <CardHeader>
            <CardTitle className="text-2xl w-full text-center font-bold mb-1">
              비밀번호 초기화
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mx-auto mb-3">
              이메일 주소를 입력하여 비밀번호 초기화 링크를 받아보세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
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
                          {...field}
                          type="email"
                          placeholder="example@company.com"
                          className="text-sm text-foreground placeholder:text-muted-foreground w-full px-4 p-2 h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {serverError && (
                  <div className="text-destructive text-sm">{serverError}</div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || !form.formState.isValid}
                  className="rounded-md w-full h-12 px-12 py-3 text-primary-foreground font-medium mt-5"
                >
                  {isLoading ? (
                    <>
                      <Icon
                        name="loader"
                        className="mr-2 h-4 w-4 animate-spin"
                      />
                      전송 중...
                    </>
                  ) : (
                    "초기화 링크 전송"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center items-center mt-2 relative h-10">
            <div className="absolute left-1/2 -translate-x-1/2">
              <Separator
                orientation="vertical"
                className="data-[orientation=vertical]:h-4"
              />
            </div>
            <div className="absolute right-1/2 translate-x-[-30px]">
              <Link
                href="/ko/login"
                className="text-sm text-muted-foreground hover:text-card-foreground transition-color"
              >
                로그인
              </Link>
            </div>
            <div className="absolute left-1/2 translate-x-[30px]">
              <Link
                href="/ko/register"
                className="text-sm text-muted-foreground hover:text-card-foreground transition-colors"
              >
                회원가입
              </Link>
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
            비밀번호 초기화
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mx-auto mb-3">
            이메일 주소를 입력하여 비밀번호 초기화 링크를 받아보세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
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
                        {...field}
                        type="email"
                        placeholder="example@company.com"
                        className="text-sm text-foreground placeholder:text-muted-foreground w-full px-4 p-2 h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {serverError && (
                <div className="text-destructive text-sm">{serverError}</div>
              )}

              <Button
                type="submit"
                disabled={isLoading || !form.formState.isValid}
                className="rounded-md w-full h-12 px-12 py-3 text-primary-foreground font-medium mt-5"
              >
                {isLoading ? (
                  <>
                    <Icon name="loader" className="mr-2 h-4 w-4 animate-spin" />
                    전송 중...
                  </>
                ) : (
                  "초기화 링크 전송"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center items-center mt-2 relative h-10">
          <div className="absolute left-1/2 -translate-x-1/2">
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-4"
            />
          </div>
          <div className="absolute right-1/2 translate-x-[-30px]">
            <Link
              href="/ko/login"
              className="text-sm text-muted-foreground hover:text-card-foreground transition-color"
            >
              로그인
            </Link>
          </div>
          <div className="absolute left-1/2 translate-x-[30px]">
            <Link
              href="/ko/register"
              className="text-sm text-muted-foreground hover:text-card-foreground transition-colors"
            >
              회원가입
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResponsiveForgotPasswordForm;
