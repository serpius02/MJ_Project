// "use server";

// import { BlogFormSchemaType } from "@/app/ko/admin-dashboard/_schemas/blogpost";
// import { createClient } from "@/utils/supabase/server";
// import { revalidatePath } from "next/cache";

// export async function createBlog(data: BlogFormSchemaType) {
//   const supabase = await createClient();

//   // 폼 데이터에서 content를 분리하고, 나머지 데이터를 blog 객체에 저장합니다.
//   // 이렇게 하면 'blog' 객체에는 'content'가 포함되지 않습니다.
//   const { content, ...blog } = data;

//   const resultBlog = await supabase
//     .from("blog")
//     .insert({
//       ...blog,
//       image_url: blog.image_url || "",
//     })
//     .select("id")
//     .single();

//   if (resultBlog.error) {
//     return JSON.stringify(resultBlog);
//   } else {
//     const result = await supabase.from("blog_content").insert({
//       content: content,
//       id: resultBlog.data.id!,
//     });

//     if (result.error) {
//       return JSON.stringify(result);
//     }

//     revalidatePath("/ko/admin-dashboard");
//     return JSON.stringify(result);
//   }
// }

// // is_published = true인 블로그 읽기
// export async function readBlogs() {
//   const supabase = await createClient();

//   const result = await supabase
//     .from("blog")
//     .select("*")
//     .order("created_at", { ascending: false })
//     .eq("is_published", true);

//   return JSON.stringify(result);
// }

// export async function deleteBlogById(id: string) {
//   const supabase = await createClient();

//   const result = await supabase.from("blog").delete().eq("id", id);

//   revalidatePath("/ko/admin-dashboard");
//   return JSON.stringify(result);
// }

// // 이 함수는 blog 테이블에서 is_premium, is_published만 수정하도록 하기 위해 만들어짐.
// export async function updateBlogById(id: string, data: BlogFormSchemaType) {
//   const supabase = await createClient();

//   const result = await supabase.from("blog").update(data).eq("id", id);

//   revalidatePath("/ko/admin-dashboard");
//   return JSON.stringify(result);
// }

// // Join을 이용해서 blog 테이블에서 칼럼 전부와 blog_content 테이블에서 content 테이블을 불러온다
// export async function readBlogById(id: string) {
//   const supabase = await createClient();

//   const result = await supabase
//     .from("blog")
//     .select("*, blog_content(content)")
//     .eq("id", id)
//     .single();

//   return JSON.stringify(result);
// }

// // Edit
// export async function updateBlogDetailById(
//   id: string,
//   data: BlogFormSchemaType
// ) {
//   const supabase = await createClient();

//   // 1. content와 나머지 데이터 분리 (createBlog와 동일한 패턴)
//   const { content, ...blog } = data;

//   // 2. blog 테이블 업데이트
//   const resultBlog = await supabase
//     .from("blog")
//     .update({
//       ...blog,
//       image_url: blog.image_url || "", // createBlog와 일관성 유지
//     })
//     .eq("id", id);

//   if (resultBlog.error) {
//     return JSON.stringify(resultBlog);
//   }

//   // 3. blog_content 테이블 업데이트
//   const resultContent = await supabase
//     .from("blog_content")
//     .update({ content: content })
//     .eq("id", id);

//   if (resultContent.error) {
//     return JSON.stringify(resultContent);
//   }

//   revalidatePath("/ko/admin-dashboard");
//   return JSON.stringify(resultContent);
// }
