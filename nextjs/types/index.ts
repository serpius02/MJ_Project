export type BlogDetail = {
  id: string;
  title: string;
  image_url: string | null;
  is_premium: boolean;
  is_published: boolean;
  created_at: string;
  blog_content: {
    content: string;
  };
};
