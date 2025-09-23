"use client";

import useUser from "@/lib/shared/store/user";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useCallback } from "react";

export default function SessionProvider() {
  const setUser = useUser((state) => state.setUser);

  const supabase = createClient();

  // Zustand를 사용해 사용자 정보를 읽어오는 함수
  // useCallback을 사용하여 함수를 캐시하여 불필요한 렌더링을 방지
  // readUserSession 함수가 변경되는 경우 (즉, supabase, setUser가 변경되는 경우) 함수를 새로 생성.
  const readUserSession = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  }, [supabase, setUser]);

  useEffect(() => {
    readUserSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user);

      if (event === "SIGNED_IN") {
        // 로그인 시 약간의 지연 후 상태 업데이트
        setTimeout(() => {
          setUser(session?.user ?? null);
        }, 100);
      } else {
        setUser(session?.user ?? null);
      }
    });

    return () => subscription.unsubscribe();
  }, [readUserSession, supabase.auth, setUser]);

  return <></>;
}
