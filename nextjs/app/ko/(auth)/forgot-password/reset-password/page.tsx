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
import { resetPassword } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { resetPasswordSchema } from "@/lib/utils/validation";

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
          <CardTitle className="text-3xl w-full text-center font-inter font-bold mb-6">
            비밀번호 변경
          </CardTitle>
          <CardDescription className="font-inter text-sm text-title-gray">
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
                    <FormLabel className="font-inter font-medium text-sm text-body-gray">
                      새로운 비밀번호
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        className="font-inter text-sm text-title-gray mt-1 w-full px-4 p-2 h-10"
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
                    <FormLabel className="font-inter font-medium text-sm text-body-gray">
                      비밀번호 확인
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        className="font-inter text-sm text-title-gray mt-1 w-full px-4 p-2 h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {serverError && (
                <p className="text-red-500 text-sm mt-2">{serverError}</p>
              )}
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
