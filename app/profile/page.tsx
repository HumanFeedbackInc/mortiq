import DashboardWrapper from "./components/dashboard-wrapper";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import { UserData, PendingUserData } from "./components/account-setting";
import {
  getUserAccountData,
  getPendingUser,
  UserAccountDataResult,
} from "../actions";
import { UserResponse } from "@supabase/supabase-js";

// export type UserData = {
//   accountStatus: string,
//   createdAt: Date,
//   email: string,
//   phone: string,
//   firstName: string,
//   lastName: string,
//   profilePicture: string,
//   role: string
// }
export type DashboardUserData = {
  userData: UserData | null;
  pendingUserData: PendingUserData | null;
  user: UserResponse;
};
export default async function ProfilePage() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;
  if (!userId) {
    redirect("/login");
  }
  let userData: UserData | null = null;
  let pendingUserData: PendingUserData | null = null;

  //check if user is in account table
  const userAccountDataResult: UserAccountDataResult =
    await getUserAccountData(userId);
  if (userAccountDataResult.success) {
    userData = userAccountDataResult.data;
  } else {
    userData = null;
  }

  //check if user is in pendingUser table
  if (userData === null) {
    const pendingUserDataResult = await getPendingUser(userId);
    if (pendingUserDataResult.success) {
      pendingUserData = pendingUserDataResult.data;
    } else {
      pendingUserData = null;
    }
  }

  const dashboardUserData: DashboardUserData = {
    userData: userData,
    pendingUserData: pendingUserData,
    user: user,
  };

  console.log("\n\nuserData");
  // const userDataArray = Object.values(userData)
  // const ud: UserData = {
  //   accountStatus: userData.accountStatus as string || "",
  //   createdAt: userData.createdAt as Date || new Date(),
  //   email: userData.email as string || "",
  //   phone: userData.phone as string || "",
  //   firstName: userData.firstName as string || "",
  //   lastName: userData.lastName as string || "",
  //   profilePicture: userData.profilePicture as string || "",
  //   role: userData.role as string
  // }

  // console.log(userAccountData)

  // console.table(userAccountData)
  return <DashboardWrapper dashboardUserData={dashboardUserData} />;
}
