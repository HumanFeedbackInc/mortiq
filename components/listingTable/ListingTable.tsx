"use client";

// import type { Selection, SortDescriptor } from "@heroui/react";
// import type { ColumnsKey, StatusOptions, Users } from "./data";
// import type { Key } from "@react-types/shared";
// import type { Database } from "@/types/supabase";
import { Image as UImage } from "@heroui/react";
import {
  CirclePercent,
  CircleDollarSign,
  House,
  CalendarDays,
  PlusIcon,
} from "lucide-react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  RadioGroup,
  Radio,
  Chip,
  Pagination,
  Divider,
  useButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import { SearchIcon } from "@heroui/shared-icons";
import React, { useMemo, useRef } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

import { useMemoizedCallback } from "./use-memoized-callback";
import { useListingTable } from "./useListingTable";
// import {columns} from "./data";
import { RangeSlider } from "./amount-slider";
import { approveListing, triggerAiCall } from "@/app/actions";
import { useRouter } from "next/navigation";

type ListingTableProps = {
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
  enableRowSelection?: boolean;
};

const columns = [
  { uid: "actions", name: "Actions" },
  { uid: "images", name: "Images" },
  { uid: "address", name: "Address" },
  { uid: "amount", name: "Amount" },
  { uid: "interest_rate", name: "Interest Rate" },
  { uid: "ltv", name: "LTV" },
  { uid: "property_type", name: "Property Type" },
  { uid: "region", name: "Region" },
  { uid: "market_value", name: "Market Value" },
  { uid: "date_funded", name: "Date Funded" },
  { uid: "maturity_date", name: "Maturity Date" },
  { uid: "mortgage_type", name: "Mortgage Type" },
  { uid: "term", name: "Term" },
  { uid: "list_date", name: "List Date" },
] as const;

