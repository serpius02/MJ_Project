"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import Icon from "@/components/Icon";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  showText?: boolean;
  text?: string;
  textClassName?: string;
}

const Logo = ({
  width = 32,
  height = 32,
  className = "",
  showText = false,
  text = "엠제이에듀",
  textClassName = "font-nanum font-medium whitespace-pre text-black dark:text-white",
}: LogoProps) => {
  const logoRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  // 로고 애니메이션
  useEffect(() => {
    if (logoRef.current) {
      // 전체 로고 페이드인
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.2)",
        }
      );
    }
  }, []);

  // 텍스트 애니메이션
  useEffect(() => {
    if (textRef.current && showText) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, x: -10 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          ease: "power2.out",
          delay: 0.3,
        }
      );
    }
  }, [showText]);

  // showText가 false일 때는 Icon만 반환 (추가 래퍼 없이)
  if (!showText) {
    return (
      <Icon
        ref={logoRef}
        name="logo"
        className={`${className} transition-all duration-200 hover:scale-110 flex-shrink-0`}
        style={{
          width: width,
          height: height,
          opacity: 0, // GSAP이 제어하도록 초기값 설정
          display: "block",
        }}
      />
    );
  }

  // showText가 true일 때만 래퍼 div 사용
  return (
    <div className="flex items-center gap-2">
      <Icon
        ref={logoRef}
        name="logo"
        className={`${className} transition-all duration-200 hover:scale-110 block`}
        style={{
          width: width,
          height: height,
          opacity: 0, // GSAP이 제어하도록 초기값 설정
        }}
      />

      <span ref={textRef} className={textClassName} style={{ opacity: 0 }}>
        {text}
      </span>
    </div>
  );
};

export default Logo;
