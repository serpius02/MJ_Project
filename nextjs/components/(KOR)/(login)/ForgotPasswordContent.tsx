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
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { forgotPassword } from "@/actions/auth";
import { forgotPasswordSchema, ForgotPasswordSchema } from "@/lib/schemas/auth";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";

export default function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const form = useForm<ForgotPasswordSchema>({
    mode: "all",
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: decodeURIComponent(searchParams.get("email") ?? ""),
    },
  });

  const handleSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setServerError(null);
    setIsLoading(true);

    try {
      const response = await forgotPassword({
        email: data.email,
      });

      if (response.error) {
        setServerError(response.message);
      } else {
        // 이메일 정보를 포함하여 confirmation 페이지로 리다이렉트
        router.push(
          `/ko/forgot-password/confirmation?email=${encodeURIComponent(data.email)}`
        );
      }
    } catch (error) {
      console.error(error);
      setServerError(
        "비밀번호 초기화 중에 오류가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main className="w-full min-h-screen flex justify-center items-center">
      <Card className="flex flex-col w-[400px]">
        <CardHeader>
          <CardTitle className="text-3xl w-full text-center font-inter font-bold mb-6">
            비밀번호 초기화
          </CardTitle>
          <CardDescription className="font-inter text-sm text-title-gray">
            이메일 주소를 입력하여 비밀번호를 초기화합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-inter font-medium text-sm text-body-gray">
                        이메일
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="example@company.com"
                          className="font-inter text-sm text-title-gray w-full px-4 p-2 h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {serverError && (
                  <p className="text-red-500 text-sm">{serverError}</p>
                )}
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className={`${
                  isLoading ? "bg-gray-400" : "bg-blue-500"
                } rounded-md w-full h-12 px-12 py-3 text-base font-inter font-medium mt-4`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    잠시만 기다려주세요
                  </>
                ) : (
                  "비밀번호 초기화"
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
              className="font-inter text-title-gray text-sm hover:text-blue-500 transition-colors"
            >
              로그인
            </Link>
          </div>
          <div className="absolute left-1/2 translate-x-[30px]">
            <Link
              href="/ko/register"
              className="font-inter text-title-gray text-sm hover:text-blue-500 transition-colors"
            >
              회원가입
            </Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
