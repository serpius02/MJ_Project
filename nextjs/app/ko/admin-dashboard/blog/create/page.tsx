"use client";

import BlogForm from "@/components/(KOR)/(admin-dashboard)/BlogForm";
import { BlogFormSchemaType } from "@/app/ko/admin-dashboard/_schemas/blogpost";
import { createBlog } from "@/app/ko/admin-dashboard/_actions/blog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// 책임의 분산 (부모 컴포넌트에서는 서버와 데이터 통신에만 집중. 자식 컴포넌트에서는 폼 관리 (유효성 검증 등)에만 집중)
// BlogForm 컴포넌트에서 서버 액션 호출 및 결과 처리 책임을 분리

// TODO: 토스트 메시지 스타일링링
export default function BlogCreatePage() {
  const router = useRouter();

  const handleCreate = async (data: BlogFormSchemaType) => {
    const result = await createBlog(data);
    const { error } = JSON.parse(result);

    if (error) {
      toast.error(
        <span className="text-[14px]">블로그 게시글 생성에 실패했습니다.</span>,
        {
          description: (
            <pre className="mt-2 w-full rounded-md bg-card p-4 border">
              <code
                className="text-foreground text-[12px]"
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
      <span className="text-[14px]">블로그 게시글이 생성되었습니다.</span>,
      {
        description: (
          <pre className="mt-2 w-full rounded-md bg-card p-4 border">
            <code
              className="text-foreground text-[12px]"
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
              }}
            >
              <span className="text-[12px]">
                {data.title}을 생성했습니다. 대쉬보드로 이동합니다.
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

  return <BlogForm onHandleSubmit={handleCreate} />;
}
