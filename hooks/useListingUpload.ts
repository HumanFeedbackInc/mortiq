import { createListingAction } from '@/app/actions';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { Database } from '@/types/supabase';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

interface UploadResult {
  success: boolean;
  error?: string;
  listingId?: string;
}

export const useListingUpload = () => {
  const uploadListing = async (
    listingData: ListingData,
    documents: File[],
    images: File[]
  ): Promise<UploadResult> => {
    try {
      const result = await createListingAction(listingData, documents, images);
      // // Check for active session first
      // const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      // if (sessionError || !session) {
      //   throw new Error('Please sign in to create a listing');
      // }

      // const listingId = uuidv4();
      // const timestamp = new Date().toISOString();

      // const imageBucketPath = `listings/${listingId}/images`;
      // const imageBucket = 'propertyImages';
      // const privateFileBucketPath = `listings/${listingId}/documents`;
      // const privateFileBucket = 'secureFiles';
      // // 1. Upload documents to private bucket
      // const documentPromises = documents.map(async (file) => {
      //   const filePath = `${privateFileBucketPath}/${file.name}`;
      //   const { error: uploadError } = await supabase.storage
      //     .from(privateFileBucket)
      //     .upload(filePath, file);

      //   if (uploadError) throw new Error(`Document upload failed: ${uploadError.message}`);
      //   return filePath;
      // });

      // // 2. Upload images to public bucket

      // const imagePromises = images.map(async (file) => {
      //   const filePath = `${imageBucketPath}/${file.name}`;
      //   const { error: uploadError } = await supabase.storage
      //     .from(imageBucket)
      //     .upload(filePath, file);

      //   if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);
      //   return filePath;
      // });

      // // Wait for all uploads to complete
      // const [documentPaths, imagePaths] = await Promise.all([
      //   Promise.all(documentPromises),
      //   Promise.all(imagePromises),
      // ]);

      // const propertyDataInsert: Database['public']['Tables']['property']['Insert'] = {
      //   address: JSON.stringify(listingData.fullAddressDetails?.formattedAddress || ''),
      //   amount: listingData.loanAmount,
      //   interest_rate: listingData.interestRate,
      //   estimated_fair_market_value: listingData.fairMarketValue || 0,
      //   property_type: listingData.propertyType || '',
      //   summary: listingData.propertyDescription || '',
      //   imgs: imageBucketPath,
      //   private_docs: privateFileBucketPath,
      //   property_id: listingId,
      //   mortgage_type: listingData.mortgageType,
      //   prior_encumbrances: listingData.priorEncumbrances || 0,
      //   term: JSON.stringify({
      //     term: listingData.term,
      //     interest_rate: listingData.interestRate,
      //   }),
      //   region: listingData.state,
      //   ltv: listingData.ltv,
      //   date_funded: timestamp,
      // };
      
      // const {data: propertyData, error: propertyError} = await supabase
      //   .from('property')
      //   .insert(propertyDataInsert)
      //   .select<'*', Database['public']['Tables']['property']['Row']>('*')
      //   .single();
      
      // //get user id from session instead of getUser()
      // const userId = session.user.id;
      // if (!userId) throw new Error('User ID not found');

      // if (propertyError) throw new Error(`Property insert failed: ${propertyError.message}`);

      // // 3. Create listing record in database
      // const listingDataInsert: Database['public']['Tables']['listings']['Insert'] = {
      //   account_id: userId,
      //   property_id: propertyData.property_id,
      //   listed_date: propertyData.created_at,
      // };

      // const {data: listingsDataResult, error: listingError} = await supabase
      // .from('listings')
      // .insert(listingDataInsert)
      // .select<'*', Database['public']['Tables']['listings']['Row']>('*')
      // .single();
      
      // if (listingError){
      //   await supabase.from('property').delete().eq('property_id', propertyData.property_id);
      //   throw new Error(`Listing insert failed: ${listingError.message}`);
      // }        

      // // 4. Create active listings record in database
      // const activeListingsDataInsert: Database['public']['Tables']['active_listings']['Insert'] = {
      //   listing_id: listingsDataResult.listing_id || '',
      //   listing_date_active: timestamp
      // };

      // const {data: activeListingsData, error: activeListingsError} = await supabase
      // .from('active_listings')
      // .insert(activeListingsDataInsert)
      // .select<'*', Database['public']['Tables']['active_listings']['Row']>('*')
      // .single();
      
      // if (activeListingsError){
      //   await supabase.from('listings').delete().eq('listing_id', listingsDataResult.listing_id);
      //   await supabase.from('property').delete().eq('property_id', propertyData.property_id);
      //   throw new Error(`Active listings insert failed: ${activeListingsError.message}`);
      // }
      

      return {
        success: true,
        listingId: result.listingId
      };

    } catch (error) {
      console.error('Listing upload failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  };

  return { uploadListing };
}; 