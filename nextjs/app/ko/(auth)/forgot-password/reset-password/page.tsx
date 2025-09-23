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
import { resetPassword } from "@/app/ko/(auth)/_actions/auth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { resetPasswordSchema } from "@/app/ko/(auth)/_schemas/auth";

export default function ResetPasswordPage() {
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
      const response = await resetPassword({
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

  return (
    <main className="w-full min-h-screen flex justify-center items-center">
      <Card className="flex flex-col w-[400px]">
        <CardHeader>
          <CardTitle className="text-[24px] w-full text-center font-medium mb-6 text-base-primary">
            비밀번호 변경
          </CardTitle>
          <CardDescription className="text-[14px] text-base-secondary">
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
                    <FormLabel className="font-medium text-[14px] text-base-secondary">
                      새로운 비밀번호
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        className="text-[14px] text-base-primary mt-1 w-full px-4 p-2 h-10"
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
                    <FormLabel className="font-medium text-[14px] text-base-secondary">
                      비밀번호 확인
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        className="text-[14px] text-base-primary mt-1 w-full px-4 p-2 h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {serverError && (
                <p className="text-error text-[14px] mt-2">{serverError}</p>
              )}
              <Button
                type="submit"
                disabled={isLoading}
                className={`${
                  isLoading ? "bg-muted" : "bg-secondary dark:bg-primary"
                } rounded-md w-full h-12 px-12 py-3 text-[14px] font-medium mt-4`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
    </main>
  );
}
