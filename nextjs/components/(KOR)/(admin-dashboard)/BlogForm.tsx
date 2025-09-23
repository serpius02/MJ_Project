"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, RocketIcon, Trophy, Save, Pencil, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import MarkdownPreview from "@/components/(KOR)/(admin-dashboard)/markdown/MarkdownPreview";
import {
  BlogFormSchema,
  BlogFormSchemaType,
} from "@/app/ko/admin-dashboard/_schemas/blogpost";
import { BlogDetail } from "@/types";

// 이 함수를 정의할 때 먼저 생각할 것이 어떤 props를 넣어야 할 것인가?
// 여기서는 사용자가 입력한 데이터를 건내주는 것이고, 그 데이터를 건내주기 위한 방법으로 빈 함수를 정의
// 부모 컴포넌트에서는 건내받은 이 함수로 어떤 일을 할 것인지 추가 정의
// 거기에다가 edit 페이지에 들어왔을 때, 미리 읽어둔 blog 데이터를 건내받아야 하기 때문에 이것도 추가
export default function BlogForm({
  onHandleSubmit,
  blog,
}: {
  onHandleSubmit: (data: BlogFormSchemaType) => void;
  blog?: BlogDetail;
}) {
  // Form 초기화
  const form = useForm<BlogFormSchemaType>({
    mode: "all",
    resolver: zodResolver(BlogFormSchema),
    defaultValues: {
      title: blog?.title || "",
      content: blog?.blog_content?.content || "",
      image_url: blog?.image_url || "",
      is_published: blog?.is_published || false,
      is_premium: blog?.is_premium || true,
    },
  });

  const [isPending, startTransition] = useTransition();
  const [isPreview, setIsPreview] = useState(false);

  // 데이터만 전달해주는 함수
  function onSubmit(data: BlogFormSchemaType) {
    startTransition(() => {
      onHandleSubmit(data);
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full h-[calc(90vh-2rem)] border rounded-md flex flex-col gap-6"
      >
        <div className="p-5 flex gap-5 items-center flex-wrap justify-between border-b shrink-0">
          <div className="flex gap-5 items-center">
            <span
              role="button"
              tabIndex={0}
              className="flex items-center gap-1 border p-2 rounded-md hover:bg-muted transition-all text-[14px] text-base-primary group"
              onClick={() => setIsPreview(!isPreview)}
            >
              {isPreview ? (
                <>
                  <Pencil className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                  수정하기
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                  미리보기
                </>
              )}
            </span>
            <FormField
              control={form.control}
              name="is_premium"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-1 border p-2 rounded-md text-[14px] group">
                      <Trophy className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                      <span>프리미엄</span>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-secondary dark:data-[state=checked]:bg-primary"
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_published"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-1 border p-2 rounded-md text-[14px] group">
                      <RocketIcon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                      <span>게시하기</span>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-secondary dark:data-[state=checked]:bg-primary"
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            className="group flex items-center gap-1 text-[14px] bg-secondary dark:bg-primary hover:bg-secondary/80 dark:hover:bg-primary/80 text-white"
            disabled={!form.formState.isValid}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                저장 중...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                저장하기
              </>
            )}
          </Button>
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="shrink-0">
              <FormControl>
                <div
                  className={cn(
                    "flex p-2 px-5 w-full break-words",
                    isPreview ? "divide-x-0" : "divide-x"
                  )}
                >
                  <div
                    className={cn(
                      "flex-shrink-0",
                      "px-4",
                      isPreview ? "w-0 p-0 overflow-hidden" : "w-full lg:w-1/2"
                    )}
                  >
                    <Input
                      placeholder="제목을 입력해주세요."
                      {...field}
                      className={cn(
                        "border-none text-[18px] text-base-primary placeholder:text-base-secondary font-medium leading-relaxed w-full",
                        isPreview ? "p-0" : ""
                      )}
                    />
                  </div>
                  <div
                    className={cn(
                      "lg:px-10 flex-shrink-0",
                      isPreview
                        ? "mx-auto w-full lg:w-4/5"
                        : "w-1/2 lg:block hidden"
                    )}
                  >
                    <h1 className="text-[14px] text-base-secondary font-medium">
                      {form.getValues().title}
                    </h1>
                  </div>
                </div>
              </FormControl>
              {form.getFieldState("title").invalid &&
                form.getValues().title && (
                  <div className="px-9">
                    <FormMessage />
                  </div>
                )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem className="shrink-0">
              <FormControl>
                <div
                  className={cn(
                    "flex p-2 px-5 w-full break-words",
                    isPreview ? "divide-x-0" : "divide-x"
                  )}
                >
                  <div
                    className={cn(
                      "flex-shrink-0",
                      "px-4",
                      isPreview ? "w-0 p-0 overflow-hidden" : "w-full lg:w-1/2"
                    )}
                  >
                    <Input
                      placeholder="이미지 주소를 입력해주세요."
                      {...field}
                      className={cn(
                        "border-none text-[18px] text-base-primary placeholder:text-base-secondary font-medium leading-relaxed w-full",
                        isPreview ? "p-0" : ""
                      )}
                    />
                  </div>
                  <div
                    className={cn(
                      "lg:px-10 flex-shrink-0",
                      isPreview
                        ? "mx-auto w-full lg:w-4/5"
                        : "w-1/2 lg:block hidden"
                    )}
                  >
                    {!isPreview ? (
                      <>
                        <p className="text-[14px] text-base-secondary font-medium">
                          미리보기를 눌러 이미지를 확인해주세요.
                        </p>
                      </>
                    ) : (
                      form.getValues().image_url && (
                        <div className="relative h-80 mt-5 border rounded-md">
                          <Image
                            src={form.getValues().image_url || ""}
                            alt="이미지 프리뷰"
                            fill
                            className="object-cover object-center rounded-md"
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              </FormControl>
              {form.getFieldState("image_url").invalid &&
                form.getValues().image_url && (
                  <div className="px-9">
                    <FormMessage />
                  </div>
                )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="h-full min-h-0">
              <FormControl className="h-full">
                <div
                  className={cn(
                    "flex p-2 px-5 w-full h-[calc(100%-2rem)] break-words overflow-hidden",
                    isPreview ? "divide-x-0" : "divide-x"
                  )}
                >
                  <div
                    className={cn(
                      "flex-shrink-0 h-full overflow-hidden",
                      "px-4 py-2",
                      isPreview ? "w-0 p-0 overflow-hidden" : "w-full lg:w-1/2"
                    )}
                  >
                    <Textarea
                      placeholder="내용을 입력해주세요."
                      {...field}
                      className={cn(
                        "border-none text-[18px] text-base-primary placeholder:text-base-secondary font-medium leading-relaxed w-full resize-none h-full overflow-y-auto overflow-x-auto",
                        isPreview ? "p-0" : ""
                      )}
                      style={{
                        wordBreak: "normal",
                        whiteSpace: "pre",
                        maxWidth: "100%",
                      }}
                    />
                  </div>
                  <div
                    className={cn(
                      "lg:px-10 flex-shrink-0 h-full",
                      isPreview
                        ? "mx-auto w-full lg:w-4/5"
                        : "w-1/2 lg:block hidden"
                    )}
                  >
                    <MarkdownPreview
                      content={form.getValues().content}
                      className="h-full"
                    />
                  </div>
                </div>
              </FormControl>
              {form.getFieldState("content").invalid &&
                form.getValues().content && (
                  <div className="px-9">
                    <FormMessage />
                  </div>
                )}
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
