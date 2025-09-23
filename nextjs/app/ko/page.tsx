import React from "react";
// import { Metadata } from "next";

// // TODO: 메타데이터 수정 필요 (특히 나중에는 페이지마다 동적 metadata 및 OG 이미지 파일)
// export const metadata: Metadata = {
//   title: "메인 페이지",
//   description: "메인 페이지",
//   openGraph: {
//     images: ["/images/logo.png"],
//   },
// };

// TODO: 메인 페이지 구현
const KoPage = () => {
  return (
    <>
      {/* 메인 페이지 */}
      <div className="min-h-screen flex flex-col max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto justify-center items-center p-6 font-bold text-4xl text-title-primary">
          제품 소개
        </div>
      </div>
    </>
  );
};

export default KoPage;
