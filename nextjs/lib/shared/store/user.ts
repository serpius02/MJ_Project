import { create } from "zustand";
import { User } from "@supabase/supabase-js";

// getSession과 getUser로 데이터를 받을 때 데이터가 없을 경우 undefined 인지 null인지 확인
interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
}

const useUser = create<UserState>((set) => ({
  user: null,
  setUser: (user: User | null) => set({ user }),
}));

export default useUser;
