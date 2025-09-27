"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-40 transition-bg flex flex-col items-center justify-center bg-zinc-50 text-slate-950 dark:bg-zinc-900",
        className
      )}
      {...props}
    >
      <div
        className="absolute inset-0 overflow-hidden"
        style={
          {
            // 🧡 주황색 계열로 변경
            "--aurora":
              "repeating-linear-gradient(100deg,#F95738_10%,#FF6B47_15%,#FF7F5C_20%,#FF9370_25%,#E8471C_30%)",
            "--dark-gradient":
              "repeating-linear-gradient(100deg,#000_0%,#000_7%,transparent_10%,transparent_12%,#000_16%)",
            "--white-gradient":
              "repeating-linear-gradient(100deg,#fff_0%,#fff_7%,transparent_10%,transparent_12%,#fff_16%)",

            // 🧡 주황색 변수들 정의
            "--orange-600": "#E8471C", // 어두운 주황
            "--orange-500": "#F95738", // 기본 주황
            "--orange-400": "#FF6B47", // 밝은 주황
            "--orange-300": "#FF7F5C", // 더 밝은 주황
            "--orange-200": "#FF9370", // 연한 주황
            "--black": "#000",
            "--white": "#fff",
            "--transparent": "transparent",
          } as React.CSSProperties
        }
      >
        <div
          className="absolute inset-0 overflow-hidden"
          style={
            {
              // 🧡 동일한 주황색 그라데이션
              "--aurora":
                "repeating-linear-gradient(100deg,#F95738_10%,#FF6B47_15%,#FF7F5C_20%,#FF9370_25%,#E8471C_30%)",
              "--dark-gradient":
                "repeating-linear-gradient(100deg,#000_0%,#000_7%,transparent_10%,transparent_12%,#000_16%)",
              "--white-gradient":
                "repeating-linear-gradient(100deg,#fff_0%,#fff_7%,transparent_10%,transparent_12%,#fff_16%)",

              "--orange-600": "#E8471C",
              "--orange-500": "#F95738",
              "--orange-400": "#FF6B47",
              "--orange-300": "#FF7F5C",
              "--orange-200": "#FF9370",
              "--black": "#000",
              "--white": "#fff",
              "--transparent": "transparent",
            } as React.CSSProperties
          }
        >
          <div
            className={cn(
              `after:animate-aurora pointer-events-none absolute -inset-[10px] [background-image:var(--white-gradient),var(--aurora)] [background-size:300%,_200%] [background-position:50%_50%,50%_50%] opacity-50 blur-[10px] invert filter will-change-transform [--aurora:repeating-linear-gradient(100deg,var(--orange-500)_10%,var(--orange-400)_15%,var(--orange-300)_20%,var(--orange-200)_25%,var(--orange-600)_30%)] [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)] [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] after:[background-size:200%,_100%] after:[background-attachment:fixed] after:mix-blend-difference after:content-[""] dark:[background-image:var(--dark-gradient),var(--aurora)] dark:invert-0 after:dark:[background-image:var(--dark-gradient),var(--aurora)]`,

              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
            )}
          ></div>
        </div>
      </div>
      {children}
    </div>
  );
};
