import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Crown } from "lucide-react";
import { CourseCardProps } from "@/types/dashboard";

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

export const CourseCard = ({
  title,
  description,
  date,
  imageUrl,
  badges,
}: CourseCardProps) => {
  return (
    <>
      <Card className="md:w-[450px] lg:w-[700px] aspect-[21/4] border-1 p-0 gap-0">
        <div className="flex flex-row items-center gap-0 md:gap-4 h-full p-2 md:p-4">
          <div className="hidden sm:block flex-shrink-0">
            <Image
              src={imageUrl}
              alt={title}
              width={60}
              height={60}
              className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-cover rounded-md"
            />
          </div>
          <div className="flex flex-col gap-1 sm:gap-2 flex-1 min-w-0 h-full">
            <div className="flex flex-row items-center justify-between">
              <CardTitle className="font-semibold text-[14px] text-base-primary line-clamp-1 flex-1 min-w-0">
                {title}
              </CardTitle>
              <div className="flex flex-row gap-1 sm:gap-2 ml-2 flex-shrink-0">
                {items.map((item) => (
                  <div key={item.title} className="flex flex-row items-center">
                    {/* Light mode icon */}
                    <Image
                      src={item.iconLight}
                      alt={item.title}
                      width={16}
                      height={16}
                      className="block dark:hidden w-3 h-3 sm:w-4 sm:h-4"
                    />
                    {/* Dark mode icon */}
                    <Image
                      src={item.iconDark}
                      alt={item.title}
                      width={16}
                      height={16}
                      className="hidden dark:block w-3 h-3 sm:w-4 sm:h-4"
                    />
                  </div>
                ))}
              </div>
            </div>
            <CardContent className="p-0 text-[12px] text-base-secondary line-clamp-2 flex-1">
              {description}
            </CardContent>
            <CardFooter className="p-0 flex flex-row justify-between items-end mt-auto">
              <div className="flex items-center gap-2">
                {/* 뱃지들이 있을 때만 표시 */}
                {(badges?.isImportant || badges?.isPremium) && (
                  <>
                    {/* 중요 뱃지 */}
                    {badges?.isImportant && (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1 py-0 h-auto flex items-center gap-1 bg-muted text-base-secondary border-border"
                      >
                        <Star className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
                        중요
                      </Badge>
                    )}

                    {/* 프리미엄 뱃지 */}
                    {badges?.isPremium && (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1 py-0 h-auto flex items-center gap-1 bg-muted text-base-secondary border-border"
                      >
                        <Crown className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
                        프리미엄
                      </Badge>
                    )}
                  </>
                )}
              </div>
              <p className="text-[10px] text-base-secondary">{date}</p>
            </CardFooter>
          </div>
        </div>
      </Card>
    </>
  );
};

export default CourseCard;
