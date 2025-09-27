"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { resetPasswordAction } from "@/app/ko/(auth)/_actions/auth-actions";
import { useRouter } from "next/navigation";
import { resetPasswordSchema } from "@/app/ko/(auth)/_schemas/auth";
import Icon from "@/components/Icon";
import LogoSVG from "@/components/LogoSVG";

interface ResponsiveResetPasswordProps {
  isDesktop?: boolean;
}

const ResponsiveResetPasswordForm = ({
  isDesktop = false,
}: ResponsiveResetPasswordProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setServerError(null);
    setIsLoading(true);

    try {
      const response = await resetPasswordAction({
        password: data.password,
        passwordConfirm: data.passwordConfirm,
      });

      if (response.error) {
        setServerError(
          "비밀번호 변경 중에 오류가 발생했습니다. 다시 시도해주세요."
        );
      } else {
        router.push("/ko/login");
      }
    } catch (error) {
      console.error(error);
      setServerError(
        "비밀번호 변경 중에 오류가 발생했습니다. 다시 시도해주세요."
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
              비밀번호 변경
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mx-auto mb-4">
              새로운 비밀번호를 입력하여 비밀번호를 변경합니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-sm">
                        새로운 비밀번호
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

                <FormField
                  control={form.control}
                  name="passwordConfirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-sm">
                        비밀번호 확인
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
                  <div className="text-destructive text-sm">{serverError}</div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-md w-full h-12 px-12 py-3 text-primary-foreground font-medium mt-4"
                >
                  {isLoading ? (
                    <>
                      <Icon
                        name="loader"
                        className="mr-2 h-4 w-4 animate-spin"
                      />
                      잠시만 기다려주세요
                    </>
                  ) : (
                    "비밀번호 변경"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
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
            비밀번호 변경
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mx-auto mb-4">
            새로운 비밀번호를 입력하여 비밀번호를 변경합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-sm">
                      새로운 비밀번호
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

              <FormField
                control={form.control}
                name="passwordConfirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-sm">
                      비밀번호 확인
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
                <div className="text-destructive text-sm">{serverError}</div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="rounded-md w-full h-12 px-12 py-3 text-primary-foreground font-medium mt-4"
              >
                {isLoading ? (
                  <>
                    <Icon name="loader" className="mr-2 h-4 w-4 animate-spin" />
                    잠시만 기다려주세요
                  </>
                ) : (
                  "비밀번호 변경"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResponsiveResetPasswordForm;
