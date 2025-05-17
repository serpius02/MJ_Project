import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function SkeletonCard() {
  return (
    <main className="w-full min-h-screen flex justify-center items-center">
      <Card className="flex flex-col w-[400px]">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Skeleton className="h-8 w-[200px]" />
          </div>
          <Skeleton className="h-8 w-full" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Skeleton className="h-72 w-full rounded-xl" />
            <Skeleton className="h-9 w-full" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center items-center mt-2 relative h-10">
          <div className="absolute left-1/2 -translate-x-1/2">
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-4"
            />
          </div>
          <div className="absolute right-1/2 translate-x-[-30px]">
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="absolute left-1/2 translate-x-[30px]">
            <Skeleton className="h-5 w-16" />
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
