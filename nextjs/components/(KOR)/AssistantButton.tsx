"use client";

import { MessageCircle, HelpCircle, Bot, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const AIOptions = [
  {
    icon: <HelpCircle className="h-4 w-4" />,
    tooltip: "문제해결",
    action: () => console.log("문제 해결"),
  },
  {
    icon: <MessageCircle className="h-4 w-4" />,
    tooltip: "질문하기",
    action: () => console.log("AI 질문하기"),
  },
];

function AIOptionButton({
  icon,
  action,
}: {
  icon: React.ReactNode;
  action: () => void;
}) {
  return (
    <button
      onClick={action}
      className="p-2 group hover:bg-muted-foreground/10 rounded-full cursor-pointer flex flex-col items-center justify-center transition-all duration-300 ease-in-out"
    >
      {icon}
    </button>
  );
}

export default function AssistantButton() {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isExpanded) {
    // 확장된 상태: 세로 배치 (문제해결 → 질문하기 → 닫기)
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="text-foreground border bg-background rounded-4xl shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-90 duration-500 slide-in-from-bottom-4 ease-out">
          {/* 상단: AI 옵션 버튼들을 세로로 배치 */}
          <div className="flex flex-col justify-center items-center px-0.5 py-1 divide-y divide-border">
            {AIOptions.map((option, index) => (
              <div
                key={option.tooltip}
                className="animate-in fade-in-0 slide-in-from-bottom-2 duration-400 ease-out w-full flex justify-center"
                style={{
                  animationDelay: `${100 + index * 80}ms`,
                  animationFillMode: "both",
                }}
              >
                <AIOptionButton
                  icon={option.icon}
                  action={() => {
                    option.action();
                    setIsExpanded(false); // 옵션 선택 시 닫기
                  }}
                />
              </div>
            ))}
          </div>

          {/* 하단: 닫기 버튼 */}
          <div
            className="border-t border-border animate-in fade-in-0 slide-in-from-bottom-2 duration-400 ease-out"
            style={{ animationDelay: "260ms", animationFillMode: "both" }}
          >
            <button
              onClick={() => setIsExpanded(false)}
              className="w-full py-1 hover:bg-muted/50 transition-all duration-300 ease-in-out flex justify-center items-center"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 기본 상태: 봇 버튼만 표시
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        variant="outline"
        className="rounded-full transition-all duration-300 ease-in-out hover:scale-110 h-[38px] w-[38px] bg-gradient-to-bl from-purple-500 via-purple-400 to-blue-600 hover:from-purple-600 hover:via-purple-500 hover:to-blue-700 text-white shadow-lg hover:shadow-xl active:shadow-md"
        onClick={() => setIsExpanded(true)}
      >
        <Bot className={"size-5"} />
      </Button>
    </div>
  );
}
