import React from "react";
// import { readBlogs } from "@/lib/actions/(admin-dashboard)/blog";
import TrendingNewsCarousel from "@/components/(KOR)/(news)/TrendingNewsCarousel";
import NewsTab from "@/components/(KOR)/(news)/NewsTab";

// TODO: 여기서 뉴스 데이터를 다 가져와야!

const NewsPage = async () => {
  // const { data: blogs } = await readBlogs();

  return (
    <div className="flex flex-col max-w-7xl mx-auto mt-10">
      <h1 className="font-inter font-bold text-2xl ml-2 mb-2">최신 뉴스</h1>
      <TrendingNewsCarousel />
      <NewsTab />
    </div>
  );
};

export default NewsPage;
