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
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { signUp } from "@/actions/auth";
import { signUpSchema } from "@/lib/schemas/auth";
import { z } from "zod";

// TODO: 회원가입 약관 넣어야 하나?
export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
          <CardTitle className="text-3xl w-full text-center font-inter font-bold mb-6">
            회원가입
          </CardTitle>
          <CardDescription className="font-inter text-sm text-title-gray">
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
                        <FormLabel className="font-inter font-medium text-sm text-body-gray">
                          이메일
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="example@company.com"
                            className="font-inter text-sm text-title-gray w-full px-4 p-2 h-10"
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
                        <FormLabel className="font-inter font-medium text-sm text-body-gray">
                          닉네임
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="닉네임"
                            className="font-inter text-sm text-title-gray w-full px-4 p-2 h-10"
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
                        <FormLabel className="font-inter font-medium text-sm text-body-gray">
                          비밀번호
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="••••••••"
                            className="font-inter text-sm text-title-gray w-full px-4 p-2 h-10"
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
                        <FormLabel className="font-inter font-medium text-sm text-body-gray">
                          비밀번호 재입력
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="••••••••"
                            className="font-inter text-sm text-title-gray w-full px-4 p-2 h-10"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {serverError && (
                    <p className="text-red-500 text-sm mt-2">{serverError}</p>
                  )}
                </div>
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
          <div className="font-inter text-title-gray text-sm">
            이미 회원이신가요?{" "}
            <Link
              href="/login"
              className="hover:text-blue-500 transition-colors"
            >
              로그인
            </Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
