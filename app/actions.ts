"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { Database } from "@/types/supabase";
import { db } from "@/db/db";
import {
  account,
  activeListings,
  listings,
  pendingUser,
  property,
  roles,
  userRoles,
  users,
} from "@/drizzle/schema";
import { eq, isNull } from "drizzle-orm";
import {
  PendingUserData,
  UserData,
} from "./profile/components/account-setting";

interface ListingData {
  // Loan Details
  loanAmount: number;
  mortgageType: string;
  interestRate: number;
  term: string;
  priorEncumbrances?: number;
  priorEncumbrancesWith?: string;
  fairMarketValue?: number;
  ltv: number;

  // Contact Information
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  entityName: string;
  cardholderName: string;
  country: string;
  zipCode: string;
  state: string;

  // Property Details
  propertyType?: string;
  propertyAddress?: string;
  propertyCity?: string;
  propertyProvince?: string;
  propertyPostalCode?: string;
  propertyCountry?: string;
  propertyLatitude?: number;
  propertyLongitude?: number;
  squareMeters?: number;
  numberOfUnits?: number;
  propertyDescription?: string;

  // Full Address Details
  fullAddressDetails?: {
    streetAddress: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    latitude?: number;
    longitude?: number;
    formattedAddress?: string;
  };
}

export const getAllListingFilesFromFolder = async (folderPath: string) => {
  //check auth status
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) {
    console.error(authError);
    return encodedRedirect("error", "/sign-in", authError.message);
  }
  console.log("\n\nfolderPath:\n\n");
  console.log(folderPath);
  // const filePath = `listings/${folderPath}/documents/`;
  const { data, error } = await supabase.storage
    .from("secureFiles")
    .list(folderPath);

  console.log("data");
  console.log(data);
  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  //create signed url for each file
  console.log("FOLDER PATH WITH FILE NAME");
  console.log(folderPath + data[0].name);
  const signedUrls = await Promise.all(
    data.map(async (file) => {
      console.log("folder path and file name: ");
      console.log(folderPath + "/" + file.name);
      const { data: signedUrlData, error: signedUrlError } =
        await supabase.storage
          .from("secureFiles")
          .createSignedUrl(folderPath + "/" + file.name, 3600);

      return signedUrlData;
    })
  );
  const signedUrlsWithFileNames = signedUrls.map((signedUrl, index) => ({
    signedUrl: signedUrl?.signedUrl || "",
    fileName: data[index].name,
  }));
  console.log("signedUrlsWithFileNames");
  console.log(signedUrlsWithFileNames);
  return { success: true, signedUrls: signedUrlsWithFileNames };
};

export const getPdfUrl = async (filePath: string) => {
  const supabase = await createClient();
  //auth user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) {
    console.error(authError);
    return encodedRedirect("error", "/sign-in", authError.message);
  }
  //   const { data, error } = await supabase
  //   .storage
  //   .from('secureFiles')
  //   .list('test', {
  //     limit: 100,
  //     offset: 0,
  //     sortBy: { column: 'name', order: 'asc' },
  //   })
  //   console.log("data")
  //   console.log("\n\nDATA: ", data)
  //   const { data, error } = await supabase.storage.from('secureFiles').createSignedUrl('dealsheet.pdf', 3600)
  const { data, error } = await supabase.storage
    .from("secureFiles")
    .createSignedUrl(filePath, 3600);

  if (data) {
    console.log("data");
    console.table(data);
    console.log(data.signedUrl);
  }
  if (error) {
    // console.log("error");
    // console.error(error);
    // // return {error: error}
    // //return the error as a plain object
    // // return {error: error}
    // console.log(error.cause);
    // console.log(error.message);
    // console.log(error.name);
    // console.log(error.toString());
    const errorObject = {
      cause: error.cause,
      message: error.message,
      name: error.name,
      toString: error.toString(),
    };
    return errorObject;
    // return encodedRedirect("error", "/sign-in", error.message)
  }
  return data;
};

