"use client";

import type { InputProps, SelectProps } from "@heroui/react";

import React, { useState } from "react";
import { Input, Select, SelectItem } from "@heroui/react";
import { cn } from "@heroui/react";

import companyTypes from "./company-types";
import states from "./states";
import companyIndustries from "./company-industries";
import { FileUpload } from "@/components/ui/file-upload";
import { useListingForm } from "./ListingFormContext";

export type CompanyInformationFormProps = React.HTMLAttributes<HTMLFormElement>;

const CompanyInformationForm = React.forwardRef<
  HTMLFormElement,
  CompanyInformationFormProps
>(({ className, ...props }, ref) => {
  const { formData, updateFormData } = useListingForm();

  const inputProps: Pick<InputProps, "labelPlacement" | "classNames"> = {
    labelPlacement: "outside",
    classNames: {
      label:
        "text-small font-medium text-default-700 group-data-[filled-within=true]:text-default-700",
    },
  };

  const selectProps: Pick<SelectProps, "labelPlacement" | "classNames"> = {
    labelPlacement: "outside",
    classNames: {
      label:
        "text-small font-medium text-default-700 group-data-[filled=true]:text-default-700",
    },
  };

  const [files, setFiles] = useState<File[]>([]);

  const handleDocumentChange = (files: File[]) => {
    updateFormData({ listingDocuments: files });
  };

  const handleImageChange = (files: File[]) => {
    updateFormData({ listingImages: files });
  };

  return (
    <>
      <div className="text-3xl font-bold leading-9 text-default-foreground">
        Property Documents & Images
      </div>
      <div className="py-4 text-default-500">
        Drag and drop documents and images for your listing or click to upload
      </div>
      <form
        ref={ref}
        className={cn("flex flex-col gap-8 py-8", className)}
        {...props}
      >
        {/* Image Upload */}
        <div>
          <FileUpload
            onChange={handleImageChange}
            id="image-upload"
            label="Upload Images"
            showHint={false}
            value={formData.listingImages || []}
          />
        </div>

        {/* Document Upload */}
        <div>
          <FileUpload
            onChange={handleDocumentChange}
            id="document-upload"
            label="Upload Documents"
            showHint={false}
            value={formData.listingDocuments || []}
          />
        </div>
      </form>
    </>
  );
});

CompanyInformationForm.displayName = "CompanyInformationForm";

export default CompanyInformationForm;
