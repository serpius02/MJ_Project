import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CopyButton({ id }: { id: string }) {
  const [onCopy, setOnCopy] = useState(false);
  const [onDone, setOnDone] = useState(false);

  const handleCopy = async () => {
    const text = document.getElementById(id)?.textContent;
    try {
      await navigator.clipboard.writeText(text!);
      setOnCopy(true);
    } catch {
      console.error("텍스트를 복사하는 중 오류가 발생했습니다.");
    }
  };
  return (
    <div
      className="flex text-[14px] items-center gap-2 p-2 group relative cursor-pointer"
      onClick={handleCopy}
    >
      <Check
        className={cn(
          "transition-all w-5 h-5 text-success",
          onDone ? "scale-100" : "scale-0"
        )}
        onTransitionEnd={() => {
          setTimeout(() => {
            setOnDone(false);
            setOnCopy(false);
          }, 500);
        }}
      />
      <div className="h-full w-full absolute top-0 left-0 flex items-center justify-center">
        <Copy
          className={cn(
            "w-4 h-4 transition-all duration-300",
            onCopy ? "scale-0" : "scale-100"
          )}
          onTransitionEnd={() => {
            if (onCopy) {
              setOnDone(true);
            }
          }}
        />
      </div>
    </div>
  );
}
