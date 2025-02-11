import type { Selection, SortDescriptor } from "@heroui/react";
import { useCallback, useMemo, useState, useEffect } from "react";
import type { Database } from "@/types/supabase";

type Property = {
  listingDateActive: string;
  listingId: string;
  listedDate: string | null;
  propertyId: string;
  address: unknown;
  amount: number;
  interestRate: number;
  estimatedFairMarketValue: number;
  propertyType: string;
  imgs: string;
  privateDocs: string;
  mortgageType: number;
  priorEncumbrances: string;
  term: string;
  region: string;
  ltv: number;
  dateFunded: string;
};

// Initialize the JS client
// import { createClient } from '@supabase/supabase-js'
// export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')

// export const pullListingTableData = async () => {
//   const { data: properties, error } = await supabase.from('properties').select('*')
//   return properties
// }

export const useTableFilters = () => {
  const [filterValue, setFilterValue] = useState("");
  const [amountRange, setAmountRange] = useState<[number, number]>([
    0, 10000000,
  ]);
  const [interestRange, setInterestRange] = useState<[number, number]>([
    0, 100,
  ]);
  const [ltvRange, setLtvRange] = useState<[number, number]>([0, 100]);
  const [dateFilter, setDateFilter] = useState("all");
  const [mortgageTypeFilter, setMortgageTypeFilter] = useState("all");

  const itemFilter = useCallback(
    (property: Property) => {
      const [minAmount, maxAmount] = amountRange;
      const [minInterest, maxInterest] = interestRange;
      const [minLtv, maxLtv] = ltvRange;
      const allDates = dateFilter === "all";

      // Convert mortgage type to number for comparison
      const mortgageTypeNum = Number(property.mortgageType);

      // Add debug logging
      console.log("Filtering property:", {
        propertyMortgageType: mortgageTypeNum,
        filterValue: mortgageTypeFilter,
        matches:
          mortgageTypeFilter === "all" ||
          (mortgageTypeFilter === "first" && mortgageTypeNum === 1) ||
          (mortgageTypeFilter === "second" && mortgageTypeNum === 2) ||
          (mortgageTypeFilter === "more" && mortgageTypeNum > 2),
      });

      const mortgageTypeMatches =
        mortgageTypeFilter === "all" ||
        (mortgageTypeFilter === "first" && mortgageTypeNum === 1) ||
        (mortgageTypeFilter === "second" && mortgageTypeNum === 2) ||
        (mortgageTypeFilter === "more" && mortgageTypeNum > 2);

      return (
        property.amount >= minAmount &&
        property.amount <= maxAmount &&
        property.interestRate >= minInterest &&
        property.interestRate <= maxInterest &&
        property.ltv >= minLtv &&
        property.ltv <= maxLtv &&
        mortgageTypeMatches &&
        (allDates ||
          new Date(
            new Date().getTime() -
              +(dateFilter.match(/(\d+)(?=Days)/)?.[0] ?? 0) *
                24 *
                60 *
                60 *
                1000
          ) <= new Date(property.listingDateActive))
      );
    },
    [dateFilter, amountRange, interestRange, ltvRange, mortgageTypeFilter]
  );

  return {
    filterValue,
    setFilterValue,
    amountRange,
    setAmountRange,
    interestRange,
    setInterestRange,
    ltvRange,
    setLtvRange,
    dateFilter,
    setDateFilter,
    mortgageTypeFilter,
    setMortgageTypeFilter,
    itemFilter,
  };
};

