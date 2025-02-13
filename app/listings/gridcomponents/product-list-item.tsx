"use client";

import React from "react";
import { Button, Image } from "@heroui/react";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import RatingRadioGroup from "./rating-radio-group";

export type ProductListItemColor = {
  name: string;
  hex: string;
};

export type ProductItem = {
  listingId: string;
  address: unknown;
  amount: number;
  interestRate: number;
  propertyType: string;
  imgUrls: string[];
  href?: string;
  size?: string;
  isNew?: boolean;
  availableColors?: ProductListItemColor[];
  description?: string;
};

export type ProductListItemProps = {
  className?: string;
  isPopular?: boolean;
  removeWrapper?: boolean;
} & ProductItem;

const ProductListItem = React.forwardRef<HTMLDivElement, ProductListItemProps>(
  (
    {
      address,
      amount,
      interestRate,
      description,
      imgUrls,
      isNew,
      isPopular,
      availableColors,
      removeWrapper,
      className,
      href,
      listingId,
    },
    ref
  ) => {
    const router = useRouter();
    const [isStarred, setIsStarred] = React.useState(false);
    const hasColors = availableColors && availableColors?.length > 0;

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-80 max-w-full flex-none scroll-ml-6 flex-col gap-3 rounded-large bg-content1 p-4 shadow-medium",
          {
            "rounded-none bg-transparent shadow-none": removeWrapper,
          },
          className
        )}
      >
        {isNew && isPopular ? (
          <span className="absolute right-7 top-7 z-20 text-tiny font-semibold text-default-400">
            NEW
          </span>
        ) : null}
        <Button
          isIconOnly
          className={cn("absolute right-6 top-6 z-20", {
            hidden: isPopular,
          })}
          radius="full"
          size="sm"
          variant="flat"
          onPress={() => setIsStarred(!isStarred)}
        >
          <Icon
            className={cn("text-default-500", {
              "text-warning": isStarred,
            })}
            icon="solar:star-bold"
            width={16}
          />
        </Button>
        <div
          className={cn(
            "relative flex h-52 max-h-full w-full flex-col items-center justify-center overflow-visible rounded-medium bg-content2",
            {
              "h-full justify-between": isPopular,
            }
          )}
        >
          <div
            className={cn("flex flex-col gap-2 px-4 pt-6", {
              hidden: !isPopular,
            })}
          >
            <h3 className="text-xl font-semibold tracking-tight text-default-800">
              {address as string}
            </h3>
            <p className="text-small text-default-500">{description}</p>
          </div>
          <Image
            removeWrapper
            alt={address as string}
            className={cn(
              "z-0 h-full max-h-full w-full max-w-[80%] overflow-visible object-contain object-center hover:scale-110",
              {
                "flex h-56 w-56 items-center": isPopular,
                "mb-2": hasColors,
              }
            )}
            src={imgUrls?.[0] || "/placeholder-image.jpg"}
          />
          {hasColors ? (
            <div className="absolute bottom-3">
              <h4 className="sr-only">Available colors</h4>
              <ul className="mt-auto flex items-center justify-center space-x-3 pt-6">
                {availableColors.map((color) => (
                  <li
                    key={color.name}
                    className="h-2 w-2 rounded-full border border-default-300 border-opacity-10"
                    style={{ backgroundColor: color.hex }}
                  >
                    <span className="sr-only">{color.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <div className="flex flex-col gap-3 px-1">
          <div
            className={cn("flex items-center justify-between", {
              hidden: isPopular,
            })}
          >
            <h3 className="text-medium font-medium text-default-700">
              {String(address)}
            </h3>
          </div>
          {description && !isPopular ? (
            <p className="text-small text-default-500">{description}</p>
          ) : null}
          {interestRate !== undefined ? (
            <div className="flex items-center gap-2">
              <p className="text-small text-default-400">
                Interest Rate: {interestRate}%
              </p>
            </div>
          ) : null}
          <div className="flex items-center gap-2 text-medium font-medium text-default-500">
            <p>${amount}</p>
          </div>
          <div className="flex gap-2">
            {isPopular ? (
              <Button
                fullWidth
                className="bg-default-300/20 font-medium text-default-700"
                radius="lg"
                variant="flat"
              >
                Save
              </Button>
            ) : null}
            <Link href={`/listings/listing?id=${listingId}`} className="w-full">
              <Button
                fullWidth
                className="font-medium"
                color="primary"
                radius="lg"
                variant={isPopular ? "flat" : "solid"}
                onPress={() => {
                  router.push(`/listings/listing?id=${listingId}`);
                }}
              >
                View Listing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
);

ProductListItem.displayName = "ProductListItem";

export default ProductListItem;
