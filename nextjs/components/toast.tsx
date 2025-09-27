// components/Toast.tsx
import { Toaster } from "sonner";
import Icon from "@/components/Icon";

export const Toast = () => {
  return (
    <Toaster
      richColors
      position="top-center"
      duration={2000}
      // 전역 아이콘 설정
      icons={{
        success: <Icon name="success" className="w-4 h-4" />,
        error: <Icon name="error" className="w-4 h-4" />,
        warning: <Icon name="warning" className="w-4 h-4" />,
        info: <Icon name="info" className="w-4 h-4" />,
        loading: <Icon name="loader" className="w-4 h-4 animate-spin" />,
      }}
      toastOptions={{
        style: {
          borderRadius: "8px",
          fontSize: "14px",
          padding: "12px 16px",
        },
        classNames: {
          toast: "backdrop-blur-sm shadow-lg",
          title: "font-nanum font-medium text-sm !important",
          description: "font-nanum text-xs opacity-80 !important",
        },
      }}
    />
  );
};
