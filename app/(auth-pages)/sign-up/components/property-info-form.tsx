"use client";

import React from "react";
import { Input, Select, SelectItem, Textarea } from "@heroui/react";
import { cn } from "@heroui/react";

import { AddressAutocomplete } from "@/components/ui/address-autocomplete";
import { useListingForm } from "./ListingFormContext";
import { AddressDetails } from "@/components/ui/address-autocomplete";
export type PropertyInfoFormProps = React.HTMLAttributes<HTMLFormElement>;

const PropertyInfoForm = React.forwardRef<
  HTMLFormElement,
  PropertyInfoFormProps
>(({ className, ...props }, ref) => {
  const { formData, updateFormData } = useListingForm();

  const inputProps = {
    labelPlacement: "outside" as const,
    classNames: {
      label:
        "text-small font-medium text-default-700 group-data-[filled-within=true]:text-default-700",
    },
  };

  const propertyTypes = [
    { label: "Residential Single Family", value: "residential-single" },
    { label: "Residential Multi-Family", value: "residential-multi" },
    { label: "Industrial", value: "industrial" },
  ];

  const handleAddressSelect = (addressDetails: any) => {
    updateFormData({
      propertyAddress: addressDetails.streetAddress.trim(),
      propertyCity: addressDetails.city,
      propertyProvince: addressDetails.province,
      propertyPostalCode: addressDetails.postalCode,
      propertyCountry: addressDetails.country,
      propertyLatitude: addressDetails.latitude,
      propertyLongitude: addressDetails.longitude,
      fullAddressDetails: {
        ...addressDetails,
        unitNumber: addressDetails.unitNumber || "",
        streetAddress: addressDetails.streetAddress,
        city: addressDetails.city,
        province: addressDetails.province,
        postalCode: addressDetails.postalCode,
        country: addressDetails.country,
        latitude: addressDetails.latitude,
        longitude: addressDetails.longitude,
        formattedAddress: addressDetails.formattedAddress,
      },
    });
  };

  return (
    <>
      <div className="text-3xl font-bold leading-9 text-default-foreground">
        Property Location
      </div>
      <div className="py-4 text-default-500">
        Please provide the property details
      </div>
      <form
        ref={ref}
        className={cn("flex flex-col gap-4 py-8", className)}
        {...props}
      >
        {/* Property Address */}
        <AddressAutocomplete
          {...inputProps}
          label="Property Address"
          onAddressSelect={handleAddressSelect}
          defaultValue={formData.fullAddressDetails as AddressDetails}
        />

        {/* Property Type */}
        <Select
          {...inputProps}
          label="Property Type"
          placeholder="Select property type"
          value={formData.propertyType}
          onChange={(e) => updateFormData({ propertyType: e.target.value })}
        >
          {propertyTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </Select>
        {/* Property Description */}
        <Textarea
          {...inputProps}
          label="Property Description"
          placeholder="Enter property description"
          value={formData.propertyDescription}
          onChange={(e) =>
            updateFormData({ propertyDescription: e.target.value })
          }
          minRows={4}
        />
      </form>
    </>
  );
});

PropertyInfoForm.displayName = "PropertyInfoForm";

export default PropertyInfoForm;
