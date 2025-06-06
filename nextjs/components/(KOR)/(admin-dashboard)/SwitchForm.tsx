"use client";

import { Switch } from "@/components/ui/switch";
import React from "react";
import { toast } from "sonner";

// TODO: toast 메세지 스타일링
export default function SwitchForm({
  checked,
  onToggle,
  name,
}: {
  checked: boolean;
  onToggle: () => Promise<string>;
  name: string;
}) {
  // Form 이벤트 발생시에 페이지 새로고침을 방지하면서 동시에 토스트 메세지 출력
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error } = JSON.parse(await onToggle());

    if (error) {
      toast.error(
        <span className="font-inter text-sm">
          {name} 상태 변경에 실패했습니다.
        </span>,
        {
          description: (
            <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
              <code
                className="text-white"
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
    } else {
      toast.success(
        <span className="font-inter text-sm">
          {name} 상태가 변경되었습니다.
        </span>,
        {
          description: (
            <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
              <code
                className="text-white"
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                }}
              >
                <span className="font-inter text-sm">
                  {name} 상태가 성공적으로 변경되었습니다.
                </span>
              </code>
            </pre>
          ),
        }
      );
    }
  };
  return (
    <form onSubmit={onSubmit}>
      <Switch checked={checked} type="submit" />
    </form>
  );
}