export const createListingAction = async (
  listingData: ListingData
  // documents: File[],
  // images: File[]
) => {
  const supabase = await createClient();
  const listingId = uuidv4();
  const timestamp = new Date().toISOString();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) {
    console.error("authError");
    console.error(authError);
    throw new Error(`User get failed: ${authError.message}`);
  }
  const userId_ = user?.id;
  if (!userId_) throw new Error("User ID not found");
  //get account id from user id
  const { data: accountData, error: accountError } = await supabase
    .from("account")
    .select<"*", Database["public"]["Tables"]["account"]["Row"]>()
    .eq("user_id", userId_)
    .single();

  if (accountError) {
    console.error("accountError");
    console.error(accountError);
    throw new Error(`Account get failed: ${accountError.message}`);
  }
  const accountId_ = accountData?.account_id;
  if (!accountId_) throw new Error("Account ID not found");

  const imageBucketPath = `listings/${listingId}/images`;
  const imageBucket = "propertyImages";
  const privateFileBucketPath = `listings/${listingId}/documents`;
  const privateFileBucket = "secureFiles";

  //Create folder in supabase storage, if it doesn't exist
  // const { error: createFolderError } = await supabase.storage
  //   .from(privateFileBucket)
  //   .createDir(privateFileBucketPath);

  // 1. Upload documents to private bucket
  // const documentPromises = documents.map(async (file) => {
  //   const sanitizedFileName = file.name.replace(/\s+/g, "_");
  //   const filePath = `${privateFileBucketPath}/${sanitizedFileName}`;
  //   // console.log("filePath about to upload");
  //   // console.log(filePath);
  //   const { data: uploadData, error: uploadError } = await supabase.storage
  //     .from(privateFileBucket)
  //     .upload(filePath, file);

  //   // console.log("fileFilePath");
  //   // console.log(filePath);
  //   // console.log("uploadData");
  //   // console.log(uploadData);
  //   if (uploadError) {
  //     console.error("uploadFileError");
  //     console.log(uploadError);
  //     throw new Error(`Document upload failed: ${uploadError.message}`);
  //   }
  //   return filePath;
  // });

  // 2. Upload images to public bucket
  // const imagePromises = images.map(async (file) => {
  //   // Sanitize filename by replacing spaces with underscores
  //   const sanitizedFileName = file.name.replace(/\s+/g, "_");
  //   const filePath = `${imageBucketPath}/${sanitizedFileName}`;

  //   const { data: uploadData, error: uploadError } = await supabase.storage
  //     .from(imageBucket)
  //     .upload(filePath, file);

  //   console.log("uploadData");
  //   console.log(uploadData);
  //   if (uploadError) {
  //     console.error("uploadError");
  //     console.log(uploadError);
  //     throw new Error(`Image upload failed: ${uploadError.message}`);
  //   }
  //   return filePath;
  // });

  // Wait for all uploads to complete
  // const [documentPaths, imagePaths] = await Promise.all([
  //   Promise.all(documentPromises),
  //   Promise.all(imagePromises),
  // ]);
  // console.log("documentPaths");
  // console.log(documentPaths);
  // console.log("imagePaths");
  // console.log(imagePaths);

  const propertyDataInsert: Database["public"]["Tables"]["property"]["Insert"] =
    {
      address: JSON.stringify(
        listingData.fullAddressDetails?.formattedAddress || ""
      ),
      amount: listingData.loanAmount,
      interest_rate: listingData.interestRate,
      estimated_fair_market_value: listingData.fairMarketValue || 0,
      property_type: listingData.propertyType || "",
      summary: listingData.propertyDescription || "",
      imgs: imageBucketPath,
      private_docs: privateFileBucketPath,
      property_id: listingId,
      mortgage_type: listingData.mortgageType,
      //@ts-ignore
      lat_long:
        listingData.fullAddressDetails?.latitude +
        "," +
        listingData.fullAddressDetails?.longitude,
      prior_encumbrances: listingData.priorEncumbrances || 0,
      term: JSON.stringify({
        term: listingData.term,
        interest_rate: listingData.interestRate,
      }),
      region: listingData.state,
      ltv: listingData.ltv,
      date_funded: timestamp,
    };
  console.log("propertyDataInsert into table");
  console.log(propertyDataInsert);

  const { data: propertyData, error: propertyError } = await supabase
    .from("property")
    .insert(propertyDataInsert)
    .select<"*", Database["public"]["Tables"]["property"]["Row"]>("*")
    .single();

  if (propertyError) {
    console.error("propertyError");
    console.error(propertyError);
    throw new Error(`Property insert failed: ${propertyError.message}`);
  }

  //get user id from session instead of getUser()
  // const userId = session.user.id;
  // if (!userId) throw new Error('User ID not found');

  // if (propertyError) throw new Error(`Property insert failed: ${propertyError.message}`);
  //@ts-ignore
  if (authError) throw new Error(`User get failed: ${authError.message}`);
  const userId = user?.id;
  if (!userId) throw new Error("User ID not found");
  // 3. Create listing record in database
  if (!propertyData) throw new Error("Property data not found");
  console.log("propertyData inserted into table");
  console.log(propertyData);
  const listingDataInsert: Database["public"]["Tables"]["listings"]["Insert"] =
    {
      account_id: accountId_,
      property_id: propertyData.property_id,
      listed_date: propertyData.created_at,
    };

  const { data: listingsDataResult, error: listingError } = await supabase
    .from("listings")
    .insert(listingDataInsert)
    .select<"*", Database["public"]["Tables"]["listings"]["Row"]>("*")
    .single();

  if (listingError) {
    await supabase
      .from("property")
      .delete()
      .eq("property_id", propertyData.property_id);
    console.error("listingError");
    console.error(listingError);
    throw new Error(`Listing insert failed: ${listingError.message}`);
  }

  // 4. Create active listings record in database
  // const activeListingsDataInsert: Database["public"]["Tables"]["active_listings"]["Insert"] =
  //   {
  //     listing_id: listingsDataResult.listing_id || "",
  //     listing_date_active: timestamp,
  //   };

  // const { data: activeListingsData, error: activeListingsError } =
  //   await supabase
  //     .from("active_listings")
  //     .insert(activeListingsDataInsert)
  //     .select<"*", Database["public"]["Tables"]["active_listings"]["Row"]>("*")
  //     .single();

  // if (activeListingsError) {
  //   await supabase
  //     .from("listings")
  //     .delete()
  //     .eq("listing_id", listingsDataResult.listing_id);
  //   await supabase
  //     .from("property")
  //     .delete()
  //     .eq("property_id", propertyData.property_id);
  //   throw new Error(
  //     `Active listings insert failed: ${activeListingsError.message}`
  //   );
  // }

  return {
    success: true,
    listingId,
  };
};

