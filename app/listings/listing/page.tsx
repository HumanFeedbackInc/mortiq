import { createClient } from '@/utils/supabase/server';
import type { Database } from '@/types/supabase';
import { notFound } from 'next/navigation';
import { LayoutGrid, Card} from '@/components/ui/bento';
import Image from 'next/image';
import MapboxMap from './components/Map';
import { BentoWrapper } from './components/BentoWrapper';
import CircleChartCard from './components/Stats-Radial';
import {KpiStats} from './components/kpi-stats';
import ContactMe from './components/ContactMe';
// import DocumentViewer from './components/DocumentViewer';
import PDFViewer from '@/components/pdf-viewer';
type Property = Database['public']['Tables']['properties']['Row'];

//TODO: Document Viewer/Selector + Preview 



export default async function ListingPage({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  const supabase = await createClient();
  let searchParams_ = await searchParams;
  const id = searchParams_.id;
  const img_cards: Card[] = [];

  if (!id) {
    notFound();
  }
  //Enforce type Property
  let listing: Property | null = null;

  const { data: listingData, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !listingData) {
    notFound();
  }

  listing = listingData;
  if (listing === null) {
    notFound();
  }
//   const listingImages = listing.img_urls?.split(',');
  const listingImages = ["https://tvwojwmrfzfxpelinlal.supabase.co/storage/v1/object/public/propertyImages//house1.png",
    "https://tvwojwmrfzfxpelinlal.supabase.co/storage/v1/object/public/propertyImages//house2.png", "https://tvwojwmrfzfxpelinlal.supabase.co/storage/v1/object/public/propertyImages//interiour1.png",

]


  if (listingImages) {
    listingImages.forEach((image, index) => {
      img_cards.push({
        id: index,
        content: <Image src={image} alt={listing.address} width={100} height={100} />,
        className: 'w-full h-full object-cover',
        thumbnail: image,
      });
    });
  }
  console.log(img_cards);

  const tempC = img_cards[1]
  img_cards[1] = img_cards[2]
  img_cards[2] = tempC
  const latlng = [parseFloat(listing.lat_long?.split(',')[1] || '0'), parseFloat(listing.lat_long?.split(',')[0] || '0')]
  console.log(latlng)
  let amountStat: TrendCardProps = {
    title: "Amount",
    value: listing.amount.toLocaleString(),
    change: "10%",
    changeType: "positive",
    trendType: "up"
  }
  return (
    <div className="px-6 pb-6">
            {/* <LayoutGrid img_cards={img_cards} /> */}
      <h1 className="text-2xl font-bold mb-4">Property Details</h1>
      <h2 className="text-lg font-semibold">Address</h2>
      <p>{listing.address}</p>

    <BentoWrapper cards={img_cards} />
    <div className='min-h-[500px] px-10'>

    <MapboxMap latlng={latlng} zoom={15} wrapperClassName="w-full rounded-lg h-[500px]"/>
    </div>
    <div className='grid grid-cols-2  md:grid-cols-4 gap-6 mt-16 px-10'>
        <div className='col-span-1'>

        <CircleChartCard title="Interest Rate" color="success" chartData={[{name: "Interest Rate", value: listing.interest_rate}]} total={listing.interest_rate} max={15} startAngle={180} endAngle={0}/>
        </div>
        <div className='col-span-1'>
        <CircleChartCard title="LTV" color="danger" chartData={[{name: "LTV", value: listing.ltv}]} total={listing.ltv} max={100} />
        </div>
        <div className='col-span-2'>
        <KpiStats stats={[
          {description: "Amount", value: listing.amount || 0, subtext: "Amount"}, 
          {description: "Market Value", value: listing.market_value || 0, subtext: "Market Value"}, 
          {description: "Term Type", value: listing.term || 0, subtext: "Term Type"}, 
          {description: "Prior Encomberance" + (listing.prior_e ? ` with ${listing.prior_e.split(",")[1]}` : ""), 
           value: listing.prior_e ? parseFloat(listing.prior_e.split(",")[0]) : 0, 
           subtext: "Prior Encomberance"}
        ]}/>
    </div>
    </div>
    {/* <DocumentViewer /> */}
    <PDFViewer />
    <ContactMe />
    </div>
  );
} 