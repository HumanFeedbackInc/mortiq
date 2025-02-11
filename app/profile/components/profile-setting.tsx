"use client";

import * as React from "react";
import {Card, CardBody} from "@heroui/card";
import {Avatar} from "@heroui/avatar";
import {Icon} from "@iconify/react";
import {Button, Badge, Input, Spacer, Textarea} from "@heroui/react";
import {cn} from "@heroui/react";
import { DashboardUserData } from "../page";

interface ProfileSettingCardProps {
  className?: string;
  dashboardUserData: DashboardUserData;
}

const ProfileSetting = React.forwardRef<HTMLDivElement, ProfileSettingCardProps>(
  ({className, dashboardUserData, ...props}, ref) => (
    <div ref={ref} className={cn("p-2", className)} {...props}>
      {/* Profile */}
      <div>
        <p className="text-base font-medium text-default-700">Profile</p>
        <p className="mt-1 text-sm font-normal text-default-400">
          This displays your public profile on the site.
        </p>
        <Card className="mt-4 bg-default-100" shadow="none">
          <CardBody>
            <div className="flex items-center gap-4">
              <Badge
                showOutline
                classNames={{
                  badge: "w-5 h-5",
                }}
                content={
                  <Button
                    isIconOnly
                    className="h-5 w-5 min-w-5 bg-background p-0 text-default-500"
                    radius="full"
                    size="sm"
                    variant="bordered"
                  >
                    <Icon className="h-[9px] w-[9px]" icon="solar:pen-linear" />
                  </Button>
                }
                placement="bottom-right"
                shape="circle"
              >
                <Avatar
                  className="h-16 w-16"
                  src={dashboardUserData.userData?.profilePicture || dashboardUserData.pendingUserData?.profilePicture || ''}
                />
              </Badge>
              <div>
                <p className="text-sm font-medium text-default-600">{dashboardUserData.userData?.firstName || dashboardUserData.pendingUserData?.firstName} {dashboardUserData.userData?.lastName || dashboardUserData.pendingUserData?.lastName}</p>
                <p className="text-xs text-default-400">{dashboardUserData.userData?.role || dashboardUserData.pendingUserData?.role}</p>
                <p className="mt-1 text-xs text-default-400">{dashboardUserData.userData?.email || dashboardUserData.pendingUserData?.email || dashboardUserData.user.data.user?.email}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      <Spacer y={4} />
      {/* Title */}
      <div>
        <p className="text-base font-medium text-default-700">Title</p>
        <p className="mt-1 text-sm font-normal text-default-400">Set your current role.</p>
        <Input className="mt-2" placeholder="e.g Customer Support" />
      </div>
      <Spacer y={2} />
      {/* Location */}
      <div>
        <p className="text-base font-medium text-default-700">Location</p>
        <p className="mt-1 text-sm font-normal text-default-400">Set your current location.</p>
        <Input className="mt-2" placeholder="e.g Toronto, ON" />
      </div>
      <Spacer y={4} />
      {/* Biography */}
      <div>
        <p className="text-base font-medium text-default-700">Biography</p>
        <p className="mt-1 text-sm font-normal text-default-400">
          Specify your present whereabouts.
        </p>
        <Textarea
          className="mt-2"
          classNames={{
            input: cn("min-h-[115px]"),
          }}
          placeholder="e.g., 'Toronto, ON - I'm a software engineer with a passion for building scalable and efficient systems.'"
        />
      </div>
      <Button className="mt-4 bg-default-foreground text-background" size="sm">
        Update Profile
      </Button>
    </div>
  ),
);

ProfileSetting.displayName = "ProfileSetting";

export default ProfileSetting;