export const inviteUser = async (email: string) => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  // Redirect invited users to the set-password page once they confirm their email.
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/set-password`,
  });
  return data;
};

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required"
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link."
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  // Get the user after successful sign in
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return encodedRedirect("error", "/sign-in", "User not found");
  }

  // Check if user exists in accounts table
  const { data: accountData, error: accountError } = await supabase
    .from("account")
    .select<"*", Database["public"]["Tables"]["account"]["Row"]>()
    .eq("user_id", user.id)
    .single();

  revalidatePath("/", "layout");

  // Redirect to profile if no account exists, otherwise go home
  if (!accountData) {
    redirect("/profile");
  }
  redirect("/");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const getListings = async () => {
  const res = await db
    .select({
      // Active listing fields
      listingDateActive: activeListings.listingDateActive,
      // Listing fields
      listingId: listings.listingId,
      listedDate: listings.listedDate,
      // Property fields
      propertyId: property.propertyId,
      address: property.address,
      amount: property.amount,
      interestRate: property.interestRate,
      estimatedFairMarketValue: property.estimatedFairMarketValue,
      propertyType: property.propertyType,
      imgs: property.imgs,
      privateDocs: property.privateDocs,
      mortgageType: property.mortgageType,
      priorEncumbrances: property.priorEncumbrances,
      term: property.term,
      region: property.region,
      ltv: property.ltv,
      dateFunded: property.dateFunded,
    })
    .from(activeListings)
    .innerJoin(listings, eq(activeListings.listingId, listings.listingId))
    .innerJoin(property, eq(listings.propertyId, property.propertyId))
    .execute();

  //iterate through each of the listings and change morgageType to a number
  const updatedListings = res.map((listing) => ({
    ...listing,
    mortgageType: Number(listing.mortgageType),
  }));
  return updatedListings;
};

export const approveListing = async (listingId: string) => {
  //insert listingid into the approved_listings table
  const res = await db
    .insert(activeListings)
    .values({ listingId, listingDateActive: new Date().toISOString() })
    .execute();
  return res;
};

export const getPendingProperties = async () => {
  const res = await db
    .select({
      // Listing fields
      listingId: listings.listingId,
      listedDate: listings.listedDate,
      // Property fields
      propertyId: property.propertyId,
      address: property.address,
      amount: property.amount,
      interestRate: property.interestRate,
      estimatedFairMarketValue: property.estimatedFairMarketValue,
      propertyType: property.propertyType,
      imgs: property.imgs,
      privateDocs: property.privateDocs,
      mortgageType: property.mortgageType,
      priorEncumbrances: property.priorEncumbrances,
      term: property.term,
      region: property.region,
      ltv: property.ltv,
      dateFunded: property.dateFunded,
    })
    .from(listings)
    .innerJoin(property, eq(listings.propertyId, property.propertyId))
    .leftJoin(activeListings, eq(listings.listingId, activeListings.listingId))
    .where(isNull(activeListings.listingId))
    .execute();

  console.log("\n\n\nres================================");
  console.log(res);
  return res;
};

export type UserAccountDataResult =
  | { success: true; data: UserData }
  | { success: false; error: string };

export const getUserAccountData = async (
  userId: string
): Promise<UserAccountDataResult> => {
  try {
    const res = await db
      .select()
      .from(account)
      .where(eq(account.userId, userId))
      .innerJoin(users, eq(account.userId, users.id))
      .innerJoin(userRoles, eq(account.userId, userRoles.userId))
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .execute();

    if (res.length === 0) {
      return { success: false, error: "User not found" };
    }
    const accountInfo = res[0];
    //TODO: add fileBucketPath tables to the DB, and add them to the userDataObject
    const userDataObject: UserData = {
      accountStatus: accountInfo.account.accountStatus,
      email: accountInfo.users.email,
      phone: accountInfo.users.phone || accountInfo.account.phone,
      phoneNumber: accountInfo.users.phone || accountInfo.account.phone,
      firstName: accountInfo.account.firstName,
      lastName: accountInfo.account.lastName,
      profilePicture: accountInfo.account.profilePicture,
      accountId: accountInfo.account.accountId,
      userId: accountInfo.account.userId,
      middleName: accountInfo.account.middleName,
      role: accountInfo.roles.roleName,
      secureFileBucketPath: null,
      imageBucketPath: null,
    };
    return { success: true, data: userDataObject };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Error getting user account data" };
  }
};

type PendingUserResult =
  | { success: true; data: PendingUserData }
  | { success: false; error: string };

export const getPendingUser = async (
  userId: string
): Promise<PendingUserResult> => {
  const res = await db
    .select()
    .from(pendingUser)
    .where(eq(pendingUser.userId, userId))
    .innerJoin(users, eq(pendingUser.userId, users.id))
    .execute();

  if (res.length === 0) {
    return { success: false, error: "User not found" };
  }
  const pendingUserInfo = res[0];
  const pendingUserObject: PendingUserData = {
    email: pendingUserInfo.users.email,
    phone: pendingUserInfo.pending_user.phone,
    phoneNumber: pendingUserInfo.pending_user.phone,
    firstName: pendingUserInfo.pending_user.firstName,
    lastName: pendingUserInfo.pending_user.lastName,
    role: pendingUserInfo.pending_user.roleId,
    secureFileBucketPath: null,
    imageBucketPath: null,
    pendingUserId: pendingUserInfo.pending_user.pendingUserId,
    middleName: pendingUserInfo.pending_user.middleName,
    roleId: pendingUserInfo.pending_user.roleId,
    profilePicture: pendingUserInfo.pending_user.profilePicture,
    // createdAt: pendingUserInfo.pending_user.createdAt,
    userId: pendingUserInfo.pending_user.userId,
  };
  return { success: true, data: pendingUserObject };
};

export const createOrUpdatePendingUser = async (
  pendingUserData: PendingUserData
) => {
  console.log("\n\n==============createOrUpdatePendingUser==============");
  console.log(pendingUserData);
  //Check if the private file bucket path exists
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) throw new Error(`User get failed: ${authError.message}`);
  const userId = user?.id;
  if (!userId) throw new Error("User ID not found");

  //Check if the private file bucket path exists
  let privateFileBucketPath = pendingUserData.secureFileBucketPath;
  if (!privateFileBucketPath || privateFileBucketPath === "") {
    privateFileBucketPath = `users/${userId}/private`;
  }
  //Check if the image bucket path exists

  let imageBucketPath = pendingUserData.imageBucketPath;
  if (!imageBucketPath || imageBucketPath === "") {
    imageBucketPath = `users/${userId}/images`;
  }

  pendingUserData.secureFileBucketPath = privateFileBucketPath;
  pendingUserData.imageBucketPath = imageBucketPath;

  //check if the user exists in the pending_user table
  // const { data: pendingUserDataExists, error: pendingUserError } =
  //   await supabase
  //     .from("pending_user")
  //     .select("pending_user_id")
  //     .eq("user_id", userId)
  //     .single();
  const res = await db
    .select()
    .from(pendingUser)
    .where(eq(pendingUser.userId, userId))
    .execute();

  if (res.length === 0) {
    console.log("\n\n==============pendingUserError==============");
    console.error(res);
  }

  if (res.length > 0) {
    //update the pending user data
    const { data: pendingUserDataUpdate, error: pendingUserDataUpdateError } =
      await supabase
        .from("pending_user")
        .update(pendingUserData)
        .eq("user_id", userId)
        .select("*")
        .single();

    if (pendingUserDataUpdateError) {
      console.error(pendingUserDataUpdateError);
      return { success: false, error: pendingUserDataUpdateError.message };
    }

    return { success: true, data: pendingUserDataUpdate };
  }
  console.log("\n\n==============create the pending user data==============");
  //create the pending user data
  // const { data: pendingUserDataCreate, error: pendingUserDataCreateError } =
  //   await supabase
  //     .from("pending_user")
  //     .insert({
  //       userId: userId,
  //       roleId: pendingUserData.roleId,
  //       firstName: pendingUserData.firstName,
  //       lastName: pendingUserData.lastName,
  //       middleName: pendingUserData.middleName,
  //       phone: pendingUserData.phoneNumber,
  //     })
  //     .select("*")
  //     .single();

  const res1 = await db
    .insert(pendingUser)
    .values({
      userId: userId,
      roleId: pendingUserData.roleId,
      firstName: pendingUserData.firstName,
      lastName: pendingUserData.lastName,
      middleName: pendingUserData.middleName,
      phone: pendingUserData.phoneNumber,
    })
    .execute();

  if (res.length === 0) {
    console.error(res);
  }

  return { success: true, data: res1 };
};

export type UpdateExistingUserType = {
  firstName: string;
  lastName: string;
  role: "ADMIN" | "BROKER" | "INVESTOR";
  phoneNumber: string;
  userId: string;
};
export const UpdateExistingUser = async (userData: UpdateExistingUserType) => {
  // Add detailed logging
  console.log("UpdateUser received userData:", {
    firstName: userData.firstName,
    lastName: userData.lastName,
    phoneNumber: userData.phoneNumber, // Check if this is null
    // phone: userData.phone, // Check if this exists
    userId: userData.userId,
  });

  try {
    const result = await db
      .update(account)
      .set({
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phoneNumber || "", // Add fallback empty string if null
      })
      .where(eq(account.userId, userData.userId))
      .returning();
    //update the user_roles table
    const userRolesPayload = {
      userId: userData.userId,
      roleId: userData.role,
    };
    //delete existing user_roles for the user
    const userRolesDeleteRes = await db
      .delete(userRoles)
      .where(eq(userRoles.userId, userData.userId))
      .execute();

    //get correct role id from roles table
    const roleId = await db
      .select({ id: roles.id })
      .from(roles)
      .where(eq(roles.roleName, userData.role))
      .execute();
    //insert the new user_roles for the user
    const userRolesRes = await db
      .insert(userRoles)
      .values({
        userId: userData.userId,
        roleId: roleId[0].id,
      })
      .execute();

    console.log("Update result:", result);
    return { success: true, data: result[0] };
  } catch (error) {
    console.error("UpdateUser error:", error);
    return { success: false, error: "Failed to update user" };
  }
};

export const UpdateUser = async (userData: PendingUserData) => {
  // Add detailed logging
  console.log("UpdateUser received userData:", {
    firstName: userData.firstName,
    lastName: userData.lastName,
    middleName: userData.middleName,
    profilePicture: userData.profilePicture,
    phoneNumber: userData.phoneNumber, // Check if this is null
    // phone: userData.phone, // Check if this exists
    userId: userData.userId,
  });

  try {
    const result = await db
      .update(account)
      .set({
        firstName: userData.firstName,
        lastName: userData.lastName,
        middleName: userData.middleName,
        profilePicture: userData.profilePicture,

        phone: userData.phoneNumber || "", // Add fallback empty string if null
      })
      .where(eq(account.userId, userData.userId))
      .returning();

    console.log("Update result:", result);
    return { success: true, data: result[0] };
  } catch (error) {
    console.error("UpdateUser error:", error);
    return { success: false, error: "Failed to update user" };
  }
};

export const uploadFileToPublicBucket = async (
  file: File,
  bucketName: string,
  bucketPath: string
) => {
  const supabase = await createClient();
  const fileName = file.name;
  const filePath = `${bucketPath}/${fileName}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file);

  if (uploadError) {
    console.error(uploadError);
    return { success: false, error: uploadError.message };
  }
  //get the url of the file from public bucket
  const { data: fileUrl } = await supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  const payload = {
    url: fileUrl.publicUrl,
    filePath: filePath,
    fileName: fileName,
    bucketName: bucketName,
  };
  return { success: true, data: payload };
};

