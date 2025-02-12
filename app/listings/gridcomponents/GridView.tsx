"use client";

import React, { useMemo } from "react";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Chip,
  RadioGroup,
  Radio,
  Input,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import { SearchIcon } from "@heroui/shared-icons";
import { Icon } from "@iconify/react";

import PriceSlider from "./price-slider";
import PopoverFilterWrapper from "./popover-filter-wrapper";
import ProductsGrid from "./products-grid";
import { useListingTable } from "@/components/listingTable/useListingTable";

type GridViewProps = {
  listings: {
    listingDateActive: string;
    listingId: string;
    listedDate: string | null;
    propertyId: string;
    address: string;
    amount: number;
    interestRate: number;
    estimatedFairMarketValue: number;
    propertyType: string;
    imgs: string;
    imgUrls?: string[];
    privateDocs: string;
    mortgageType: number;
    priorEncumbrances: string;
    term: string;
    region: string;
    ltv: number;
    dateFunded: string;
  }[];
};

export default function GridView({ listings }: GridViewProps) {
  const {
    filterValue,
    dateFilter,
    setDateFilter,
    mortgageTypeFilter,
    setMortgageTypeFilter,
    amountRange,
    setAmountRange,
    interestRange,
    setInterestRange,
    ltvRange,
    setLtvRange,
    onSearchChange,
    filteredItems,
  } = useListingTable(listings);

  return (
    <div className="max-w-8xl h-full w-full px-2 lg:px-24">
      <nav className="my-4 px-2 py-2">
        <Breadcrumbs>
          <BreadcrumbItem>Home</BreadcrumbItem>
          <BreadcrumbItem>Listings</BreadcrumbItem>
        </Breadcrumbs>
      </nav>
      <div className="flex gap-x-6">
        <div className="w-full flex-1 flex-col">
          <header className="relative z-20 flex flex-col gap-2 rounded-medium bg-default-50 px-4 pb-3 pt-2 md:pt-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-row gap-2">
                <div className="hidden items-center gap-1 md:flex">
                  <h2 className="text-medium font-medium">Property Listings</h2>
                  <Chip size="sm" variant="flat">
                    {filteredItems.length}
                  </Chip>
                </div>
              </div>
              <div className="-ml-2 flex w-full flex-wrap items-center justify-start gap-2 md:ml-0 md:justify-end">
                <Input
                  className="min-w-[200px]"
                  endContent={
                    <SearchIcon className="text-default-400" width={16} />
                  }
                  placeholder="Search"
                  size="sm"
                  value={filterValue}
                  onValueChange={onSearchChange}
                />

                <PopoverFilterWrapper title="Price Range">
                  <PriceSlider
                    range={{
                      min: 0,
                      defaultValue: amountRange,
                      max: 1500000,
                      step: 10000,
                    }}
                    displayFormat="usd"
                    value={amountRange}
                    onChange={(value) =>
                      setAmountRange(value as [number, number])
                    }
                  />
                </PopoverFilterWrapper>

                <PopoverFilterWrapper title="Interest Rate">
                  <PriceSlider
                    range={{
                      min: 0,
                      defaultValue: interestRange,
                      max: 30,
                      step: 1,
                    }}
                    value={interestRange}
                    displayFormat="percent"
                    onChange={(value) =>
                      setInterestRange(value as [number, number])
                    }
                  />
                </PopoverFilterWrapper>

                <PopoverFilterWrapper title="LTV">
                  <PriceSlider
                    range={{
                      min: 0,
                      defaultValue: ltvRange,
                      max: 100,
                      step: 1,
                    }}
                    displayFormat="percent"
                    value={ltvRange}
                    onChange={(value) => setLtvRange(value as [number, number])}
                  />
                </PopoverFilterWrapper>

                <PopoverFilterWrapper title="List Date">
                  <RadioGroup value={dateFilter} onValueChange={setDateFilter}>
                    <Radio value="all">All</Radio>
                    <Radio value="last7Days">Last 7 days</Radio>
                    <Radio value="last30Days">Last 30 days</Radio>
                    <Radio value="last60Days">Last 60 days</Radio>
                  </RadioGroup>
                </PopoverFilterWrapper>

                <PopoverFilterWrapper title="Mortgage Type">
                  <RadioGroup
                    value={mortgageTypeFilter}
                    onValueChange={setMortgageTypeFilter}
                  >
                    <Radio value="all">All</Radio>
                    <Radio value="first">First</Radio>
                    <Radio value="second">Second</Radio>
                    <Radio value="more">More</Radio>
                  </RadioGroup>
                </PopoverFilterWrapper>
              </div>
            </div>
          </header>
          <main className="mt-4 w-full px-1">
            <ProductsGrid items={filteredItems} />
          </main>
        </div>
      </div>
    </div>
  );
}
