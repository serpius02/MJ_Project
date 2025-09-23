"use client";
import GoogleSignIn from "./GoogleSignIn";
import React, { useState } from "react";
import { signIn } from "@/app/ko/(auth)/_actions/auth";
import { useRouter } from "next/navigation";
import { SignInSchema, signInSchema } from "@/app/ko/(auth)/_schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useUser from "@/lib/shared/store/user";
import { createClient } from "@/utils/supabase/client";

const LoginForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const setUser = useUser((state) => state.setUser);

  // 로그인 폼 유효성 검사 (FormMessage에서 바로 표시됨)
  const form = useForm<SignInSchema>({
    mode: "all",
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: SignInSchema) => {
    setServerError(null);
    setIsLoading(true);

    try {
      const response = await signIn({
        email: data.email,
        password: data.password,
      });

      if (response.error) {
        setServerError("로그인 정보가 올바르지 않습니다.");
      } else {
        // 로그인 성공 시 즉시 Zustand 상태 업데이트
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        router.push("/ko/");
      }
    } catch {
      setServerError("로그인 중에 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };
  // ForgotPassword에 이메일 정보 넘기기 위해서 const로 값을 받아 주소에 넘겨줌
  const email = form.getValues("email");

  return (
    <main className="w-full min-h-screen flex justify-center items-center">
      <Card className="flex flex-col w-[400px]">
        <CardHeader>
          <CardTitle className="text-[24px] w-full text-center font-bold mb-6">
            로그인
          </CardTitle>
          <CardDescription className="text-[14px] text-base-secondary">
            이메일 계정으로 로그인해주세요
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
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-[14px] text-base-secondary">
                          비밀번호
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="text-[14px] text-base-primary placeholder:text-base-secondary w-full px-4 p-2 h-10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {serverError && (
                    <p className="text-error text-[14px]">{serverError}</p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-secondary dark:bg-primary hover:bg-secondary/80 dark:hover:bg-primary/80 disabled:bg-muted rounded-md w-full h-12 px-12 py-3 text-[16px] font-medium"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      로그인 중...
                    </>
                  ) : (
                    <>로그인</>
                  )}
                </Button>
                <GoogleSignIn />
              </div>
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
              href="/ko/register"
              className="text-base-secondary text-[14px] hover:text-secondary dark:hover:text-primary transition-colors"
            >
              회원가입
            </Link>
          </div>
          <div className="absolute left-1/2 translate-x-[30px]">
            <Link
              href={`/ko/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ""}`}
              className="text-base-secondary text-[14px] hover:text-secondary dark:hover:text-primary transition-colors"
            >
              비밀번호 찾기
            </Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
};

export default LoginForm;
