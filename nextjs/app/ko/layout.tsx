import { ConditionalNavBar } from "@/app/ko/_components/ConditionalNavBar";
import React from "react";
import SessionProvider from "@/components/ui/session-provider";
import AIAssistantButton from "@/components/(KOR)/AssistantButton";

const KoLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
      <header>
        {/* 조건부 네비바 - 클라이언트 컴포넌트에서 pathname 처리 */}
        <ConditionalNavBar />

        {/* children이 남은 모든 공간을 차지하도록 합니다. */}
        <div className="flex-1">{children}</div>

        <SessionProvider />
        {/* TODO: AI 도우미 버튼 기능 추가 - 모든 한국어 페이지에서 표시 */}
        <AIAssistantButton />
      </header>
    </div>
  );
};

export default KoLayout;
