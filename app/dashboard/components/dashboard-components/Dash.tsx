"use client";

import React from "react";
import { Avatar, Button, ScrollShadow, Spacer, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@heroui/react";
// import UserTableWrapper from "../userTableWrapper";
import { AcmeIcon } from "./acme";
import { items } from "./sidebar-items";
import PendingPropertiesTable from "../pendingProperties/pendingTable";

import UserManagementTables from "../userManagementTables";
import Sidebar from "./sidebar";
import { DashboardDataLists } from "@/app/dashboard/page";
/**
 *  This example requires installing the `usehooks-ts` package:
 * `npm install usehooks-ts`
 *
 * import {useMediaQuery} from "usehooks-ts";
 *
 * 💡 TIP: You can use the usePathname hook from Next.js App Router to get the current pathname
 * and use it as the active key for the Sidebar component.
 *
 * ```tsx
 * import {usePathname} from "next/navigation";
 *
 * const pathname = usePathname();
 * const currentPath = pathname.split("/")?.[1]
 *
 * <Sidebar defaultSelectedKey="home" selectedKeys={[currentPath]} />
 * ```
 */

type ComponentKeys =
  | "home"
  | "pending-users"
  | "pending-properties"
  | "team"
  | "tracker"
  | "analytics"
  | "perks"
  | "expenses"
  | "settings"
  | "shareholders"
  | "note_holders"
  | "transactions_log";

export default function Component({
  dashboardDataLists,
}: {
  dashboardDataLists: DashboardDataLists;
}) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [selectedKey, setSelectedKey] = React.useState<ComponentKeys>("home");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const isCompact = isCollapsed || isMobile;

  const onToggle = React.useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  // Component mapping object
  const componentMap: Record<ComponentKeys, JSX.Element> = {
    home: <div>Home Dashboard</div>,
    "pending-users": (
      <UserManagementTables dashboardDataLists={dashboardDataLists} />
    ),
    "pending-properties": (
      <PendingPropertiesTable
        listingsWithImages={dashboardDataLists.pendingPropertiesList}
      />
    ),
    team: <div>Team Management</div>,
    tracker: <div>Time Tracker</div>,
    analytics: <div>Analytics Dashboard</div>,
    perks: <div>Company Perks</div>,
    expenses: <div>Expense Management</div>,
    settings: <div>Settings Panel</div>,
    shareholders: <div>Shareholders List</div>,
    note_holders: <div>Note Holders Management</div>,
    transactions_log: <div>Transactions History</div>,
  };

  return (
    <div className="flex h-full min-h-[48rem] w-full">
      <div
        className={cn(
          "relative flex h-full w-72 flex-col !border-r-small border-divider p-6 transition-width",
          {
            "w-16 items-center px-2 py-6": isCompact,
          }
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3 px-3",

            {
              "justify-center gap-0": isCompact,
            }
          )}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground">
            <AcmeIcon className="text-background" />
          </div>
          <span
            className={cn("text-small font-bold uppercase opacity-100", {
              "w-0 opacity-0": isCompact,
            })}
          >
            Acme
          </span>
        </div>
        <Spacer y={8} />
        <div className="flex items-center gap-3 px-3">
          <Avatar
            isBordered
            className="flex-none"
            size="sm"
            src="https://i.pravatar.cc/150?u=a04258114e29026708c"
          />
          <div
            className={cn("flex max-w-full flex-col", { hidden: isCompact })}
          >
            <p className="truncate text-small font-medium text-default-600">
              John Doe
            </p>
            <p className="truncate text-tiny text-default-400">
              Product Designer
            </p>
          </div>
        </div>
        <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
          <Sidebar
            defaultSelectedKey="home"
            isCompact={isCompact}
            items={items}
            selectedKeys={[selectedKey]}
            onSelectionChange={(key) => {
              const selectedValue = Array.from(key)[0]?.toString();
              if (selectedValue && selectedValue in componentMap) {
                setSelectedKey(selectedValue as ComponentKeys);
              }
            }}
            onSelect={(key) => {
              if (typeof key !== "string") return;
              if (key in componentMap) {
                setSelectedKey(key as ComponentKeys);
              }
            }}
          />
        </ScrollShadow>
        <Spacer y={2} />
        <div
          className={cn("mt-auto flex flex-col", {
            "items-center": isCompact,
          })}
        >
          <Tooltip
            content="Help & Feedback"
            isDisabled={!isCompact}
            placement="right"
          >
            <Button
              fullWidth
              className={cn(
                "justify-start truncate text-default-500 data-[hover=true]:text-foreground",
                {
                  "justify-center": isCompact,
                }
              )}
              isIconOnly={isCompact}
              startContent={
                isCompact ? null : (
                  <Icon
                    className="flex-none text-default-500"
                    icon="solar:info-circle-line-duotone"
                    width={24}
                  />
                )
              }
              variant="light"
            >
              {isCompact ? (
                <Icon
                  className="text-default-500"
                  icon="solar:info-circle-line-duotone"
                  width={24}
                />
              ) : (
                "Help & Information"
              )}
            </Button>
          </Tooltip>
          <Tooltip content="Log Out" isDisabled={!isCompact} placement="right">
            <Button
              className={cn(
                "justify-start text-default-500 data-[hover=true]:text-foreground",
                {
                  "justify-center": isCompact,
                }
              )}
              isIconOnly={isCompact}
              startContent={
                isCompact ? null : (
                  <Icon
                    className="flex-none rotate-180 text-default-500"
                    icon="solar:minus-circle-line-duotone"
                    width={24}
                  />
                )
              }
              variant="light"
            >
              {isCompact ? (
                <Icon
                  className="rotate-180 text-default-500"
                  icon="solar:minus-circle-line-duotone"
                  width={24}
                />
              ) : (
                "Log Out"
              )}
            </Button>
          </Tooltip>
        </div>
      </div>
      <div className="w-full flex-1 flex-col p-4">
        <header className="flex items-center gap-3 rounded-medium border-small border-divider p-4">
          <Button isIconOnly size="sm" variant="light" onPress={onToggle}>
            <Icon
              className="text-default-500"
              height={24}
              icon="solar:sidebar-minimalistic-outline"
              width={24}
            />
          </Button>
          <h2 className="text-medium font-medium text-default-700">
            {selectedKey.charAt(0).toUpperCase() + selectedKey.slice(1)}
          </h2>
        </header>
        <main className="mt-4 h-full w-full overflow-visible">
          <div className="flex h-full w-full flex-col gap-4 rounded-medium border-small border-divider p-4">
            {componentMap[selectedKey] || <div>Page not found</div>}
          </div>
        </main>
      </div>
    </div>
  );
}
