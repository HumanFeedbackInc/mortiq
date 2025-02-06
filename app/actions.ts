"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from 'uuid';
import { Database } from '@/types/supabase';
import { db } from "@/db/db";
import { activeListings, listings, property } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
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

export const getPdfUrl = async (filePath: string) => {
  const supabase = await createClient();
  //auth user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError) {
    console.error(authError)
    return encodedRedirect("error", "/sign-in", authError.message)
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
  .from('secureFiles')
  .createSignedUrl(filePath, 3600)


if (data) {
  console.log("data")
  console.table(data)
  console.log(data.signedUrl)
}
  if (error) {
    console.log("error")
    console.error(error)
    // return {error: error}
    //return the error as a plain object 
    // return {error: error}
    console.log(error.cause)
    console.log(error.message)
    console.log(error.name)
    console.log(error.toString())
    const errorObject = {
        cause: error.cause,
        message: error.message,
        name: error.name,
        toString: error.toString()
    }
    return errorObject
    // return encodedRedirect("error", "/sign-in", error.message)
  }
  return data;
}


export const createListingAction = async (listingData: ListingData, documents: File[], images: File[]) => {
  const supabase = await createClient();
  const listingId = uuidv4();
  const timestamp = new Date().toISOString();

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError) throw new Error(`User get failed: ${authError.message}`);
  const userId_ = user?.id;
  if (!userId_) throw new Error('User ID not found');
  //get account id from user id
  const { data: accountData, error: accountError } = await supabase
    .from('account')
    .select('account_id')
    .eq('user_id', userId_)
    .single();
  if (accountError) throw new Error(`Account get failed: ${accountError.message}`);
  const accountId_ = accountData?.account_id;
  if (!accountId_) throw new Error('Account ID not found');

  const imageBucketPath = `listings/${listingId}/images`;
  const imageBucket = 'propertyImages';
  const privateFileBucketPath = `listings/${listingId}/documents`;
  const privateFileBucket = 'secureFiles';

  //Create folder in supabase storage, if it doesn't exist
  // const { error: createFolderError } = await supabase.storage
  //   .from(privateFileBucket)
  //   .createDir(privateFileBucketPath);

  // 1. Upload documents to private bucket
  const documentPromises = documents.map(async (file) => {
    const sanitizedFileName = file.name.replace(/\s+/g, '_');
    const filePath = `${privateFileBucketPath}/${sanitizedFileName}`;
    console.log("filePath about to upload")
    console.log(filePath)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(privateFileBucket)
      .upload(filePath, file);
      
      
    console.log("fileFilePath")
    console.log(filePath)
    console.log("uploadData")
    console.log(uploadData)
    if (uploadError) {
      console.error("uploadFileError")
      console.log(uploadError)
      throw new Error(`Document upload failed: ${uploadError.message}`);
    }
    return filePath;
  });

  // 2. Upload images to public bucket
  const imagePromises = images.map(async (file) => {
    // Sanitize filename by replacing spaces with underscores
    const sanitizedFileName = file.name.replace(/\s+/g, '_');
    const filePath = `${imageBucketPath}/${sanitizedFileName}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(imageBucket)
      .upload(filePath, file);
    
    console.log("uploadData")
    console.log(uploadData)
    if (uploadError) {
      console.error("uploadError")
      console.log(uploadError)
      throw new Error(`Image upload failed: ${uploadError.message}`);
    }
    return filePath;
  });


  // Wait for all uploads to complete
  const [documentPaths, imagePaths] = await Promise.all([
    Promise.all(documentPromises),
    Promise.all(imagePromises),
  ]);
  console.log("documentPaths")
  console.log(documentPaths)
  console.log("imagePaths")
  console.log(imagePaths)

  const propertyDataInsert: Database['public']['Tables']['property']['Insert'] = {

    address: JSON.stringify(listingData.fullAddressDetails?.formattedAddress || ''),
    amount: listingData.loanAmount,
    interest_rate: listingData.interestRate,
    estimated_fair_market_value: listingData.fairMarketValue || 0,
    property_type: listingData.propertyType || '',
    summary: listingData.propertyDescription || '',
    imgs: imageBucketPath,
    private_docs: privateFileBucketPath,
    property_id: listingId,
    mortgage_type: listingData.mortgageType,
    prior_encumbrances: listingData.priorEncumbrances || 0,
    term: JSON.stringify({
      term: listingData.term,
      interest_rate: listingData.interestRate,
    }),
    region: listingData.state,
    ltv: listingData.ltv,
    date_funded: timestamp,
  };
  console.log("propertyDataInsert into table")
  console.log(propertyDataInsert)

  const {data: propertyData, error: propertyError} = await supabase
    .from('property')
    .insert(propertyDataInsert)
    .select<'*', Database['public']['Tables']['property']['Row']>('*')
    .single();

  if (propertyError) throw new Error(`Property insert failed: ${propertyError.message}`);
  
  //get user id from session instead of getUser()
  // const userId = session.user.id;
  // if (!userId) throw new Error('User ID not found');

  // if (propertyError) throw new Error(`Property insert failed: ${propertyError.message}`);
  if (authError) throw new Error(`User get failed: ${authError.message}`);
  const userId = user?.id;
  if (!userId) throw new Error('User ID not found');
  // 3. Create listing record in database
  if (!propertyData) throw new Error('Property data not found');
  console.log("propertyData inserted into table")
  console.log(propertyData)
  const listingDataInsert: Database['public']['Tables']['listings']['Insert'] = {
    account_id: accountId_,
    property_id: propertyData.property_id,
    listed_date: propertyData.created_at,
  };

  const {data: listingsDataResult, error: listingError} = await supabase
  .from('listings')
  .insert(listingDataInsert)
  .select<'*', Database['public']['Tables']['listings']['Row']>('*')
  .single();
  
  if (listingError){
    await supabase.from('property').delete().eq('property_id', propertyData.property_id);
    throw new Error(`Listing insert failed: ${listingError.message}`);
  }        

  // 4. Create active listings record in database
  const activeListingsDataInsert: Database['public']['Tables']['active_listings']['Insert'] = {
    listing_id: listingsDataResult.listing_id || '',
    listing_date_active: timestamp
  };

  const {data: activeListingsData, error: activeListingsError} = await supabase
  .from('active_listings')
  .insert(activeListingsDataInsert)
  .select<'*', Database['public']['Tables']['active_listings']['Row']>('*')
  .single();
  
  if (activeListingsError){
    await supabase.from('listings').delete().eq('listing_id', listingsDataResult.listing_id);
    await supabase.from('property').delete().eq('property_id', propertyData.property_id);
    throw new Error(`Active listings insert failed: ${activeListingsError.message}`);
  }

  return {
    success: true,
    listingId
  };
}

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
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
      "Thanks for signing up! Please check your email for a verification link.",
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

  revalidatePath('/', 'layout')
  redirect('/')
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
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
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
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
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
      dateFunded: property.dateFunded
    })
    .from(activeListings)
    .innerJoin(listings, eq(activeListings.listingId, listings.listingId))
    .innerJoin(property, eq(listings.propertyId, property.propertyId))
    .execute()
    
  return res;
}