// TODO: TEMPORARY HARDCODED IMAGE URL - REMOVE BEFORE PROD
const TEMP_HARDCODED_IMAGE =
  "https://tvwojwmrfzfxpelinlal.supabase.co/storage/v1/object/public/propertyImages//house1.png";

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function Component({
  listings,
  enableRowSelection = false,
}: ListingTableProps) {
  // console.log('Listings in table component:', listings);

  const {
    filterValue,
    dateFilter,
    setDateFilter,
    mortgageTypeFilter,
    setMortgageTypeFilter,
    filterSelectedKeys,
    page,
    pages,
    onNextPage,
    onPreviousPage,
    sortDescriptor,
    setSortDescriptor,
    visibleColumns,
    setVisibleColumns,
    sortedItems,
    filteredItems,
    onSearchChange,
    onSelectionChange,
    setPage,
    isLoading,
    amountRange,
    setAmountRange,
    interestRange,
    setInterestRange,
    ltvRange,
    setLtvRange,
  } = useListingTable(listings);

  // Helper function to check if a column is visible
  const isColumnVisible = (columnId: string) => {
    if (visibleColumns === "all") return true;
    return (visibleColumns as Set<string>).has(columnId);
  };

  const eyesRef = useRef<HTMLButtonElement | null>(null);
  const editRef = useRef<HTMLButtonElement | null>(null);
  const deleteRef = useRef<HTMLButtonElement | null>(null);
  const { getButtonProps: getEyesProps } = useButton({ ref: eyesRef });
  const { getButtonProps: getEditProps } = useButton({ ref: editRef });
  const { getButtonProps: getDeleteProps } = useButton({ ref: deleteRef });
  const getMemberInfoProps = useMemoizedCallback(() => ({
    onClick: handleMemberClick,
  }));

  const router = useRouter();
  const handleSelectedAction = useMemoizedCallback(async (action: string) => {
    const selectedRows =
      filterSelectedKeys === "all"
        ? sortedItems
        : sortedItems.filter((item) => filterSelectedKeys.has(item.listingId));

    console.log(`Action "${action}" invoked on selected rows:`, selectedRows);
    // TODO: Execute your approval/rejection logic here.
    if (action === "approve") {
      console.log("Approving selected rows:", selectedRows);
      //TODO: Call approveListing function
      const promises = [];
      for (const row of selectedRows) {
        console.log("Row:", row);
        //TODO: Call approveListing function
        // await approveListing(row.listingId);

        // promises.push(approveListing(row.listingId));
        console.log("Triggering AI call for listing:", row.listingId);
        promises.push(triggerAiCall(row.listingId, row.listingId));
      }
      // const results = await Promise.all(promises);
      console.log("All listings approved");
    } else if (action === "reject") {
      console.log("Rejecting selected rows:", selectedRows);
    }
  });

  const renderCell = (
    item: ListingTableProps["listings"][0],
    columnKey: React.Key
  ) => {
    const columnToProperty: Record<string, keyof typeof item> = {
      images: "imgUrls",
      address: "address",
      amount: "amount",
      interest_rate: "interestRate",
      ltv: "ltv",
      property_type: "propertyType",
      region: "region",
      market_value: "estimatedFairMarketValue",
      date_funded: "dateFunded",
      maturity_date: "term",
      mortgage_type: "mortgageType",
      term: "term",
      list_date: "listedDate",
    };

    const propertyKey =
      columnToProperty[columnKey as string] || (columnKey as keyof typeof item);
    const cellValue = item[propertyKey];

    // Handle different column types
    switch (columnKey) {
      case "amount":
        return (
          <Chip
            variant="faded"
            color="warning"
            size="sm"
            startContent={<CircleDollarSign className="mr-1 -ml-1" />}
          >
            {formatCurrency(Number(cellValue) || 0)}
          </Chip>
        );
      case "market_value":
        return (
          <Chip
            variant="faded"
            color="success"
            size="sm"
            startContent={<CircleDollarSign className="mr-1 -ml-1" />}
          >
            {formatCurrency(Number(cellValue) || 0)}
          </Chip>
        );

      case "interest_rate":
        return (
          <Chip
            variant="flat"
            color="success"
            size="sm"
            endContent={<CirclePercent className="ml-1 -mr-1" />}
          >
            {cellValue || 0}
          </Chip>
        );
      case "ltv":
        return (
          <Chip
            variant="flat"
            color="primary"
            size="sm"
            endContent={<CirclePercent className="ml-1 -mr-1" />}
          >
            {cellValue || 0}
          </Chip>
        );
      // return `${cellValue || 0}%`;
      case "property_type":
        return (
          <Chip
            variant="flat"
            color="primary"
            size="sm"
            startContent={<House className="mr-1 -ml-1" />}
          >
            {cellValue || 0}
          </Chip>
        );
      case "images":
        //pull first image from img bucket
        // const publicBucketFolder = cellValue as string
        //grab the first image from the bucket
        // const firstImage = await supabase.storage.from('propertyImages').getPublicUrl(publicBucketFolder)

        const imageUrls = cellValue as string[];
        let firstImage = TEMP_HARDCODED_IMAGE;
        if (imageUrls && imageUrls.length > 0) {
          firstImage = imageUrls[0];
        }
        console.log("FIRST IMAGE FROM LISTING TABLE");
        console.log(firstImage);

        return cellValue ? (
          <div className="relative w-16 h-16">
            <UImage
              src={firstImage}
              as={Image}
              alt="Property"
              width={75}
              height={75}
              className="object-cover rounded"
            />
          </div>
        ) : null;

      case "term":
        // console.log('Term:', cellValue);
        if (cellValue) {
          //TODO FIX THIS:
          // @ts-ignore
          const term = cellValue["term"] || "";
          // console.log('Term:', term);

          return (
            <Chip
              variant="flat"
              color="primary"
              size="sm"
              startContent={<CalendarDays className="mr-1 -ml-1" />}
            >
              {term}
            </Chip>
          );
        } else {
          return "-";
        }
      case "maturity_date":
        try {
          // If it's a date string, format it
          const date = new Date(cellValue as string);
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString();
          }
          // If it's not a valid date, return the string value
          return String(cellValue || "-");
        } catch {
          return String(cellValue || "-");
        }

      case "actions":
        return (
          <div className="flex gap-2">
            <Icon
              icon="solar:eye-linear"
              className="cursor-pointer text-default-400 hover:text-default-600"
              height={20}
              width={20}
            />
            <Link href={`/listings/listing?id=${item.listingId}`}>
              <Icon
                icon="solar:square-arrow-right-up-linear"
                className="cursor-pointer text-default-400 hover:text-default-600"
                height={20}
                width={20}
              />
            </Link>
          </div>
        );

      default:
        return cellValue ? String(cellValue) : "-";
    }
  };

  const topContent = useMemo(() => {
    return (
      <div className="flex items-center gap-4 overflow-auto px-[6px] py-[4px]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4">
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
            <div>
              <Popover placement="bottom">
                <PopoverTrigger>
                  <Button
                    className="bg-default-100 text-default-800"
                    size="sm"
                    startContent={
                      <Icon
                        className="text-default-400"
                        icon="solar:tuning-2-linear"
                        width={16}
                      />
                    }
                  >
                    Filter
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="flex w-full flex-col gap-6 px-2 py-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-small font-bold">Filters</span>

                      <RangeSlider
                        label="Price Range"
                        value={amountRange}
                        onChange={setAmountRange}
                        maxValue={1000000}
                        minValue={0}
                        step={10000}
                        formatOptions={{ style: "currency", currency: "USD" }}
                      />

                      <RangeSlider
                        label="Interest Rate"
                        value={interestRange}
                        onChange={setInterestRange}
                        maxValue={30}
                        minValue={0}
                        step={1}
                      />

                      <RangeSlider
                        label="LTV"
                        value={ltvRange}
                        onChange={setLtvRange}
                        maxValue={100}
                        minValue={0}
                        step={1}
                      />
                    </div>

                    <RadioGroup
                      label="List Date"
                      value={dateFilter}
                      onValueChange={setDateFilter}
                    >
                      <Radio value="all">All</Radio>
                      <Radio value="last7Days">Last 7 days</Radio>
                      <Radio value="last30Days">Last 30 days</Radio>
                      <Radio value="last60Days">Last 60 days</Radio>
                    </RadioGroup>

                    <RadioGroup
                      label="Mortgage Type"
                      value={mortgageTypeFilter}
                      onValueChange={setMortgageTypeFilter}
                    >
                      <Radio value="all">All</Radio>
                      <Radio value="first">First</Radio>
                      <Radio value="second">Second</Radio>
                      <Radio value="more">More</Radio>
                    </RadioGroup>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="bg-default-100 text-default-800"
                    size="sm"
                    startContent={
                      <Icon
                        className="text-default-400"
                        icon="solar:sort-linear"
                        width={16}
                      />
                    }
                  >
                    Sort
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Sort"
                  items={columns.filter((c) => c.uid !== "actions")}
                >
                  {(item) => (
                    <DropdownItem
                      key={item.uid}
                      onPress={() => {
                        setSortDescriptor({
                          column: item.uid,
                          direction:
                            sortDescriptor.direction === "ascending"
                              ? "descending"
                              : "ascending",
                        });
                      }}
                    >
                      {item.name}
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
            <div>
              <Dropdown closeOnSelect={false}>
                <DropdownTrigger>
                  <Button
                    className="bg-default-100 text-default-800"
                    size="sm"
                    startContent={
                      <Icon
                        className="text-default-400"
                        icon="solar:sort-horizontal-linear"
                        width={16}
                      />
                    }
                  >
                    Columns
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Columns"
                  items={columns.filter((c) => !["actions"].includes(c.uid))}
                  selectedKeys={visibleColumns}
                  selectionMode="multiple"
                  onSelectionChange={setVisibleColumns}
                >
                  {(item) => (
                    <DropdownItem key={item.uid}>{item.name}</DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>

          <Divider className="h-5" orientation="vertical" />

          {enableRowSelection && (
            <>
              <div className="whitespace-nowrap text-sm text-default-800">
                {filterSelectedKeys === "all"
                  ? "All items selected"
                  : `${filterSelectedKeys.size} Selected`}
              </div>

              {(filterSelectedKeys === "all" ||
                filterSelectedKeys.size > 0) && (
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      className="bg-default-100 text-default-800"
                      endContent={
                        <Icon
                          className="text-default-400"
                          icon="solar:alt-arrow-down-linear"
                        />
                      }
                      size="sm"
                      variant="flat"
                    >
                      Selected Actions
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Selected Actions">
                    <DropdownItem
                      key="approve"
                      onPress={() => handleSelectedAction("approve")}
                    >
                      Approve
                    </DropdownItem>
                    <DropdownItem
                      key="reject"
                      onPress={() => handleSelectedAction("reject")}
                    >
                      Reject
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              )}
            </>
          )}
        </div>
      </div>
    );
  }, [
    filterValue,
    amountRange,
    interestRange,
    ltvRange,
    dateFilter,
    sortDescriptor,
    setAmountRange,
    setInterestRange,
    setLtvRange,
    setDateFilter,
    onSearchChange,
    visibleColumns,
    filterSelectedKeys,
    setVisibleColumns,
    enableRowSelection,
    mortgageTypeFilter,
    setMortgageTypeFilter,
  ]);

  const topBar = useMemo(() => {
    return (
      <div className="mb-[18px] flex items-center justify-between">
        <div className="flex w-[226px] items-center gap-2">
          <h1 className="text-2xl font-[700] leading-[32px]">
            Property Listings
          </h1>
          <Chip
            className="hidden items-center text-default-500 sm:flex"
            size="sm"
            variant="flat"
          >
            {listings.length}
          </Chip>
        </div>
        <Button
          onPress={() => router.push("/broker/dashboard/newlisting")}
          color="primary"
          isIconOnly
          className="w-10 h-10"
        >
          {/* <Icon icon="solar:plus-linear" width={20} /> */}
          <PlusIcon className="w-5 h-5" />
        </Button>
      </div>
    );
  }, []);

  const bottomContent = useMemo(() => {
    return (
      <div className="flex flex-col items-center justify-between gap-2 px-2 py-2 sm:flex-row">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        {enableRowSelection && (
          <div className="flex items-center justify-end gap-6">
            <span className="text-small text-default-400">
              {filterSelectedKeys === "all"
                ? "All items selected"
                : `${filterSelectedKeys.size} of ${filteredItems.length} selected`}
            </span>
            <div className="flex items-center gap-3">
              <Button
                isDisabled={page === 1}
                size="sm"
                variant="flat"
                onPress={onPreviousPage}
              >
                Previous
              </Button>
              <Button
                isDisabled={page === pages}
                size="sm"
                variant="flat"
                onPress={onNextPage}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }, [
    filterSelectedKeys,
    page,
    pages,
    filteredItems.length,
    onPreviousPage,
    onNextPage,
    enableRowSelection,
  ]);

  const handleMemberClick = useMemoizedCallback(() => {
    setSortDescriptor({
      column: "memberInfo",
      direction:
        sortDescriptor.direction === "ascending" ? "descending" : "ascending",
    });
  });
  // console.log('Sorted items:', sortedItems);
  // console.log('Filtered items:', filteredItems);
  // console.log('Visible columns:', visibleColumns);
  return (
    <div className="h-full w-full p-6">
      {topBar}
      <Table
        isHeaderSticky
        aria-label="Property listings table"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          td: "before:bg-transparent",
        }}
        selectedKeys={enableRowSelection ? filterSelectedKeys : undefined}
        selectionMode={enableRowSelection ? "multiple" : "none"}
        // @ts-ignore
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={enableRowSelection ? onSelectionChange : undefined}
        onSortChange={setSortDescriptor}
        columns={columns.filter((column) => isColumnVisible(column.uid))}
      >
        <TableHeader>
          {columns
            .filter((column) => isColumnVisible(column.uid))
            .map((column) => (
              <TableColumn
                key={column.uid}
                allowsSorting={column.uid !== "actions"}
              >
                {column.name}
              </TableColumn>
            ))}
        </TableHeader>
        <TableBody items={sortedItems} emptyContent={"No listings found"}>
          {(item) => (
            <TableRow key={item.listingId}>
              {(columnKey) => (
                <TableCell>
                  {isColumnVisible(columnKey.toString())
                    ? // @ts-ignore
                      renderCell(item, columnKey)
                    : null}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
