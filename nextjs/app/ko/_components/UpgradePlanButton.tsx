import { Button } from "@/components/ui/button";
import Icon from "@/components/Icon";

// TODO: 구독 및 여러 버튼 기능 추가
const UpgradePlanButton = () => {
  return (
    <Button className="flex items-center gap-2 font-nanum text-primary-foreground shrink-0 whitespace-nowrap min-w-[110px] px-4 group text-sm h-10 rounded-full">
      <Icon
        name="crown"
        className="w-4 h-4 transition-transform duration-200 group-hover:scale-120"
      />
      프리미엄
    </Button>
  );
};

export default UpgradePlanButton;
