import { UUID } from "crypto";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import UserTableWrapper from "./userTableWrapper";
import * as schema from "@/drizzle/schema";
import PendingUserTableWrapper from "./pendingUserTableWrapper";
import { UserAccountTableType } from "./ui/data";

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
  console.log(pendingUsersList);
  return (
    <div className="p-6 flex flex-col gap-6 max-w-[100vw]">
      <UserTableWrapper users={userAccounts} />
      <PendingUserTableWrapper pendingUsers={pendingUsersList} />
    </div>
  );
}
