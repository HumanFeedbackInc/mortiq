"use server";

import { db } from "@/db/db";
import { account, users, userRoles, roles } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getCurrentUser(userId: string) {
  const [userData] = await db
    .select({
      id: users.id,
      email: users.email,
      firstName: account.firstName,
      lastName: account.lastName,
      profilePicture: account.profilePicture,
      accountStatus: account.accountStatus,
      // createdAt: account.createdAt,
      role: {
        id: roles.id,
        roleName: roles.roleName,
      },
    })
    .from(account)
    .where(eq(users.id, userId))
    .leftJoin(users, eq(account.userId, users.id))
    .leftJoin(userRoles, eq(users.id, userRoles.userId))
    .leftJoin(roles, eq(userRoles.roleId, roles.id));

  console.log("userData");
  console.log(userData);

  return userData;
}
