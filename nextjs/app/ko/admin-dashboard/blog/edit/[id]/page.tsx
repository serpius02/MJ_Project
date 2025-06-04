import React from "react";
import EditForm from "@/components/(KOR)/(admin-dashboard)/EditForm";
import { readBlogById } from "@/lib/actions/(admin-dashboard)/blog";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 먼저 매칭되는 블로그 정보를 읽어서 EditForm에 건내줌
  const { id } = await params;
  const result = await readBlogById(id);
  const { data: blog, error } = JSON.parse(result);

  if (error) {
    return <div>에러: {error.message}</div>;
  }

  return <EditForm blog={blog} />;
}
