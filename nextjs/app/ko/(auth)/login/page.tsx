import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LoginForm from "@/components/(KOR)/(login)/LoginForm";

// 로그인 페이지에 오면 이미 로그인 되어있는 경우 메인 페이지로 리다이렉트
export default async function LoginPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (data.user) {
    redirect("/ko/");
  }

  return <LoginForm />;
}
