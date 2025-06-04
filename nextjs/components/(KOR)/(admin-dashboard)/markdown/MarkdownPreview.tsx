import { cn } from "@/lib/utils";
import React from "react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.min.css";
import CopyButton from "@/components/(KOR)/(admin-dashboard)/markdown/CopyButton";
import { icons } from "@/lib/icons";

// TODO: 추가 스타일링이 필요함
export default function MarkdownPreview({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div className={cn("h-full overflow-y-auto", className)}>
      <Markdown
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ ...props }) => (
            <h1 {...props} className="text-3xl font-bold" />
          ),
          h2: ({ ...props }) => (
            <h2 {...props} className="text-2xl font-bold" />
          ),
          h3: ({ ...props }) => <h3 {...props} className="text-xl font-bold" />,
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            if (match?.length) {
              const isMatch = icons.hasOwnProperty(match[1]);

              if (isMatch) {
                const Icon = icons[match[1] as keyof typeof icons];
                const id = (Math.floor(Math.random() * 100) + 1).toString();

                return (
                  <div className="text-gray-300 border rounded-md">
                    <div className="px-5 py-2 border-b flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{props.node?.data?.meta}</span>
                      </div>
                      <CopyButton id={id} />
                    </div>
                    <div className="overflow-x-auto w-full">
                      <div className="p-5" id={id}>
                        {children}
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <code className="bg-zinc-700 rounded-md px-2">
                    {children}
                  </code>
                );
              }
            }
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
