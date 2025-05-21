import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

// TODO: 구독 및 여러 버튼 기능 추가
const UpgradePlanButton = () => {
  return (
    <Button
      variant="ghost"
      className="flex items-center gap-1 font-inter text-title-primary shrink-0 whitespace-nowrap min-w-[110px] px-4 group"
    >
      <Gift className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
      플랜 업그레이드
    </Button>
  );
};

export default UpgradePlanButton;
