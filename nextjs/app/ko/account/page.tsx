import React from "react";
import ProfileCard from "./_components/profile/ProfileCard";
// import { Suspense } from "react";

const AccountPage = () => {
  return (
    <>
      <div className="flex flex-col gap-4 mt-12">
        {/* <Suspense fallback={<ProfileSkeleton />}> */}
        <ProfileCard />
        {/* </Suspense> */}
        {/* <Suspense fallback={<SubscriptionSkeleton />}>
          <SubscriptionCard />
        </Suspense> */}
      </div>
      {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl">
          <span>어카운트 홈</span>
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div>
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" /> */}
    </>
  );
};

export default AccountPage;
