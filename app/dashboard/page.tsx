// import UserManagementTables from "./components/userManagementTables";
import { db } from "@/db/db";
import { createClient } from "@/utils/supabase/server";
import Dash from "./components/dashboard-components/Dash";
import { eq } from "drizzle-orm";
import { UserAccountTableType } from "./components/ui/data";
import { UUID } from "crypto";
import * as schema from "@/drizzle/schema";
import { getPendingProperties } from "../actions";
import { ListingWithImages } from "./components/pendingProperties/pendingTable";
const PUBLIC_BUCKET_URL =
  "https://tvwojwmrfzfxpelinlal.supabase.co/storage/v1/object/public/propertyImages/";
export type DashboardDataLists = {
  userAccountsList: UserAccountTableType[];
  pendingUsersList: UserAccountTableType[];
  pendingPropertiesList: ListingWithImages[];
};

export default async function Dashboard() {
  //get all accounts from the database along with the user details
  const accounts = await db
    .select()
    .from(schema.account)
    .leftJoin(schema.users, eq(schema.account.userId, schema.users.id))
    .leftJoin(schema.userRoles, eq(schema.users.id, schema.userRoles.userId))
    .leftJoin(schema.roles, eq(schema.userRoles.roleId, schema.roles.id));

  const userAccounts: UserAccountTableType[] = accounts.map((account) => ({
    user_id: account.account.userId as UUID,
    account_id: account.account.accountId as UUID,
    role: account.roles?.roleName || "Unknown",
    first_name: account.account.firstName,
    last_name: account.account.lastName,
    email: account.users?.email || "Unknown",
    phone: account.users?.phone || "Unknown",
    profile_picture: account.account?.profilePicture || "Unknown",
    account_status: account.account.accountStatus || "Unknown",
    created_at: new Date(), //change to now timestamp
  }));
  const pendingUsers = await db
    .select()
    .from(schema.pendingUser)
    .leftJoin(schema.users, eq(schema.pendingUser.userId, schema.users.id))
    .leftJoin(schema.userRoles, eq(schema.users.id, schema.userRoles.userId))
    .leftJoin(schema.roles, eq(schema.userRoles.roleId, schema.roles.id));
  const pendingUsersList: UserAccountTableType[] = pendingUsers.map(
    (pendingUser) => ({
      user_id: pendingUser.pending_user.userId as UUID,
      account_id: pendingUser.pending_user.userId as UUID,
      email: pendingUser.users?.email || "Unknown",
      phone: pendingUser.users?.phone || "Unknown",
      profile_picture: pendingUser.pending_user?.profilePicture || "Unknown",
      account_status: "Pending",
      created_at: new Date(),
      role: pendingUser.roles?.roleName || "Unknown",
      first_name: pendingUser.pending_user?.firstName || "Unknown",
      last_name: pendingUser.pending_user?.lastName || "Unknown",
    })
  );
  const listings = await getPendingProperties();

  const listingsWithImages: ListingWithImages[] = [];
  for (const l of listings) {
    const listingWithImage: ListingWithImages = {
      ...(l as unknown as Omit<ListingWithImages, "imgUrls">),
      imgUrls: [],
    };
    if (!listingWithImage.imgUrls) {
      listingWithImage.imgUrls = [];
    }
    const imgPath = l.imgs;
    // const { data: files, error: filesError } = await supabase.storage.from("propertyImages").list(
    //   path: "adf/"
    // );
    const supabase = await createClient();
    let { data: files, error: filesError } = await supabase.storage
      .from("propertyImages")
      .list(imgPath);
    if (filesError || !files) {
      console.log("ERROR GETTING FILES");
      console.log(filesError);
      throw new Error("Error getting images");
    }
    // https://tvwojwmrfzfxpelinlal.supabase.co/storage/v1/object/public/propertyImages/listings/12c168ad-ed92-4bd0-b099-403dec3b92e0/images/Screenshot_2025-01-31_at_6.06.59_PM.png
    for (const f of files) {
      console.log("FILE");
      console.log(f);
      console.log("LISTING IMGS");
      console.log(l.imgs);

      const imgurl = PUBLIC_BUCKET_URL + l.imgs + "/" + f.name;
      console.log("IMG URL");
      console.log(imgurl);
      listingWithImage.imgUrls.push(imgurl);
    }

    listingsWithImages.push(listingWithImage);
  }
  // dashboardDataLists.pendingPropertiesList = listingsWithImages;
  const dashboardDataLists: DashboardDataLists = {
    userAccountsList: userAccounts,
    pendingUsersList: pendingUsersList,
    pendingPropertiesList: listingsWithImages,
  };
  console.log("\n\n================LISTINGS WITH IMAGES=================");
  console.log(listingsWithImages);
  return (
    <div className="flex flex-col gap-6">
      <Dash dashboardDataLists={dashboardDataLists} />
      {/* <UserManagementTables /> */}
    </div>
  );
}
