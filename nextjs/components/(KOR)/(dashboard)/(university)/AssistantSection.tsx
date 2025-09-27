import React from "react";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const AssistantSection = () => {
  return (
    <div className="bg-card border border-border rounded-lg shadow-lg flex flex-col h-full">
      {/* 헤더 영역 - padding 적용 */}
      <div className="px-6 pt-4 pb-1">
        <h2 className="font-semibold text-[16px] text-base-primary mb-2">
          어시스턴트
        </h2>
      </div>

      {/* Separator - 전체 너비 차지 */}
      <Separator />

      {/* 콘텐츠 영역 - padding 적용 */}
      <div className="flex-1 h-0 px-6 pb-6 pt-4">
        <ScrollArea className="h-full pr-4">
          <div className="flex flex-col gap-3 sm:gap-4">어시스턴트</div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default AssistantSection;
