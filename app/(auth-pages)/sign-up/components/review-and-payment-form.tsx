"use client";

import type { InputProps, SelectProps } from "@heroui/react";

import React from "react";
import {
  Input,
  Avatar,
  Autocomplete,
  AutocompleteItem,
  Select,
  SelectItem,
  Checkbox,
  Link,
  Tabs,
  Tab,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";
import { useListingForm } from "./ListingFormContext";
import { ListingData, useListingUpload } from "@/hooks/useListingUpload";
import { ListingFormData } from "./ListingFormContext";
import countries, { type countryProp } from "./countries";
import states from "./states";

export type ReviewAndPaymentFormProps = React.HTMLAttributes<HTMLFormElement>;

const ReviewAndPaymentForm = React.forwardRef<
  HTMLFormElement,
  ReviewAndPaymentFormProps
>(({ className, ...props }, ref) => {
  const appearanceNoneClassName =
    "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

  const inputProps: Pick<InputProps, "labelPlacement" | "classNames"> = {
    labelPlacement: "outside",
    classNames: {
      label:
        "text-small font-medium text-default-700 group-data-[filled-within=true]:text-default-700",
    },
  };

  const numberInputProps: Pick<InputProps, "labelPlacement" | "classNames"> = {
    labelPlacement: "outside",
    classNames: {
      label:
        "text-small font-medium text-default-700 group-data-[filled-within=true]:text-default-700",
      input: appearanceNoneClassName,
    },
  };

  const selectProps: Pick<SelectProps, "labelPlacement" | "classNames"> = {
    labelPlacement: "outside",
    classNames: {
      label:
        "text-small font-medium text-default-700 group-data-[filled=true]:text-default-700",
    },
  };

  const { formData, updateFormData } = useListingForm();
  const { uploadListing } = useListingUpload();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.loanAmount) return;

    const listingData: ListingData = {
      priorEncumbrances: formData.priorEncumbrances || 0,
      priorEncumbrancesWith: formData.priorEncumbrancesWith || "",
      fairMarketValue: formData.fairMarketValue || 0,
      loanAmount: formData.loanAmount,
      mortgageType: formData.mortgageType || "",
      interestRate: formData.interestRate || 0,
      term: formData.term || "",
      ltv: formData.ltv || 0,
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
      email: formData.email || "",
      phoneNumber: formData.phoneNumber || "",
      entityName: formData.entityName || "",
      cardholderName: formData.cardholderName || "",
      country: formData.country || "",
      zipCode: formData.zipCode || "",
      state: formData.state || "",
      propertyType: formData.propertyType || "",
      propertyAddress: formData.propertyAddress || "",
      propertyCity: formData.propertyCity || "",
      propertyProvince: formData.propertyProvince || "",
      propertyPostalCode: formData.propertyPostalCode || "",
      propertyCountry: formData.propertyCountry || "",
      propertyLatitude: formData.propertyLatitude || 0,
      propertyLongitude: formData.propertyLongitude || 0,
      squareMeters: formData.squareMeters || 0,
      numberOfUnits: formData.numberOfUnits || 0,
      propertyDescription: formData.propertyDescription || "",
      fullAddressDetails: formData.fullAddressDetails || "",
    } as ListingData;

    const result = await uploadListing(
      listingData
      // formData.listingDocuments || [],
      // formData.listingImages || []
    );

    if (result.success) {
      console.log("Listing created successfully:", result.listingId);
      // Handle success (e.g., redirect to success page)
    } else {
      console.error("Failed to create listing:", result.error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <>
      <div className="text-3xl font-bold leading-9 text-default-foreground">
        Review & Contact Information
      </div>
      <div className="py-4 text-base leading-5 text-default-500">
        You are almost done 🎉
      </div>

      {/* Display review information */}
      <div className="mb-6 rounded-lg bg-content1 p-6">
        <h3 className="mb-4 text-xl font-semibold">Listing Details</h3>
        <div className="grid gap-4">
          <div>
            <p className="text-sm text-default-500">Loan Amount</p>
            <p className="text-base">
              ${formData.loanAmount?.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-default-500">Interest Rate</p>
            <p className="text-base">{formData.interestRate}%</p>
          </div>
          <div>
            <p className="text-sm text-default-500">Term</p>
            <p className="text-base">{formData.term}</p>
          </div>
          <div>
            <p className="text-sm text-default-500">LTV</p>
            <p className="text-base">{formData.ltv}%</p>
          </div>

          {/* Add Property Address Section */}
          {formData.fullAddressDetails && (
            <>
              <div className="mt-4 border-t pt-4">
                <p className="text-sm font-semibold text-default-500">
                  Property Location
                </p>
                <p className="mt-1 text-base">
                  {formData.fullAddressDetails.formattedAddress}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-default-500">
                  <div>
                    <p>City</p>
                    <p className="text-default-700">
                      {formData.fullAddressDetails.city}
                    </p>
                  </div>
                  <div>
                    <p>Province</p>
                    <p className="text-default-700">
                      {formData.fullAddressDetails.province}
                    </p>
                  </div>
                  <div>
                    <p>Postal Code</p>
                    <p className="text-default-700">
                      {formData.fullAddressDetails.postalCode}
                    </p>
                  </div>
                  <div>
                    <p>Country</p>
                    <p className="text-default-700">
                      {formData.fullAddressDetails.country}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <form
        ref={ref}
        className={cn("flex grid grid-cols-12 flex-col gap-4 py-8", className)}
        onSubmit={handleSubmit}
        {...props}
      >
        <Input
          className="col-span-12 md:col-span-6"
          label="First Name"
          name="firstName"
          placeholder="John"
          value={formData.firstName}
          onChange={(e) => updateFormData({ firstName: e.target.value })}
          required
          {...inputProps}
        />

        <Input
          className="col-span-12 md:col-span-6"
          label="Last Name"
          name="lastName"
          placeholder="Doe"
          value={formData.lastName}
          onChange={(e) => updateFormData({ lastName: e.target.value })}
          required
          {...inputProps}
        />

        <Input
          className="col-span-12"
          label="Email Address"
          name="email"
          placeholder="john.doe@acme.com"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData({ email: e.target.value })}
          required
          {...inputProps}
        />

        <Input
          className="col-span-12"
          label="Phone Number"
          name="phoneNumber"
          placeholder="(555) 555-5555"
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => updateFormData({ phoneNumber: e.target.value })}
          required
          {...inputProps}
        />

        <Input
          className="col-span-12 md:col-span-6"
          label="Entity Name"
          name="entity-name"
          placeholder="Inc."
          value={formData.entityName}
          onChange={(e) => updateFormData({ entityName: e.target.value })}
          required
          {...inputProps}
        />

        <Input
          className="col-span-12 md:col-span-6"
          label="Contact Name"
          name="contact-name"
          placeholder="John Doe"
          value={formData.cardholderName}
          onChange={(e) => updateFormData({ cardholderName: e.target.value })}
          required
          {...inputProps}
        />

        <Autocomplete
          className="col-span-12"
          defaultItems={countries}
          inputProps={{
            classNames: inputProps.classNames,
          }}
          label="Country"
          labelPlacement="outside"
          name="country"
          placeholder="Select country"
          selectedKey={formData.country}
          onSelectionChange={(key) =>
            updateFormData({ country: key as string })
          }
          required
          showScrollIndicators={false}
        >
          {(item: countryProp) => (
            <AutocompleteItem
              key={item.code}
              startContent={
                <Avatar
                  alt="Country Flag"
                  className="h-6 w-6"
                  src={`https://flagcdn.com/${item.code.toLowerCase()}.svg`}
                />
              }
              value={item.code}
            >
              {item.name}
            </AutocompleteItem>
          )}
        </Autocomplete>

        <Input
          className="col-span-12 md:col-span-6"
          label="Postal Code"
          name="postal-code"
          placeholder="Postal Code"
          value={formData.zipCode}
          onChange={(e) => updateFormData({ zipCode: e.target.value })}
          required
          {...inputProps}
        />

        <Select
          className="col-span-12 md:col-span-6"
          items={states}
          label="Province"
          name="province"
          placeholder="Province"
          selectedKeys={formData.state ? [formData.state] : []}
          onSelectionChange={(keys) =>
            updateFormData({ state: Array.from(keys)[0] as string })
          }
          required
          {...selectProps}
        >
          {(registrationState) => (
            <SelectItem key={registrationState.value}>
              {registrationState.title}
            </SelectItem>
          )}
        </Select>

        <Checkbox
          defaultSelected
          className="col-span-12 m-0 p-2 text-left"
          color="secondary"
          name="terms-and-privacy"
          size="md"
          required
        >
          I read and agree with the
          <Link className="mx-1 text-secondary underline" href="#" size="md">
            Terms
          </Link>
          <span>and</span>
          <Link className="ml-1 text-secondary underline" href="#" size="md">
            Privacy Policy
          </Link>
          .
        </Checkbox>

        <button
          type="submit"
          className="col-span-12 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
        >
          Submit Listing
        </button>
      </form>
    </>
  );
});

ReviewAndPaymentForm.displayName = "ReviewAndPaymentForm";

export default ReviewAndPaymentForm;