export const uploadFileToPrivateBucket = async (
  file: File,
  bucketName: string,
  bucketPath: string
) => {
  const supabase = await createClient();
  const fileName = file.name;
  const filePath = `${bucketPath}/${fileName}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file);

  if (uploadError) {
    console.error(uploadError);
    return { success: false, error: uploadError.message };
  }
};

// export const getListVjings = async () => {
//   const res = await db
//     .select()
//     .from(listings)
//     .execute();
//   return res;
// };

export const setPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!password || !confirmPassword) {
    return encodedRedirect(
      "error",
      "/set-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect("error", "/set-password", "Passwords do not match");
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return encodedRedirect("error", "/set-password", "Password update failed");
  }

  return encodedRedirect(
    "success",
    "/login",
    "Password set successfully. Please log in."
  );
};

export const approvePendingUser = async (pendingUserData: PendingUserData) => {
  const supabase = await createClient();
  //insert into account table
  // const { data: accountData, error: accountError } = await supabase
  //   .from("account")
  //   .insert({
  //     userId: pendingUserData.userId,
  //     // roleId: pendingUserData.roleId,
  //     firstName: pendingUserData.firstName,
  //     lastName: pendingUserData.lastName,
  //     middleName: pendingUserData.middleName,
  //     phone: pendingUserData.phoneNumber,
  //     profilePicture: pendingUserData.profilePicture,
  //   })
  //   .select("*")
  //   .single();
  const accountPayload = {
    userId: pendingUserData.userId,
    firstName: pendingUserData.firstName,
    lastName: pendingUserData.lastName,
    middleName: pendingUserData.middleName,
    phone: pendingUserData.phone || pendingUserData.phoneNumber,
    accountStatus: "ACTIVE",
    profilePicture: pendingUserData.profilePicture,
  };

  //insert into user_roles table
  const userRolesPayload = {
    userId: accountPayload.userId,
    roleId: 4,
  };
  const roleRes = await db.insert(userRoles).values(userRolesPayload).execute();
  console.log("roleRes");
  console.log(roleRes);

  const res = await db
    .insert(account)
    .values({
      userId: accountPayload.userId,
      firstName: accountPayload.firstName,
      lastName: accountPayload.lastName,
      middleName: accountPayload.middleName,
      phone: accountPayload.phone,
      accountStatus: "ACTIVE",
      profilePicture: accountPayload.profilePicture,
    })
    .execute();
  console.log("res");
  console.log(res);
  //remove from pending_user table
  const { data: pendingUserDataDelete, error: pendingUserDataDeleteError } =
    await supabase
      .from("pending_user")
      .delete()
      .eq("user_id", pendingUserData.userId);

  if (pendingUserDataDeleteError) {
    console.error(pendingUserDataDeleteError);
    return { success: false, error: pendingUserDataDeleteError.message };
  }
  return { success: true, data: pendingUserDataDelete };
};
