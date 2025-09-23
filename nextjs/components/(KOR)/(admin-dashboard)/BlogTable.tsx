import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import SwitchForm from "@/components/(KOR)/(admin-dashboard)/SwitchForm";
import {
  readBlogs,
  updateBlogById,
} from "@/app/ko/admin-dashboard/_actions/blog";
import DeleteAlert from "@/components/(KOR)/(admin-dashboard)/DeleteAlert";
import { BlogFormSchemaType } from "@/app/ko/admin-dashboard/_schemas/blogpost";
import Link from "next/link";

interface Blog {
  id: string;
  title: string;
  is_published: boolean;
  is_premium: boolean;
}

export default async function BlogTable() {
  // 여기서 데이터를 일단 받음
  const { data: blogs, error } = JSON.parse(await readBlogs());
  if (error) {
    console.error(error);
  }

  return (
    <div className="overflow-x-auto">
      <div className="border rounded-md w-[800px] md:w-full">
        <div className="grid grid-cols-5 p-5 text-base-primary border-b">
          <h1 className="col-span-2 text-[16px] font-medium">블로그 제목</h1>
          <h1 className="text-[16px] font-medium">프리미엄</h1>
          <h1 className="text-[16px] font-medium">게시하기</h1>
        </div>
        {blogs.map((blog: Blog) => {
          const updatePremium = updateBlogById.bind(null, blog.id, {
            is_premium: !blog.is_premium,
          } as BlogFormSchemaType);
          const updatePublished = updateBlogById.bind(null, blog.id, {
            is_published: !blog.is_published,
          } as BlogFormSchemaType);

          return (
            <div
              className="grid grid-cols-5 p-5 text-base-secondary border-b"
              key={blog.id}
            >
              <h1 className="col-span-2 text-[14px]">{blog.title}</h1>
              <SwitchForm
                checked={blog.is_premium}
                onToggle={updatePremium}
                name="프리미엄"
              />
              <SwitchForm
                checked={blog.is_published}
                onToggle={updatePublished}
                name="게시하기"
              />
              <Actions id={blog.id} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

const Actions = ({ id }: { id: string }) => {
  return (
    <div className="flex items-center gap-5 flex-wrap text-base-primary">
      <Button variant="outline" className="flex items-center gap-2 text-[14px]">
        <Eye className="w-4 h-4" />
        미리보기
      </Button>
      <Link href={`/ko/admin-dashboard/blog/edit/${id}`}>
        <Button
          variant="outline"
          className="flex items-center gap-2 text-[14px]"
        >
          <Pencil className="w-4 h-4" />
          수정하기
        </Button>
      </Link>
      <DeleteAlert blogId={id} />
    </div>
  );
};
