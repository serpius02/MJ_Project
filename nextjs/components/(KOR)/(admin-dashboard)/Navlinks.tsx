"use client";

import React from "react";
import { Table2, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
export default function Navlinks() {
  const pathname = usePathname();
  const links = [
    {
      href: "/ko/admin-dashboard",
      text: "대쉬보드",
      icon: <Table2 size={16} />,
    },
    {
      href: "/ko/admin-dashboard/users",
      text: "유저 관리",
      icon: <User size={16} />,
    },
  ];

  return (
    <div className="flex flex-col gap-2 pb-2 px-4">
      <div className="flex items-center gap-5">
        {links.map(({ href, text, icon }, index) => (
          <Link
            href={href}
            key={index}
            className={cn(
              "text-title-primary font-inter text-sm flex items-center gap-1 hover:underline transition-all",
              { "text-blue-500 font-bold underline": pathname === href }
            )}
          >
            {icon}
            {text}
          </Link>
        ))}
      </div>
      <Separator className="w-full h-px bg-gray-200" />
    </div>
  );
}
