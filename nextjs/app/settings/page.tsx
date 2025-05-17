import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

// TODO: 개인 설정 페이지 구현
export default async function SettingsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/ko/login");
  }

  return <p>Hello {data.user.email}</p>;
}
