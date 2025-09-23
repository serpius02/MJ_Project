import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Indicator } from "./Indicator";
import { NavItem } from "./FloatingNavBar";
import { motion } from "motion/react";
import { AuroraBackground } from "./AuroraBackground";

interface MobileMenuProps {
  navItems: NavItem[];
  onClose: () => void;
}

export default function MobileMenu({ navItems, onClose }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from(menuRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: "power2.out",
    });
  }, []);

  const handleLinkClick = () => {
    gsap.to(menuRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: "power2.in",
      onComplete: onClose,
    });
  };

  return (
    <AuroraBackground className="z-45 items-start justify-start">
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.1,
          duration: 0.5,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-8 items-start justify-center pl-10 pt-100 w-full max-w-md"
      >
        {navItems.map((item, index) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="w-full" // 🔧 전체 너비 사용
          >
            <Link
              href={item.href}
              onClick={handleLinkClick}
              className="flex items-center gap-4 whitespace-nowrap font-nanum font-bold text-secondary-foreground text-3xl hover:text-primary transition-colors w-full"
            >
              <Indicator color={item.color} className="h-2 w-2 flex-shrink-0" />
              {item.name}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </AuroraBackground>
  );
}
