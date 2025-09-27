import { cn } from "@/lib/utils";

interface IndicatorProps {
  color: string;
  className?: string;
}

export const Indicator = ({ color, className }: IndicatorProps) => {
  return (
    <span
      className={cn("inline-block h-1 w-1 rounded-full", className)}
      style={{ backgroundColor: color || "currentColor" }} // color prop이 없으면 현재 텍스트 색상을 따름
    />
  );
};
