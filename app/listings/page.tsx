// import { getPosts } from '@/lib/posts'
// import { Post } from '@/ui/post'
import ListingTable from "@/components/listingTable/ListingTable";
// import PendingPropertiesTable from "../dashboard/components/pendingProperties/pendingTable";

import { getListings } from "../actions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
const PUBLIC_BUCKET_URL =
  "https://tvwojwmrfzfxpelinlal.supabase.co/storage/v1/object/public/propertyImages/";
// import { SearchOptions } from "@supabase/supabase-js";
interface Listing {
  listingDateActive: string;
  listingId: string;
  listedDate: string | null;
  propertyId: string;
  address: string;
  amount: number;
  interestRate: number;
  estimatedFairMarketValue: number;
  propertyType: string;
  summary: string;
  imgs: string;
  privateDocs: string;
  mortgageType: string;
  priorEncumbrances: string;
  term: string;
  region: string;
  ltv: number;
  dateFunded: string;
}
interface ListingWithImages extends Listing {
  imgUrls: string[];
}

export default async function Page() {
  //   const posts = await getPosts()

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/sign-in");
  }
  const listings = (await getListings()) as Listing[];
  //Get list of imgs from supabase storage
  //list all files in the propertyImages bucket
  const listingsWithImages: ListingWithImages[] = [];
  for (const l of listings) {
    const listingWithImage: ListingWithImages = {
      ...l,
      imgUrls: [],
    };
    if (!listingWithImage.imgUrls) {
      listingWithImage.imgUrls = [];
    }
    const imgPath = l.imgs;
    // const { data: files, error: filesError } = await supabase.storage.from("propertyImages").list(
    //   path: "adf/"
    // );
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
    // console.log("FILES FOR IMG PATH ", imgPath)
    // console.log(files);
    console.log("LISTING WITH IMAGE");
    console.log(listingWithImage);

    console.log("LISTINGS WITH IMAGES");
    console.log(listingsWithImages);
  }
  // console.log("FILES")
  // console.log(files);

  //Iterate through files, get url for each file, add to ListingWithImages array
  // console.log("LISTINGS WITH IMAGES")
  // console.log(listingsWithImages);

  // const { data: { publicUrl } } = supabase.storage.from('propertyImages').getPublicUrl(listings[0].imgs);
  // console.log(publicUrl);
  // console.log(listings);

  // Pull images
  return (
    <div>
      <ListingTable listings={listingsWithImages || []} />
    </div>
    // <ul>
    //   {posts.map((post) => (
    //     <Post key={post.id} post={post} />
    //   ))}
    // </ul>
  );
}
