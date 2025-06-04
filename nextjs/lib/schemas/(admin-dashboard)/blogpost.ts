import { z } from "zod";

// 블로그 폼 스키마 (폼 데이터를 입력할 때의 유효성 검사)
export const BlogFormSchema = z
  .object({
    title: z.string().min(2, {
      message: "제목은 최소 2자 이상이어야 합니다.",
    }),
    content: z.string().min(2, {
      message: "내용은 최소 2자 이상이어야 합니다.",
    }),
    image_url: z
      .string()
      .url({ message: "이미지 주소가 올바르지 않습니다." })
      .optional()
      .or(z.literal("")),
    is_published: z.boolean(),
    is_premium: z.boolean(),
  })
  .refine(
    (data) => {
      const image_url = data.image_url;
      if (image_url) {
        try {
          const url = new URL(image_url);
          return url.hostname === "images.unsplash.com";
        } catch {
          return false;
        }
      }
      return true;
    },
    {
      message: "현재로서는 unsplash의 이미지만 업로드 할 수 있습니다.",
      path: ["image_url"],
    }
  );

export type BlogFormSchemaType = z.infer<typeof BlogFormSchema>;
