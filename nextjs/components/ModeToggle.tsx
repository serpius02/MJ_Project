"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import Icon from "@/components/Icon";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full border-secondary hover:border-secondary/80 w-10 h-10 group"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Icon
        name="sun"
        className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 group-hover:scale-105"
      />
      <Icon
        name="moon"
        className="size-5 absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 dark:group-hover:scale-105"
      />
      <span className="sr-only">다크/라이트 테마 변경</span>
    </Button>
  );
}
