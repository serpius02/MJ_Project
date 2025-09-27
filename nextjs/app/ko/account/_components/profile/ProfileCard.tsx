import React from "react";

import {
  Card,
  CardContent,
  // CardDescription,
  // CardFooter,
  // CardHeader,
  // CardTitle,
} from "@/components/ui/card";
import Icon from "@/components/Icon";
import { getAuthenticatedUserWithProfile } from "@/app/ko/(auth)/_data/queries";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfileCard = async () => {
  const result = await getAuthenticatedUserWithProfile();

  if (!result.success) {
    return null;
  }

  const { profile } = result.data;

  return (
    <Card className="font-nanum rounded-md">
      <CardContent className="px-2 mx-4">
        {/* 상단 아이콘들 */}
        <div className="flex justify-between items-center">
          <span className="font-bold text-2xl">마이페이지</span>
          <Button
            variant="ghost"
            size="icon"
            aria-label="플랜 변경"
            className="p-2 relative z-50 transition-transform duration-200 hover:scale-110"
          >
            <Icon name="subscription" className="size-6" />
          </Button>
        </div>
        <Separator className="my-1" />
        {/* 프로필 아바타 */}
        <div className="mb-4">
          <Avatar className="w-20 h-20 bg-white/90 shadow-lg">
            <AvatarImage src="" alt="Alex Smith" />
            <AvatarFallback className="text-3xl font-bold text-gray-800 bg-white/90">
              {profile?.display_name
                ?.split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
