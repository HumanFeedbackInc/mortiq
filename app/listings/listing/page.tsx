import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/bento";
import Image from "next/image";
import MapboxMap from "./components/Map";
import { BentoWrapper } from "./components/BentoWrapper";
import CircleChartCard from "./components/Stats-Radial";
import { KpiStats } from "./components/kpi-stats";
import ContactMe from "./components/ContactMe";
import PDFViewer from "@/components/pdf-viewer";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import * as schema from "@/drizzle/schema";
import { ListingLayout } from "./components/ListingLayout";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ListingPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  // const supabase = await createClient();
  const id = (await searchParams).id;
  const img_cards: Card[] = [];

  if (!id) {
    console.log("NOT FOUND - Invalid ID");
    notFound();
  }

  // Validate UUID format
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id as string)) {
    console.log("NOT FOUND - Invalid UUID format");
    notFound();
  }

  try {
    const res = await db
      .select()
      .from(schema.listings)
      .where(eq(schema.listings.listingId, id as string))
      .innerJoin(
        schema.property,
        eq(schema.listings.propertyId, schema.property.propertyId)
      )
      .limit(1);

    if (!res || res.length === 0) {
      notFound();
    }

    const propertyId = res[0].property.propertyId;
    const listing = res[0].property;

    if (!listing) {
      notFound();
    }

    const listingImages = [
      "https://tvwojwmrfzfxpelinlal.supabase.co/storage/v1/object/public/propertyImages//house1.png",
      "https://tvwojwmrfzfxpelinlal.supabase.co/storage/v1/object/public/propertyImages//house2.png",
      "https://tvwojwmrfzfxpelinlal.supabase.co/storage/v1/object/public/propertyImages//interiour1.png",
    ];

    listingImages.forEach((image, index) => {
      img_cards.push({
        id: index,
        content: (
          <Image src={image} alt={listing.address} width={100} height={100} />
        ),
        className: "w-full h-full object-cover",
        thumbnail: image,
      });
    });

    // Swap images 2 and 3
    const tempC = img_cards[1];
    img_cards[1] = img_cards[2];
    img_cards[2] = tempC;

    const latlng = [
      parseFloat(listing?.lat_long?.split(",")[1] || "0"),
      parseFloat(listing?.lat_long?.split(",")[0] || "0"),
    ];

    const priorEAmount = listing.priorEncumbrances.split(",")[0];

    return (
      <ListingLayout>
        <div className="min-h-screen px-6 pb-6 overflow-x-hidden">
          <h1 className="text-2xl font-bold mb-4">Property Details</h1>
          <h2 className="text-lg font-semibold">Address</h2>
          <p>{listing.address}</p>

          <div className="min-h-[400px]">
            <BentoWrapper cards={img_cards} />
          </div>

          <div
            className="min-h-[500px] px-10 scroll-margin-top-[100px]"
            id="map-section"
          >
            <div className="w-full h-[500px] bg-gray-100 dark:bg-gray-800 rounded-lg">
              <MapboxMap
                latlng={latlng}
                zoom={15}
                wrapperClassName="w-full rounded-lg h-[500px]"
              />
            </div>
          </div>

          <div className="min-h-[300px] grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 px-10">
            <div className="col-span-1">
              <CircleChartCard
                title="Interest Rate"
                color="success"
                chartData={[
                  { name: "Interest Rate", value: listing.interestRate },
                ]}
                total={listing.interestRate}
                max={15}
                startAngle={180}
                endAngle={0}
              />
            </div>
            <div className="col-span-1">
              <CircleChartCard
                title="LTV"
                color="danger"
                chartData={[{ name: "LTV", value: listing.ltv }]}
                total={listing.ltv}
                max={100}
              />
            </div>
            <div className="col-span-2">
              <KpiStats
                stats={[
                  {
                    description: "Amount",
                    value: listing.amount || 0,
                    subtext: "Amount",
                  },
                  {
                    description: "Market Value",
                    value: listing.estimatedFairMarketValue || 0,
                    subtext: "Market Value",
                  },
                  {
                    description: (listing.term as { term: string }["term"])
                      ? `${(listing.term as { term: string })["term"].split(" ").slice(1).join(" ")}`
                      : "",
                    value:
                      parseInt(
                        (listing.term as { term: string })["term"].split(" ")[0]
                      ) || 0,
                    subtext:
                      (listing.term as { term: string })["term"].split(
                        " "
                      )[1] || "",
                  },
                  {
                    description:
                      "Prior Encomberance" +
                      (listing.priorEncumbrances
                        ? ` with ${listing.priorEncumbrances.split(",")[1]}`
                        : ""),
                    value: listing.priorEncumbrances
                      ? parseFloat(listing.priorEncumbrances.split(",")[0])
                      : 0,
                    subtext: "Prior Encomberance",
                  },
                ]}
              />
            </div>
          </div>

          <div className="min-h-[600px]">
            <PDFViewer filePath={`listings/${propertyId}/documents/`} />
          </div>

          <ContactMe
            address={listing.address}
            amount={listing.amount}
            interest_rate={listing.interestRate}
            ltv={listing.ltv}
            prior_encumbrances={listing.priorEncumbrances}
            term={listing.term}
            mortgage_type={listing.mortgageType}
          />
        </div>
      </ListingLayout>
    );
  } catch (error) {
    console.error("Database error:", error);
    notFound();
  }
}
