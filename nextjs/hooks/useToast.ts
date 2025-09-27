// hooks/useToast.ts
import { toast } from "sonner";

interface ToastOptions {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  style?: React.CSSProperties;
  className?: string;
  unstyled?: boolean;
}

export const useToast = () => {
  const addToast = ({
    message,
    type = "success",
    duration,
    description,
    action,
    style,
    className,
    unstyled = false,
  }: ToastOptions) => {
    const toastOptions = {
      duration,
      description,
      action,
      style,
      className: `${className || ""} ${getTypeClassName(type)}`,
      unstyled,
      classNames: {
        toast: `${className || ""} ${getTypeClassName(type)}`,
        actionButton: "bg-primary text-primary-foreground hover:bg-primary/90",
        cancelButton: "bg-muted text-muted-foreground hover:bg-muted/80",
      },
    };

    switch (type) {
      case "error":
        toast.error(message, toastOptions);
        break;
      case "warning":
        toast.warning(message, toastOptions);
        break;
      case "info":
        toast.info(message, toastOptions);
        break;
      default:
        toast.success(message, toastOptions);
        break;
    }
  };

  return { addToast };
};

// richColors와 충돌하지 않도록 수정
const getTypeClassName = (type: string) => {
  // richColors를 사용하므로 추가적인 보더만 적용
  switch (type) {
    case "error":
      return "border-status-destructive";
    case "warning":
      return "border-status-alert";
    case "info":
      return "border-status-info";
    case "success":
    default:
      return "border-status-success";
  }
};
