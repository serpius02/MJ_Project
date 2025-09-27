"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteBlogById } from "@/app/ko/admin-dashboard/_actions/blog";
import { toast } from "sonner";

// TODO: 여기도 toast 메시지 스타일링
export default function DeleteAlert({ blogId }: { blogId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      const result = await deleteBlogById(blogId);
      const { error } = JSON.parse(result);
      if (error) {
        toast.error("블로그 삭제에 실패했습니다.");
      } else {
        toast.success("블로그가 성공적으로 삭제되었습니다.");
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Trash className="w-4 h-4" />
          삭제하기
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            이 작업은 되돌릴 수 없습니다. 이 작업은 블로그를 영구적으로 삭제하고
            서버에서 데이터를 제거합니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <form onSubmit={handleSubmit}>
            <AlertDialogAction disabled={isPending} type="submit">
              {isPending ? "삭제중..." : "계속"}
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