export const useTableSelection = (
  filteredItems: Property[],
  filterValue: string
) => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

  const filterSelectedKeys = useMemo(() => {
    if (selectedKeys === "all") return selectedKeys;
    let resultKeys = new Set<string>();

    if (filterValue) {
      filteredItems.forEach((item) => {
        const stringId = String(item.listingId);
        if ((selectedKeys as Set<string>).has(stringId)) {
          resultKeys.add(stringId);
        }
      });
    } else {
      resultKeys = selectedKeys as Set<string>;
    }

    return resultKeys;
  }, [selectedKeys, filteredItems, filterValue]);

  const onSelectionChange = useCallback((keys: Selection) => {
    setSelectedKeys(keys);
  }, []);

  return {
    selectedKeys,
    setSelectedKeys,
    filterSelectedKeys,
    onSelectionChange,
  };
};

export const useTablePagination = (filteredItems: Property[]) => {
  const [rowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  return {
    page,
    setPage,
    pages,
    items,
    onNextPage,
    onPreviousPage,
  };
};

export const useTableSort = () => {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "listingId",
    direction: "ascending",
  });

  const sortItems = useCallback(
    (items: Property[]) => {
      if (!items.length) return [];

      return [...items].sort((a: Property, b: Property) => {
        const col = sortDescriptor.column as keyof Property;

        let first = a[col] as string | number;
        let second = b[col] as string | number;

        if (typeof first !== "number" && typeof second !== "number") {
          first = String(first);
          second = String(second);
        }

        const cmp = first < second ? -1 : first > second ? 1 : 0;
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      });
    },
    [sortDescriptor]
  );

  return {
    sortDescriptor,
    setSortDescriptor,
    sortItems,
  };
};

export const useListingTable = (listings: Property[]) => {
  const [isLoading, setIsLoading] = useState(true);
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set([
      "imgs",
      "address",
      "amount",
      "interestRate",
      "ltv",
      "propertyType",
      "region",
      "estimatedFairMarketValue",
      "dateFunded",
      "term",
      "mortgageType",
      "listedDate",
      "actions",
    ])
  );

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const {
    filterValue,
    setFilterValue,
    amountRange,
    setAmountRange,
    interestRange,
    setInterestRange,
    ltvRange,
    setLtvRange,
    dateFilter,
    setDateFilter,
    mortgageTypeFilter,
    setMortgageTypeFilter,
    itemFilter,
  } = useTableFilters();

  const filteredItems = useMemo(() => {
    let filtered = [...listings];
    console.log("Initial items:", filtered);

    if (filterValue) {
      filtered = filtered.filter((property) => {
        const searchTerm = filterValue.toLowerCase();
        const matches = Object.values(property).some((value) => {
          const stringValue = String(value || "").toLowerCase();
          return stringValue.includes(searchTerm);
        });
        console.log("Search filter result:", { property, matches });
        return matches;
      });
    }

    filtered = filtered.filter(itemFilter);
    console.log("After all filters:", filtered);

    return filtered;
  }, [filterValue, itemFilter, listings]);

  const { selectedKeys, filterSelectedKeys, onSelectionChange } =
    useTableSelection(filteredItems, filterValue);

  const { page, setPage, pages, items, onNextPage, onPreviousPage } =
    useTablePagination(filteredItems);

  const { sortDescriptor, setSortDescriptor, sortItems } = useTableSort();

  const sortedItems = useMemo(() => sortItems(items), [items, sortItems]);

  const onSearchChange = useCallback(
    (value?: string) => {
      if (value) {
        setFilterValue(value);
        setPage(1);
      } else {
        setFilterValue("");
      }
    },
    [setFilterValue, setPage]
  );

  return {
    filterValue,
    setFilterValue,
    amountRange,
    setAmountRange,
    interestRange,
    setInterestRange,
    ltvRange,
    setLtvRange,
    dateFilter,
    setDateFilter,
    mortgageTypeFilter,
    setMortgageTypeFilter,
    selectedKeys,
    filterSelectedKeys,
    onSelectionChange,
    page,
    setPage,
    pages,
    onNextPage,
    onPreviousPage,
    sortDescriptor,
    setSortDescriptor,
    sortedItems,
    filteredItems,
    onSearchChange,
    isLoading,
    visibleColumns,
    setVisibleColumns,
  };
};
