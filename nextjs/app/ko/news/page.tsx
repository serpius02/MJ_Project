import React from "react";
// import NewsBanner from "@/components/(KOR)/(news)/NewsBanner";
// import { readBlogs } from "@/lib/actions/(admin-dashboard)/blog";
import TrendingNewsCarousel from "@/components/(KOR)/(news)/TrendingNewsCarousel";

const NewsPage = async () => {
  // const { data: blogs } = await readBlogs();

  return (
    <div className="flex flex-col max-w-7xl mx-auto mt-10">
      <h1 className="font-inter font-bold text-2xl ml-2 mb-2">최신 뉴스</h1>
      <TrendingNewsCarousel />
      {/* <NewsBanner /> */}
    </div>
  );
};

export default NewsPage;
