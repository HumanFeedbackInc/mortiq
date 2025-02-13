"use client";

import React from "react";
import { cn } from "@heroui/react";
import ProductListItem from "./product-list-item";

export type ProductGridProps = {
  itemClassName?: string;
  className?: string;
  items: {
    listingId: string;
    address: unknown;
    amount: number;
    interestRate: number;
    propertyType: string;
    imgUrls?: string[];
    region: string;
  }[];
};

const ProductsGrid = React.forwardRef<HTMLDivElement, ProductGridProps>(
  ({ itemClassName, className, items }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3",
          className
        )}
      >
        {items.map((item) => (
          <ProductListItem
            key={item.listingId}
            listingId={item.listingId}
            className={cn("w-full snap-start", itemClassName)}
            address={item.address}
            amount={item.amount}
            interestRate={item.interestRate}
            propertyType={item.propertyType}
            imgUrls={item.imgUrls || []}
            description={`${item.propertyType} in ${item.region}`}
          />
        ))}
      </div>
    );
  }
);

ProductsGrid.displayName = "ProductsGrid";

export default ProductsGrid;
