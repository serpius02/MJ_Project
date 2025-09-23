import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Star, Crown } from "lucide-react";
import { DogEarCardProps } from "@/types/dashboard";

const items = [
  {
    title: "happy",
    iconLight: "/icons/Happy/light.svg",
    iconDark: "/icons/Happy/dark.svg",
    iconLightHighlight: "/icons/Happy/light_highlight.svg",
    iconDarkHighlight: "/icons/Happy/dark_highlight.svg",
    iconOffset: "-translate-y-0.5",
  },
  {
    title: "angry",
    iconLight: "/icons/Angry/light.svg",
    iconDark: "/icons/Angry/dark.svg",
    iconLightHighlight: "/icons/Angry/light_highlight.svg",
    iconDarkHighlight: "/icons/Angry/dark_highlight.svg",
    iconOffset: "translate-y-0",
  },
  {
    title: "bookmark",
    iconLight: "/icons/Bookmark/light.svg",
    iconDark: "/icons/Bookmark/dark.svg",
    iconLightHighlight: "/icons/Bookmark/light_highlight.svg",
    iconDarkHighlight: "/icons/Bookmark/dark_highlight.svg",
    iconOffset: "translate-y-0",
  },
] as const;

// TODO: responsive한 디자인으로 변경해야!

export const DogEarCard = ({
  title,
  description,
  category,
  date,
  badges,
}: DogEarCardProps) => {
  return (
    <>
      <style>{`
                :root {
                  --fold-size: 50px;
                  --card-radius: 0.75rem;
                  
                  --card-bg-light: oklch(0.97 0 0);
                  --header-bg-light: #f9fafb;
                  --fold-underside-light: #e5e7eb;
                  --shadow-color-light: rgba(0, 0, 0, 0.1);
                  --border-color-light: oklch(0.85 0 0);

                  --card-bg-dark: oklch(0.2293 0.0131 258.37);
                  --header-bg-dark: oklch(0.3 0.01 258);
                  --fold-underside-dark: #4b5563;
                  --shadow-color-dark: rgba(0, 0, 0, 0.2);
                  --border-color-dark: oklch(0.275 0 0);
                }

                .dog-ear-card {
                   background-color: var(--card-bg-light);
                   /* box-shadow로 테두리를 대체하여 레이아웃 밀림 방지 */
                   box-shadow: 0 1px 3px 0 var(--shadow-color-light), 0 0 0 1px var(--border-color-light);
                   border-top-right-radius: 0;
                }
                .dark .dog-ear-card {
                   background-color: var(--card-bg-dark);
                   box-shadow: 0 1px 3px 0 var(--shadow-color-dark), 0 0 0 1px var(--border-color-dark);
                }
                
                .dog-ear-header {
                    position: relative;
                    background-color: var(--header-bg-light);
                    height: var(--fold-size);
                    border-bottom: 1px solid var(--border-color-light);
                    border-top-left-radius: var(--card-radius);
                    border-top-right-radius: 0;
                }
                .dark .dog-ear-header {
                    background-color: var(--header-bg-dark);
                    border-bottom: 1px solid var(--border-color-dark);
                }
                
                .dog-ear-header::before {
                    display: none;
                }

                .dog-ear-header::after {
                    content: '';
                    position: absolute;
                    top: -2px;
                    right: -2px;
                    width: calc(var(--fold-size) + 2px);
                    height: calc(var(--fold-size) + 2px);
                    background: linear-gradient(
                        to left bottom,
                        var(--card-bg-light) 50%,
                        var(--fold-underside-light) 50.1%
                    );
                    border: 0;
                    box-shadow: none;
                    border-bottom-left-radius: 8px;
                    border-top-right-radius: 0;
                }
                .dark .dog-ear-header::after {
                    background: linear-gradient(
                        to left bottom,
                        var(--card-bg-dark) 50%,
                        var(--fold-underside-dark) 50.1%
                    );
                    box-shadow: none;
                }
              `}</style>

      <Card className="w-[700px] aspect-[21/7] dog-ear-card border-1 p-0 gap-0">
        <CardHeader className="dog-ear-header flex flex-row items-center justify-between px-6"></CardHeader>
        <div className="flex flex-col h-full">
          <div className="flex flex-row items-center justify-between mt-4 px-6">
            <CardTitle className="font-semibold text-[16px] text-base-primary line-clamp-1">
              {title}
            </CardTitle>
            <div className="flex flex-row gap-3 mr-1 mt-1">
              {items.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-row items-center gap-2"
                >
                  {/* Light mode icon */}
                  <Image
                    src={item.iconLight}
                    alt={item.title}
                    width={24}
                    height={24}
                    className="block dark:hidden"
                  />
                  {/* Dark mode icon */}
                  <Image
                    src={item.iconDark}
                    alt={item.title}
                    width={24}
                    height={24}
                    className="hidden dark:block"
                  />
                </div>
              ))}
            </div>
          </div>
          <CardContent className="pt-5 text-[14px] text-base-secondary flex-1 min-h-[6rem]">
            <p className="line-clamp-5">{description}</p>
          </CardContent>
          <div>
            <CardFooter className="flex flex-row justify-between mb-4 text-[12px] text-base-secondary">
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-base-secondary font-medium">
                  {category}
                </span>

                {/* 구분선과 뱃지들이 있을 때만 표시 */}
                {(badges?.isImportant || badges?.isPremium) && (
                  <>
                    {/* 구분선 */}
                    <span className="text-[12px] text-base-secondary/50">
                      |
                    </span>

                    {/* 중요 뱃지 */}
                    {badges?.isImportant && (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0.5 h-auto flex items-center gap-1 bg-muted text-base-secondary border-border"
                      >
                        <Star className="h-2.5 w-2.5" />
                        중요
                      </Badge>
                    )}

                    {/* 프리미엄 뱃지 */}
                    {badges?.isPremium && (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0.5 h-auto flex items-center gap-1 bg-muted text-base-secondary border-border"
                      >
                        <Crown className="h-2.5 w-2.5" />
                        프리미엄
                      </Badge>
                    )}
                  </>
                )}
              </div>
              <p className="text-base-secondary">{date}</p>
            </CardFooter>
          </div>
        </div>
      </Card>
    </>
  );
};

export default DogEarCard;
