"use client";

import React from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import ListingTable from "@/components/listingTable/ListingTable";
import GridView from "./gridcomponents/GridView";

interface ListingWithImages {
  listingDateActive: string;
  listingId: string;
  listedDate: string | null;
  propertyId: string;
  address: string;
  amount: number;
  interestRate: number;
  estimatedFairMarketValue: number;
  propertyType: string;
  summary: string | null;
  imgs: string;
  privateDocs: string;
  mortgageType: number;
  priorEncumbrances: string;
  term: string;
  region: string;
  ltv: number;
  dateFunded: string;
  imgUrls: string[];
}

interface ListingsTabsProps {
  listings: ListingWithImages[];
}

const GridIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="24"
    role="presentation"
    viewBox="0 0 24 24"
    width="24"
    {...props}
  >
    <path
      d="M22 8.52V3.98C22 2.57 21.36 2 19.77 2H15.73C14.14 2 13.5 2.57 13.5 3.98V8.51C13.5 9.93 14.14 10.49 15.73 10.49H19.77C21.36 10.5 22 9.93 22 8.52Z"
      fill="currentColor"
    />
    <path
      d="M22 19.77V15.73C22 14.14 21.36 13.5 19.77 13.5H15.73C14.14 13.5 13.5 14.14 13.5 15.73V19.77C13.5 21.36 14.14 22 15.73 22H19.77C21.36 22 22 21.36 22 19.77Z"
      fill="currentColor"
    />
    <path
      d="M10.5 8.52V3.98C10.5 2.57 9.86 2 8.27 2H4.23C2.64 2 2 2.57 2 3.98V8.51C2 9.93 2.64 10.49 4.23 10.49H8.27C9.86 10.5 10.5 9.93 10.5 8.52Z"
      fill="currentColor"
    />
    <path
      d="M10.5 19.77V15.73C10.5 14.14 9.86 13.5 8.27 13.5H4.23C2.64 13.5 2 14.14 2 15.73V19.77C2 21.36 2.64 22 4.23 22H8.27C9.86 22 10.5 21.36 10.5 19.77Z"
      fill="currentColor"
    />
  </svg>
);

const TableIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="24"
    role="presentation"
    viewBox="0 0 24 24"
    width="24"
    {...props}
  >
    <path
      d="M19.5 3.75h-15A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V6a2.25 2.25 0 00-2.25-2.25zM7.5 18V9h9v9h-9z"
      fill="currentColor"
    />
  </svg>
);

export default function ListingsTabs({ listings }: ListingsTabsProps) {
  const tabs = [
    {
      id: "grid",
      label: "Grid View",
      icon: <GridIcon />,
      content: <GridView listings={listings || []} />,
    },
    {
      id: "table",
      label: "Table View",
      icon: <TableIcon />,
      content: <ListingTable listings={listings || []} />,
    },
  ];

  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Listings view"
        items={tabs}
        color="primary"
        variant="bordered"
      >
        {(item) => (
          <Tab
            key={item.id}
            title={
              <div className="flex items-center space-x-2">
                {item.icon}
                <span>{item.label}</span>
              </div>
            }
          >
            <Card>
              <CardBody>{item.content}</CardBody>
            </Card>
          </Tab>
        )}
      </Tabs>
    </div>
  );
}
