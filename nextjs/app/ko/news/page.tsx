import React from "react";
import NewsBanner from "@/components/(KOR)/(news)/NewsBanner";

const NewsPage = () => {
  return (
    <div className="flex flex-col max-w-7xl mx-auto mt-10">
      <h1 className="font-pretendard text-4xl">최신 뉴스</h1>
      <NewsBanner />
    </div>
  );
};

export default NewsPage;
