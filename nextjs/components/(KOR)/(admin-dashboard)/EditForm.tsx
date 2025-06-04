"use client";

import React from "react";

import BlogForm from "./BlogForm";
import { BlogDetail } from "@/lib/types";
import { updateBlogDetailById } from "@/lib/actions/(admin-dashboard)/blog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BlogFormSchemaType } from "@/lib/schemas/(admin-dashboard)/blogpost";

// EditForm은 건내받은 데이터를 이용해 handleSubmit을 블로그 게시글을 수정하는 함수로 지정
export default function EditForm({ blog }: { blog: BlogDetail }) {
  const router = useRouter();

  const handleUpdate = async (data: BlogFormSchemaType) => {
    const result = await updateBlogDetailById(blog.id, data);
    console.log("updateBlogDetailById 결과:", result);
    const { error } = JSON.parse(result);

    console.log("파싱된 error:", error); // 이 로그도 추가

    if (error) {
      toast.error(
        <span className="font-inter text-sm">
          블로그 게시글 수정에 실패했습니다.
        </span>,
        {
          description: (
            <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
              <code
                className="text-white"
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                }}
              >
                {error.message}
              </code>
            </pre>
          ),
        }
      );
      return;
    }

    toast.success(
      <span className="font-inter text-sm">
        블로그 게시글이 수정되었습니다.
      </span>,
      {
        description: (
          <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
            <code
              className="text-white"
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
              }}
            >
              <span className="font-inter text-sm">
                {data.title}을 수정했습니다. 대쉬보드로 이동합니다.
              </span>
            </code>
          </pre>
        ),
        duration: 1200, // 토스트 메시지가 표시되는 시간 (1.2초)
      }
    );

    // 2초 후에 라우팅 실행
    setTimeout(() => {
      router.push("/ko/admin-dashboard/");
    }, 1200);
  };

  return <BlogForm onHandleSubmit={handleUpdate} blog={blog} />;
}
