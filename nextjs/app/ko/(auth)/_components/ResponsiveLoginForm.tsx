"use client";
import React, { useState } from "react";
import useUser from "@/lib/shared/store/user";
import Link from "next/link";
import { signInAction } from "@/app/ko/(auth)/_actions/auth-actions";
import { useRouter } from "next/navigation";
import { SignInSchema, signInSchema } from "@/app/ko/(auth)/_schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import GoogleSignIn from "@/app/ko/(auth)/_components/GoogleSignIn";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Icon from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import LogoSVG from "@/components/LogoSVG";

interface ResponsiveLoginFormProps {
  isDesktop?: boolean;
}

const ResponsiveLoginForm = ({
  isDesktop = false,
}: ResponsiveLoginFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const setUser = useUser((state) => state.setUser);

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
      const response = await signInAction({
        email: data.email,
        password: data.password,
      });

      if (response.error) {
        setServerError(response.message);
      } else {
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

  const email = form.getValues("email");

  // 데스크톱 버전 (카드 없이 심플하게)
  if (isDesktop) {
    return (
      <div className="w-full min-h-screen flex flex-col gap-5 justify-center items-center">
        <LogoSVG width={64} height={64} />
        <Card className="flex flex-col w-[500px] border-0 shadow-none bg-background text-foreground">
          <CardHeader>
            <CardTitle className="text-2xl w-full text-center font-bold mb-1">
              로그인
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mx-auto mb-3">
              빈칸에 이메일과 비밀번호를 입력하여 로그인하세요.
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
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-sm">
                            비밀번호
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              className="text-sm text-foreground placeholder:text-muted-foreground w-full px-4 p-2 h-10"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {serverError && (
                      <p className="text-destructive text-sm">{serverError}</p>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-2">
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
                className="text-sm text-muted-foreground hover:text-card-foreground transition-colors"
              >
                회원가입
              </Link>
            </div>
            <div className="absolute left-1/2 translate-x-[30px]">
              <Link
                href={`/ko/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ""}`}
                className="text-sm text-muted-foreground hover:text-card-foreground transition-colors"
              >
                비밀번호 찾기
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
            로그인
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mx-auto mb-3">
            빈칸에 이메일과 비밀번호를 입력하여 로그인하세요.
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
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-sm">
                          비밀번호
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="text-sm text-foreground placeholder:text-muted-foreground w-full px-4 p-2 h-10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {serverError && (
                    <p className="text-destructive text-sm">{serverError}</p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-2">
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
              className="text-sm text-muted-foreground hover:text-card-foreground transition-colors"
            >
              회원가입
            </Link>
          </div>
          <div className="absolute left-1/2 translate-x-[30px]">
            <Link
              href={`/ko/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ""}`}
              className="text-sm text-muted-foreground hover:text-card-foreground transition-colors"
            >
              비밀번호 찾기
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResponsiveLoginForm;
