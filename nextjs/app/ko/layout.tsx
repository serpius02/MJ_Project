"use client";

import NavBar from "@/components/(KOR)/NavBar";
import React from "react";

const KoLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <NavBar />
      {children}
    </div>
  );
};

export default KoLayout;
