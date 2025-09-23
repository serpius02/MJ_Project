"use client";

import React, { useState } from "react";
import DogEarCard from "@/components/(KOR)/(dashboard)/DogEarCard";
import { AnimatedTabs } from "./Animated-tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DogEarCardProps } from "@/types/dashboard";

const InsightList = ({ data }: { data: DogEarCardProps[] }) => {
  const [activeTab, setActiveTab] = useState("모두 보기");

  const tabs = [
    { label: "모두 보기", value: "모두 보기" },
    { label: "아이디어", value: "아이디어" },
    { label: "프로젝트", value: "프로젝트" },
  ];

  const renderTabContent = () => {
    // 필터링할 데이터 결정
    let filteredData = data;

    // "모두 보기" 탭이 아닐 때만 카테고리별 필터링
    if (activeTab !== "모두 보기") {
      filteredData = data.filter((item) => item.category === activeTab);
    }

    return (
      <div className="space-y-6 max-h-[100vh]">
        {filteredData.map((item, index) => (
          <div key={index} className="flex justify-center">
            <DogEarCard
              title={item.title}
              description={item.description}
              category={item.category}
              date={item.date}
              badges={item.badges}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg h-full shadow-lg flex flex-col">
      {/* 헤더 영역 - padding 적용 */}
      <div className="px-6 pt-4 pb-1">
        <h2 className="font-semibold text-[16px] text-base-primary mb-2">
          인사이트
        </h2>
      </div>

      {/* Separator - 전체 너비 차지 */}
      <Separator />

      {/* 콘텐츠 영역 - padding 적용 */}
      <div className="flex-1 h-0 px-6 pb-6 pt-4">
        <div className="mb-6">
          <AnimatedTabs
            tabs={tabs}
            defaultValue="모두 보기"
            onTabChange={setActiveTab}
          />
        </div>
        <ScrollArea className="flex-1 pr-4">{renderTabContent()}</ScrollArea>
      </div>
    </div>
  );
};

export default InsightList;
