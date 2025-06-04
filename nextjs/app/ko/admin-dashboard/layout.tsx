import React from "react";
import Navlinks from "@/components/(KOR)/(admin-dashboard)/Navlinks";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col max-w-7xl mx-auto mt-4">
      <Navlinks />
      {children}
    </div>
  );
}
