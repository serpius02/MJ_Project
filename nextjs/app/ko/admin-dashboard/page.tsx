import BlogTable from "@/components/(KOR)/(admin-dashboard)/BlogTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="px-4 mt-4 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-base-primary text-[21px]">블로그</h1>
        <Link href="/ko/admin-dashboard/blog/create">
          <Button
            variant="outline"
            className="flex items-center gap-1 text-base-primary shrink-0 whitespace-nowrap min-w-[100px] px-4 group text-[14px]"
          >
            생성하기
            <Plus
              size={16}
              className="w-4 h-4 text-base-primary transition-transform duration-200 group-hover:scale-110"
            />
          </Button>
        </Link>
      </div>
      <BlogTable />
    </div>
  );
}
